import { createHash } from "node:crypto";
import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import type { Payload } from "payload";

const FINGERPRINT_KEY = "cms-schema-fingerprint";
const SAFE_IDENT = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const SAFE_SQL_TYPE =
  /^(boolean|integer|jsonb|numeric(\(\d+(,\s*\d+)?\))?|serial|text|varchar(\(\d+\))?|timestamp(\(\d+\))?( with time zone| without time zone)?|double precision|bigint|real|date)$/i;

type QueryClient = {
  query: <T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ) => Promise<{ rows: T[]; rowCount: number | null }>;
  release: () => void;
};

type SqlColumn = {
  name: string;
  primary: boolean;
  notNull: boolean;
  enumValues?: readonly string[];
  getSQLType: () => string;
};

/**
 * Adds tables and columns the current CMS code expects, and nothing else.
 * Existing rows are left in place. Columns are never dropped or rewritten.
 */
export async function ensureSchema(payload: Payload): Promise<void> {
  try {
    await addMissingColumns(payload);
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: "Could not add missing CMS columns. Existing content was not changed.",
    });
  }
}

async function addMissingColumns(payload: Payload): Promise<void> {
  const db = payload.db as Payload["db"] & {
    pool?: { connect: () => Promise<unknown> };
    schema?: Record<string, unknown>;
  };
  if (!db.pool || !db.schema) return;

  const tables = Object.values(db.schema).flatMap((value) =>
    is(value, PgTable) ? [getTableConfig(value)] : [],
  );
  const fingerprint = schemaFingerprint(tables);
  const client = (await db.pool.connect()) as QueryClient;

  try {
    if ((await readFingerprint(client)) === fingerprint) return;

    await client.query("BEGIN");
    const existingColumns = await loadColumns(client);
    const existingEnums = await loadEnums(client);
    let createdTables = 0;
    let addedColumns = 0;

    for (const table of tables) {
      for (const column of table.columns as SqlColumn[]) {
        if (!column.enumValues?.length) continue;
        await ensureEnum(client, column, existingEnums);
      }

      const tableName = table.name;
      assertIdent(tableName);
      const have = existingColumns.get(tableName);
      if (!have) {
        await client.query(createTableSql(tableName, table.columns as SqlColumn[]));
        createdTables += 1;
        continue;
      }

      for (const column of table.columns as SqlColumn[]) {
        if (have.has(column.name)) continue;
        assertIdent(column.name);
        await client.query(
          `ALTER TABLE ${quoteIdent(tableName)} ADD COLUMN IF NOT EXISTS ${quoteIdent(column.name)} ${columnTypeSql(column)}`,
        );
        addedColumns += 1;
      }
    }

    await ensureCascadeForeignKeys(client);
    await ensureDataMigrations(client);

    await client.query("COMMIT");
    if (createdTables || addedColumns) {
      payload.logger.info({
        msg: `Added missing CMS schema: ${createdTables} tables, ${addedColumns} columns. Existing rows were kept.`,
      });
    }
    await writeFingerprint(client, fingerprint);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

function schemaFingerprint(
  tables: Array<{ name: string; columns: readonly { name: string }[] }>,
): string {
  const lines: string[] = ["migration_v7_cascade_foreign_keys_and_blueprint_fixes"];
  for (const table of [...tables].sort((a, b) => a.name.localeCompare(b.name))) {
    for (const column of table.columns as SqlColumn[]) {
      const values = column.enumValues?.join(",") ?? "";
      lines.push(`${table.name}.${column.name}:${column.getSQLType()}:${values}`);
    }
  }
  return createHash("sha256").update(lines.join("\n")).digest("hex");
}

async function loadColumns(client: QueryClient): Promise<Map<string, Set<string>>> {
  const { rows } = await client.query<{ table_name: string; column_name: string }>(
    `SELECT table_name, column_name
     FROM information_schema.columns
     WHERE table_schema = 'public'`,
  );
  const columns = new Map<string, Set<string>>();
  for (const row of rows) {
    const names = columns.get(row.table_name) ?? new Set<string>();
    names.add(row.column_name);
    columns.set(row.table_name, names);
  }
  return columns;
}

async function loadEnums(client: QueryClient): Promise<Map<string, Set<string>>> {
  const { rows } = await client.query<{ typname: string; enumlabel: string }>(
    `SELECT t.typname, e.enumlabel
     FROM pg_type t
     JOIN pg_enum e ON e.enumtypid = t.oid`,
  );
  const enums = new Map<string, Set<string>>();
  for (const row of rows) {
    const labels = enums.get(row.typname) ?? new Set<string>();
    labels.add(row.enumlabel);
    enums.set(row.typname, labels);
  }
  return enums;
}

async function ensureEnum(
  client: QueryClient,
  column: SqlColumn,
  existing: Map<string, Set<string>>,
): Promise<void> {
  const name = column.getSQLType();
  assertIdent(name);
  const values = column.enumValues ?? [];
  const labels = existing.get(name);
  if (!labels) {
    await client.query(
      `DO $$ BEGIN
        CREATE TYPE ${quoteIdent(name)} AS ENUM (${values.map(quoteLiteral).join(", ")});
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;`,
    );
    existing.set(name, new Set(values));
    return;
  }
  for (const value of values) {
    if (labels.has(value)) continue;
    await client.query(
      `ALTER TYPE ${quoteIdent(name)} ADD VALUE IF NOT EXISTS ${quoteLiteral(value)}`,
    );
    labels.add(value);
  }
}

function createTableSql(tableName: string, columns: readonly SqlColumn[]): string {
  const primary = columns.filter((column) => column.primary);
  const definitions = columns.map((column) => {
    assertIdent(column.name);
    const parts = [quoteIdent(column.name), columnTypeSql(column)];
    if (column.primary && primary.length === 1) parts.push("PRIMARY KEY");
    else if (column.notNull) parts.push("NOT NULL");
    return parts.join(" ");
  });
  if (primary.length > 1) {
    definitions.push(
      `PRIMARY KEY (${primary.map((column) => quoteIdent(column.name)).join(", ")})`,
    );
  }
  return `CREATE TABLE IF NOT EXISTS ${quoteIdent(tableName)} (${definitions.join(", ")})`;
}

function columnTypeSql(column: SqlColumn): string {
  const type = column.getSQLType();
  if (column.enumValues?.length) {
    assertIdent(type);
    return quoteIdent(type);
  }
  if (!SAFE_SQL_TYPE.test(type)) {
    throw new Error(`Unexpected column type ${type} on ${column.name}`);
  }
  return type;
}

async function readFingerprint(client: QueryClient): Promise<string | null> {
  const table = await client.query<{ exists: string | null }>(
    `SELECT to_regclass('public.payload_kv') AS exists`,
  );
  if (!table.rows[0]?.exists) return null;
  const { rows } = await client.query<{ data: { hash?: string } | null }>(
    `SELECT data FROM payload_kv WHERE key = $1 LIMIT 1`,
    [FINGERPRINT_KEY],
  );
  return rows[0]?.data?.hash ?? null;
}

async function writeFingerprint(client: QueryClient, fingerprint: string): Promise<void> {
  const table = await client.query<{ exists: string | null }>(
    `SELECT to_regclass('public.payload_kv') AS exists`,
  );
  if (!table.rows[0]?.exists) return;
  const data = JSON.stringify({ hash: fingerprint });
  const updated = await client.query(`UPDATE payload_kv SET data = $2::jsonb WHERE key = $1`, [
    FINGERPRINT_KEY,
    data,
  ]);
  if (updated.rowCount) return;
  await client.query(`INSERT INTO payload_kv (key, data) VALUES ($1, $2::jsonb)`, [
    FINGERPRINT_KEY,
    data,
  ]);
}

function assertIdent(name: string): void {
  if (!SAFE_IDENT.test(name)) throw new Error(`Unexpected database name ${name}`);
}

function quoteIdent(name: string): string {
  assertIdent(name);
  return `"${name}"`;
}

function quoteLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

async function ensureCascadeForeignKeys(client: QueryClient): Promise<void> {
  const cascades = [
    // Open roles
    {
      table: "open_roles_page_roles_responsibilities",
      constraint: "open_roles_page_roles_responsibilities_parent_fk",
      parentTable: "open_roles_page_roles",
    },
    {
      table: "open_roles_page_roles_requirements",
      constraint: "open_roles_page_roles_requirements_parent_fk",
      parentTable: "open_roles_page_roles",
    },

    // Service pages
    {
      table: "service_pages_sections_paragraphs",
      constraint: "service_pages_sections_paragraphs_parent_fk",
      parentTable: "service_pages_sections",
    },
    {
      table: "service_pages_sections_pointers",
      constraint: "service_pages_sections_pointers_parent_fk",
      parentTable: "service_pages_sections",
    },
    {
      table: "service_pages_sections_closing",
      constraint: "service_pages_sections_closing_parent_fk",
      parentTable: "service_pages_sections",
    },
    {
      table: "service_pages_sections",
      constraint: "service_pages_sections_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_logos",
      constraint: "service_pages_logos_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_client_tabs",
      constraint: "service_pages_client_tabs_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_clientTabs",
      constraint: "service_pages_clientTabs_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_projects",
      constraint: "service_pages_projects_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_faqs",
      constraint: "service_pages_faqs_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_experts",
      constraint: "service_pages_experts_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_related_blogs",
      constraint: "service_pages_related_blogs_parent_fk",
      parentTable: "service_pages",
    },
    {
      table: "service_pages_relatedBlogs",
      constraint: "service_pages_relatedBlogs_parent_fk",
      parentTable: "service_pages",
    },

    // Solution pages
    {
      table: "solution_pages_sections_paragraphs",
      constraint: "solution_pages_sections_paragraphs_parent_fk",
      parentTable: "solution_pages_sections",
    },
    {
      table: "solution_pages_sections_pointers",
      constraint: "solution_pages_sections_pointers_parent_fk",
      parentTable: "solution_pages_sections",
    },
    {
      table: "solution_pages_sections_closing",
      constraint: "solution_pages_sections_closing_parent_fk",
      parentTable: "solution_pages_sections",
    },
    {
      table: "solution_pages_sections",
      constraint: "solution_pages_sections_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_logos",
      constraint: "solution_pages_logos_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_client_tabs",
      constraint: "solution_pages_client_tabs_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_clientTabs",
      constraint: "solution_pages_clientTabs_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_projects",
      constraint: "solution_pages_projects_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_faqs",
      constraint: "solution_pages_faqs_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_experts",
      constraint: "solution_pages_experts_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_related_blogs",
      constraint: "solution_pages_related_blogs_parent_fk",
      parentTable: "solution_pages",
    },
    {
      table: "solution_pages_relatedBlogs",
      constraint: "solution_pages_relatedBlogs_parent_fk",
      parentTable: "solution_pages",
    },

    // Work service pages
    {
      table: "work_service_pages_sections_paragraphs",
      constraint: "work_service_pages_sections_paragraphs_parent_fk",
      parentTable: "work_service_pages_sections",
    },
    {
      table: "work_service_pages_sections_pointers",
      constraint: "work_service_pages_sections_pointers_parent_fk",
      parentTable: "work_service_pages_sections",
    },
    {
      table: "work_service_pages_sections_closing",
      constraint: "work_service_pages_sections_closing_parent_fk",
      parentTable: "work_service_pages_sections",
    },
    {
      table: "work_service_pages_sections",
      constraint: "work_service_pages_sections_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_logos",
      constraint: "work_service_pages_logos_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_client_tabs",
      constraint: "work_service_pages_client_tabs_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_clientTabs",
      constraint: "work_service_pages_clientTabs_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_projects",
      constraint: "work_service_pages_projects_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_faqs",
      constraint: "work_service_pages_faqs_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_experts",
      constraint: "work_service_pages_experts_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_related_blogs",
      constraint: "work_service_pages_related_blogs_parent_fk",
      parentTable: "work_service_pages",
    },
    {
      table: "work_service_pages_relatedBlogs",
      constraint: "work_service_pages_relatedBlogs_parent_fk",
      parentTable: "work_service_pages",
    },

    // Industry pages
    {
      table: "industry_pages_sections_paragraphs",
      constraint: "industry_pages_sections_paragraphs_parent_fk",
      parentTable: "industry_pages_sections",
    },
    {
      table: "industry_pages_sections_pointers",
      constraint: "industry_pages_sections_pointers_parent_fk",
      parentTable: "industry_pages_sections",
    },
    {
      table: "industry_pages_sections_closing",
      constraint: "industry_pages_sections_closing_parent_fk",
      parentTable: "industry_pages_sections",
    },
    {
      table: "industry_pages_sections",
      constraint: "industry_pages_sections_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_logos",
      constraint: "industry_pages_logos_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_client_tabs",
      constraint: "industry_pages_client_tabs_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_clientTabs",
      constraint: "industry_pages_clientTabs_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_projects",
      constraint: "industry_pages_projects_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_faqs",
      constraint: "industry_pages_faqs_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_experts",
      constraint: "industry_pages_experts_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_related_blogs",
      constraint: "industry_pages_related_blogs_parent_fk",
      parentTable: "industry_pages",
    },
    {
      table: "industry_pages_relatedBlogs",
      constraint: "industry_pages_relatedBlogs_parent_fk",
      parentTable: "industry_pages",
    },

    // Location pages
    {
      table: "location_pages_sections_paragraphs",
      constraint: "location_pages_sections_paragraphs_parent_fk",
      parentTable: "location_pages_sections",
    },
    {
      table: "location_pages_sections_pointers",
      constraint: "location_pages_sections_pointers_parent_fk",
      parentTable: "location_pages_sections",
    },
    {
      table: "location_pages_sections_blocks_paragraphs",
      constraint: "location_pages_sections_blocks_paragraphs_parent_fk",
      parentTable: "location_pages_sections_blocks",
    },
    {
      table: "location_pages_sections_blocks",
      constraint: "location_pages_sections_blocks_parent_fk",
      parentTable: "location_pages_sections",
    },
    {
      table: "location_pages_sections",
      constraint: "location_pages_sections_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_logos",
      constraint: "location_pages_logos_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_client_tabs",
      constraint: "location_pages_client_tabs_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_clientTabs",
      constraint: "location_pages_clientTabs_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_projects",
      constraint: "location_pages_projects_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_faqs",
      constraint: "location_pages_faqs_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_related_blogs",
      constraint: "location_pages_related_blogs_parent_fk",
      parentTable: "location_pages",
    },
    {
      table: "location_pages_relatedBlogs",
      constraint: "location_pages_relatedBlogs_parent_fk",
      parentTable: "location_pages",
    },

    // Blog posts
    {
      table: "blog_posts_blocks_arrows_items",
      constraint: "blog_posts_blocks_arrows_items_parent_fk",
      parentTable: "blog_posts_blocks_arrows",
    },
    {
      table: "blog_posts_blocks_arrows",
      constraint: "blog_posts_blocks_arrows_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_gallery_images",
      constraint: "blog_posts_blocks_gallery_images_parent_fk",
      parentTable: "blog_posts_blocks_gallery",
    },
    {
      table: "blog_posts_blocks_gallery",
      constraint: "blog_posts_blocks_gallery_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_image",
      constraint: "blog_posts_blocks_image_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_links_items",
      constraint: "blog_posts_blocks_links_items_parent_fk",
      parentTable: "blog_posts_blocks_links",
    },
    {
      table: "blog_posts_blocks_links",
      constraint: "blog_posts_blocks_links_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_note",
      constraint: "blog_posts_blocks_note_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_paragraphs_items",
      constraint: "blog_posts_blocks_paragraphs_items_parent_fk",
      parentTable: "blog_posts_blocks_paragraphs",
    },
    {
      table: "blog_posts_blocks_paragraphs",
      constraint: "blog_posts_blocks_paragraphs_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_quote",
      constraint: "blog_posts_blocks_quote_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_rich_parts",
      constraint: "blog_posts_blocks_rich_parts_parent_fk",
      parentTable: "blog_posts_blocks_rich",
    },
    {
      table: "blog_posts_blocks_rich",
      constraint: "blog_posts_blocks_rich_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_rows_items",
      constraint: "blog_posts_blocks_rows_items_parent_fk",
      parentTable: "blog_posts_blocks_rows",
    },
    {
      table: "blog_posts_blocks_rows",
      constraint: "blog_posts_blocks_rows_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_blocks_subhead",
      constraint: "blog_posts_blocks_subhead_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_faqs",
      constraint: "blog_posts_faqs_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_related_blogs",
      constraint: "blog_posts_related_blogs_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_sections",
      constraint: "blog_posts_sections_parent_fk",
      parentTable: "blog_posts",
    },
    {
      table: "blog_posts_topics",
      constraint: "blog_posts_topics_parent_fk",
      parentTable: "blog_posts",
    },
  ];

  for (const item of cascades) {
    const tableExists = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
      [item.table],
    );
    if (tableExists.rows.length === 0) continue;

    const parentTableExists = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
      [item.parentTable],
    );
    if (parentTableExists.rows.length === 0) continue;

    // Clean up any orphaned rows before attempting constraint addition
    await client.query(`
      DELETE FROM ${quoteIdent(item.table)}
      WHERE _parent_id IS NOT NULL
        AND _parent_id NOT IN (SELECT id FROM ${quoteIdent(item.parentTable)})
    `).catch(() => undefined);

    const { rows } = await client.query(
      `SELECT 1 FROM pg_constraint WHERE conname = $1`,
      [item.constraint],
    );
    if (rows.length === 0) {
      await client.query(
        `ALTER TABLE ${quoteIdent(item.table)}
         ADD CONSTRAINT ${quoteIdent(item.constraint)}
         FOREIGN KEY (_parent_id) REFERENCES ${quoteIdent(item.parentTable)}(id)
         ON DELETE CASCADE`,
      ).catch(() => undefined);
    }
  }
}

async function ensureDataMigrations(client: QueryClient): Promise<void> {
  // 1. Roles pointers migration to single textarea columns
  await client.query(`
    ALTER TABLE IF EXISTS open_roles_page_roles
    ADD COLUMN IF NOT EXISTS responsibilities text,
    ADD COLUMN IF NOT EXISTS requirements text,
    ADD COLUMN IF NOT EXISTS content text;
  `).catch(() => undefined);

  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'open_roles_page_roles_responsibilities') THEN
        UPDATE open_roles_page_roles r
        SET responsibilities = sub.items
        FROM (
          SELECT _parent_id, string_agg(text, E'\n' ORDER BY _order) AS items
          FROM open_roles_page_roles_responsibilities
          GROUP BY _parent_id
        ) sub
        WHERE r.id = sub._parent_id AND (r.responsibilities IS NULL OR r.responsibilities = '');
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'open_roles_page_roles_requirements') THEN
        UPDATE open_roles_page_roles r
        SET requirements = sub.items
        FROM (
          SELECT _parent_id, string_agg(text, E'\n' ORDER BY _order) AS items
          FROM open_roles_page_roles_requirements
          GROUP BY _parent_id
        ) sub
        WHERE r.id = sub._parent_id AND (r.requirements IS NULL OR r.requirements = '');
      END IF;
    END $$;
  `).catch(() => undefined);

  // 2. Admin titles for case studies and clients
  await client.query(`
    ALTER TABLE IF EXISTS case_studies ADD COLUMN IF NOT EXISTS admin_title text;
    ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS admin_title text;

    UPDATE case_studies cs
    SET admin_title = COALESCE(c.name, c.slug, '') || ' — ' || COALESCE(cs.title, cs.slug, 'Case study')
    FROM clients c
    WHERE cs.client_id = c.id AND (cs.admin_title IS NULL OR cs.admin_title = '');

    UPDATE case_studies
    SET admin_title = COALESCE(title, slug, 'Case study')
    WHERE admin_title IS NULL OR admin_title = '';

    UPDATE clients c
    SET admin_title = c.name || CASE WHEN c.project_type = 'hub' THEN ' (Client Hub)' ELSE ' (Direct)' END
    WHERE admin_title IS NULL OR admin_title = '';
  `).catch(() => undefined);

  // 3. Drop NOT NULL on name and alt columns where fields are optional / auto-filled from relations
  await client.query(`
    DO $$
    BEGIN
      ALTER TABLE IF EXISTS clients_index_cards ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS work_page_projects ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS studio_page_projects ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS team_page_leadership ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS team_page_members ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS industry_pages_logos ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS service_pages_logos ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS solution_pages_logos ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS work_service_pages_logos ALTER COLUMN name DROP NOT NULL;
      ALTER TABLE IF EXISTS portfolio_items ALTER COLUMN alt DROP NOT NULL;
      ALTER TABLE IF EXISTS featured_projects ALTER COLUMN alt DROP NOT NULL;
      ALTER TABLE IF EXISTS testimonials ALTER COLUMN alt DROP NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END $$;
  `).catch(() => undefined);

  // 4. Blueprint pages (Service, Solution, Work Service, Industry) columns and enums
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "enum_service_pages_logos_row" AS ENUM ('1', '2');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_solution_pages_logos_row" AS ENUM ('1', '2');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_work_service_pages_logos_row" AS ENUM ('1', '2');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_industry_pages_logos_row" AS ENUM ('1', '2');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_service_pages_projects_category" AS ENUM ('solution', 'service', 'industry', 'branding-projects');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_solution_pages_projects_category" AS ENUM ('solution', 'service', 'industry', 'branding-projects');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_work_service_pages_projects_category" AS ENUM ('solution', 'service', 'industry', 'branding-projects');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_industry_pages_projects_category" AS ENUM ('solution', 'service', 'industry', 'branding-projects');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE IF EXISTS "service_pages_logos"
      ADD COLUMN IF NOT EXISTS "client_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "row" varchar;
    ALTER TABLE IF EXISTS "solution_pages_logos"
      ADD COLUMN IF NOT EXISTS "client_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "row" varchar;
    ALTER TABLE IF EXISTS "work_service_pages_logos"
      ADD COLUMN IF NOT EXISTS "client_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "row" varchar;
    ALTER TABLE IF EXISTS "industry_pages_logos"
      ADD COLUMN IF NOT EXISTS "client_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "row" varchar;

    ALTER TABLE IF EXISTS "service_pages_projects"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "category" varchar DEFAULT 'service',
      ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "heading" text,
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "href" text;

    ALTER TABLE IF EXISTS "solution_pages_projects"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "category" varchar DEFAULT 'solution',
      ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "heading" text,
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "href" text;

    ALTER TABLE IF EXISTS "work_service_pages_projects"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "category" varchar DEFAULT 'service',
      ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "heading" text,
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "href" text;

    ALTER TABLE IF EXISTS "industry_pages_projects"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "category" varchar DEFAULT 'industry',
      ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "heading" text,
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "href" text;

    ALTER TABLE IF EXISTS "service_pages_experts"
      ADD COLUMN IF NOT EXISTS "member_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "name" text,
      ADD COLUMN IF NOT EXISTS "role" text;

    ALTER TABLE IF EXISTS "solution_pages_experts"
      ADD COLUMN IF NOT EXISTS "member_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "name" text,
      ADD COLUMN IF NOT EXISTS "role" text;

    ALTER TABLE IF EXISTS "work_service_pages_experts"
      ADD COLUMN IF NOT EXISTS "member_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "name" text,
      ADD COLUMN IF NOT EXISTS "role" text;

    ALTER TABLE IF EXISTS "industry_pages_experts"
      ADD COLUMN IF NOT EXISTS "member_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "name" text,
      ADD COLUMN IF NOT EXISTS "role" text;

    ALTER TABLE IF EXISTS "service_pages_relatedBlogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "service_pages_related_blogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "solution_pages_relatedBlogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "solution_pages_related_blogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "work_service_pages_relatedBlogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "work_service_pages_related_blogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "industry_pages_relatedBlogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "industry_pages_related_blogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "service_pages_clientTabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "service_pages_client_tabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "solution_pages_clientTabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "solution_pages_client_tabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "work_service_pages_clientTabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "work_service_pages_client_tabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "industry_pages_clientTabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "industry_pages_client_tabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    DO $$ BEGIN
      ALTER TABLE IF EXISTS "service_pages_projects" ALTER COLUMN "heading" DROP NOT NULL;
      ALTER TABLE IF EXISTS "service_pages_projects" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "service_pages_projects" ALTER COLUMN "description" DROP NOT NULL;
      ALTER TABLE IF EXISTS "service_pages_faqs" ALTER COLUMN "answer" DROP NOT NULL;

      ALTER TABLE IF EXISTS "solution_pages_projects" ALTER COLUMN "heading" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_projects" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_projects" ALTER COLUMN "description" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_faqs" ALTER COLUMN "answer" DROP NOT NULL;

      ALTER TABLE IF EXISTS "work_service_pages_projects" ALTER COLUMN "heading" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_projects" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_projects" ALTER COLUMN "description" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_faqs" ALTER COLUMN "answer" DROP NOT NULL;

      ALTER TABLE IF EXISTS "industry_pages_projects" ALTER COLUMN "heading" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_projects" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_projects" ALTER COLUMN "description" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_faqs" ALTER COLUMN "answer" DROP NOT NULL;

      ALTER TABLE IF EXISTS "service_pages_experts" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "service_pages_experts" ALTER COLUMN "role" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_experts" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_experts" ALTER COLUMN "role" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_experts" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_experts" ALTER COLUMN "role" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_experts" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_experts" ALTER COLUMN "role" DROP NOT NULL;

      ALTER TABLE IF EXISTS "service_pages_relatedBlogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "service_pages_related_blogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_relatedBlogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "solution_pages_related_blogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_relatedBlogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "work_service_pages_related_blogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_relatedBlogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "industry_pages_related_blogs" ALTER COLUMN "title" DROP NOT NULL;
    EXCEPTION WHEN OTHERS THEN NULL;
    END $$;
  `).catch(() => undefined);

  // 5. Location pages columns, enums, and constraint relaxation
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "enum_location_pages_logos_row" AS ENUM ('1', '2');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_location_pages_projects_category" AS ENUM ('solution', 'service', 'industry', 'location', 'branding-projects');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE IF EXISTS "location_pages_logos"
      ADD COLUMN IF NOT EXISTS "client_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "row" varchar;

    ALTER TABLE IF EXISTS "location_pages_projects"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "category" varchar DEFAULT 'location',
      ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "heading" text,
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "href" text;

    ALTER TABLE IF EXISTS "location_pages_relatedBlogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "location_pages_related_blogs"
      ADD COLUMN IF NOT EXISTS "post_id" integer,
      ADD COLUMN IF NOT EXISTS "image_id" integer,
      ADD COLUMN IF NOT EXISTS "date" text,
      ADD COLUMN IF NOT EXISTS "read_time" text,
      ADD COLUMN IF NOT EXISTS "readTime" text,
      ADD COLUMN IF NOT EXISTS "title" text;

    ALTER TABLE IF EXISTS "location_pages_clientTabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    ALTER TABLE IF EXISTS "location_pages_client_tabs"
      ADD COLUMN IF NOT EXISTS "tab_id" text,
      ADD COLUMN IF NOT EXISTS "tabId" text,
      ADD COLUMN IF NOT EXISTS "label" text;

    DO $$ BEGIN
      ALTER TABLE IF EXISTS "location_pages_logos" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "location_pages_projects" ALTER COLUMN "name" DROP NOT NULL;
      ALTER TABLE IF EXISTS "location_pages_projects" ALTER COLUMN "description" DROP NOT NULL;
      ALTER TABLE IF EXISTS "location_pages_projects" ALTER COLUMN "heading" DROP NOT NULL;
      ALTER TABLE IF EXISTS "location_pages_relatedBlogs" ALTER COLUMN "title" DROP NOT NULL;
      ALTER TABLE IF EXISTS "location_pages_related_blogs" ALTER COLUMN "title" DROP NOT NULL;
    EXCEPTION WHEN OTHERS THEN NULL;
    END $$;
  `).catch(() => undefined);

  // 6. Blog posts enhancements and Blog Index routing columns
  await client.query(`
    ALTER TABLE IF EXISTS "blog_posts"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "topic_icon_id" integer;

    ALTER TABLE IF EXISTS "blog_posts_topics"
      ADD COLUMN IF NOT EXISTS "client_id" integer,
      ADD COLUMN IF NOT EXISTS "icon_id" integer,
      ADD COLUMN IF NOT EXISTS "topic_icon_id" integer;

    ALTER TABLE IF EXISTS "blog_index_featured_posts"
      ADD COLUMN IF NOT EXISTS "href" varchar;

    ALTER TABLE IF EXISTS "blog_index_posts"
      ADD COLUMN IF NOT EXISTS "href" varchar;

    DO $$ BEGIN
      ALTER TABLE IF EXISTS "blog_posts"
        ADD CONSTRAINT "blog_posts_client_id_fkey"
        FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE IF EXISTS "blog_posts"
        ADD CONSTRAINT "blog_posts_topic_icon_id_fkey"
        FOREIGN KEY ("topic_icon_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
    END $$;
  `).catch(() => undefined);
}

