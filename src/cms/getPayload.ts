import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Payload } from "payload";

function hasDatabaseUrl() {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URI);
}

/**
 * Local Payload API client. Returns null when no DB is configured or
 * Postgres is unreachable so the marketing site can fall back to `src/data`.
 */
export const getPayloadClient = cache(async (): Promise<Payload | null> => {
  if (!hasDatabaseUrl()) return null;

  try {
    return await getPayload({ config });
  } catch (error) {
    console.warn("[cms] Payload is unavailable; using static data.", error);
    return null;
  }
});
