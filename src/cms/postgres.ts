const ALIAS_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

/**
 * Neon (and many dashboards) still copy `sslmode=require`. Current `pg`
 * treats that as `verify-full` and warns on every connect. Rewrite aliases
 * so the warning is gone and the stronger behavior stays explicit.
 */
export function postgresConnectionString(): string {
  const raw = process.env.POSTGRES_URL || process.env.DATABASE_URI || "";
  if (!raw) return "";

  try {
    const url = new URL(raw);
    const mode = url.searchParams.get("sslmode");
    if (!mode || ALIAS_SSL_MODES.has(mode)) {
      url.searchParams.set("sslmode", "verify-full");
    }
    return url.toString();
  } catch {
    return raw.replace(
      /([?&]sslmode=)(prefer|require|verify-ca)\b/i,
      "$1verify-full",
    );
  }
}
