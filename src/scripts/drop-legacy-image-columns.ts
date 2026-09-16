import "dotenv/config";
import { Client } from "pg";
import { postgresConnectionString } from "../cms/postgres";

/**
 * Image fields used to be text paths (`image` / `src`). They are now upload
 * FKs (`image_id`). Drizzle push treats that as a possible rename and asks an
 * interactive question that hangs `next dev`. Drop the old text columns first
 * so push can create the new FK columns without prompting.
 */
export async function dropLegacyImageColumns() {
  const connectionString = postgresConnectionString();
  if (!connectionString) {
    throw new Error("Set POSTGRES_URL or DATABASE_URI first.");
  }

  const client = new Client({
    connectionString,
  });

  await client.connect();

  try {
    const { rows } = await client.query<{
      table_name: string;
      column_name: string;
    }>(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND data_type IN ('text', 'character varying')
        AND (
          column_name = 'image'
          OR column_name = 'src'
          OR column_name LIKE '%\\_src' ESCAPE '\\'
        )
    `);

    if (!rows.length) {
      console.info("No legacy text image/src columns to drop.");
      return;
    }

    for (const row of rows) {
      const sql = `ALTER TABLE "${row.table_name}" DROP COLUMN IF EXISTS "${row.column_name}"`;
      console.info(sql);
      await client.query(sql);
    }
  } finally {
    await client.end();
  }
}

const isDirectRun = process.argv[1]?.includes("drop-legacy-image-columns");
if (isDirectRun) {
  dropLegacyImageColumns()
    .then(() => {
      console.info("Legacy image columns dropped. Restart npm run dev, then npm run seed.");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
