import { createHash } from "node:crypto";
import type { Payload } from "payload";

import { pageEntries } from "./pageEntries";

const FINGERPRINT_KEY = "cms-page-entries";

type QueryClient = {
  query: <T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ) => Promise<{ rows: T[]; rowCount: number | null }>;
  release: () => void;
};

/**
 * Writes the public page copy into a CMS global only when that global has
 * no saved fields yet. A document the client has saved is never updated:
 * a global write replaces the stored row, so a partial fill could rewrite
 * lists and uploads that were left out of the patch.
 */
export async function prefillPageEntries(payload: Payload): Promise<void> {
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  try {
    await fillEmptyEntries(payload);
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: "Could not fill empty CMS page entries. Existing content was not changed.",
    });
  }
}

async function fillEmptyEntries(payload: Payload): Promise<void> {
  const entries = pageEntries();
  const fingerprint = createHash("sha256")
    .update(entries.map((entry) => entry.slug).join("|"))
    .digest("hex");
  const db = payload.db as Payload["db"] & {
    pool?: { connect: () => Promise<unknown> };
  };
  if (!db.pool) return;

  const client = (await db.pool.connect()) as QueryClient;
  try {
    if ((await readFingerprint(client)) === fingerprint) return;
  } finally {
    client.release();
  }

  const filled: string[] = [];
  for (const entry of entries) {
    const current = (await payload.findGlobal({
      slug: entry.slug as "site-footer",
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>;
    if (hasSavedContent(current, entry.data)) continue;
    await payload.updateGlobal({
      slug: entry.slug as "site-footer",
      data: entry.data,
    } as Parameters<typeof payload.updateGlobal>[0]);
    filled.push(entry.slug);
  }

  const writer = (await db.pool.connect()) as QueryClient;
  try {
    await writeFingerprint(writer, fingerprint);
  } finally {
    writer.release();
  }

  if (filled.length) {
    payload.logger.info({
      msg: `Filled empty CMS page entries: ${filled.join(", ")}. Saved fields were kept.`,
    });
  }
}

function hasSavedContent(
  current: Record<string, unknown>,
  designed: Record<string, unknown>,
): boolean {
  return Object.entries(designed).some(([key, value]) => {
    if (value === undefined) return false;
    return !isEmpty(current[key]);
  });
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
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
