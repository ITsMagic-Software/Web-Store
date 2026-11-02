const DEFAULT_MANIFEST_BASE = "https://raw.githubusercontent.com/ITsMagic-Software/Packages-Manifest/main";

export interface DatabaseSources {
  primary: string;
  fallback?: string;
}

export function getDatabaseSources(): DatabaseSources | null {
  const override = process.env.ASSET_DATABASE_URL;
  const configuredBase = process.env.STORE_MANIFEST_BASE_URL;
  const base = configuredBase || DEFAULT_MANIFEST_BASE;
  const format = process.env.STORE_DATABASE_FORMAT || "gz";

  try {
    if (override) {
      const url = new URL(override);
      return url.protocol === "https:" && !url.username && !url.password ? { primary: url.toString() } : null;
    }
    const root = new URL(base.endsWith("/") ? base : `${base}/`);
    if (root.protocol !== "https:" || root.username || root.password) return null;
    if (format === "json") return { primary: new URL("release/autogen_database.json", root).toString() };
    if (format !== "gz") return null;
    return {
      primary: new URL("release/autogen_database.json.gz", root).toString(),
      fallback: new URL("release/autogen_database.json", root).toString(),
    };
  } catch {
    return null;
  }
}
