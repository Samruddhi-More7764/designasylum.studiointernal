import { createHash } from "node:crypto";
import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import type { Payload } from "payload";

const FINGERPRINT_KEY = "cms-schema-fingerprint";
const SAFE_IDENT = /^[a-z_][a-z0-9_]*$/;
const SAFE_SQL_TYPE =
  /^(boolean|integer|jsonb|numeric(\(\d+,\s*\d+\))?|serial|text|varchar(\(\d+\))?|timestamp\(3\) with time zone|double precision|bigint|real|date)$/;

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
  if (process.env.NEXT_PHASE === "phase-production-build") return;

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
  const lines: string[] = [];
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
      `CREATE TYPE ${quoteIdent(name)} AS ENUM (${values.map(quoteLiteral).join(", ")})`,
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
