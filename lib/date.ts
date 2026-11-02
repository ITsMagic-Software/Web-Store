const EPOCH_ISO = "1970-01-01T00:00:00.000Z";

export function parseManifestDate(raw: string): Date | null {
  const dayFirst = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  const yearFirst = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const match = dayFirst ?? yearFirst;
  if (!match) return null;

  const year = Number(dayFirst ? match[3] : match[1]);
  const month = Number(dayFirst ? match[2] : match[2]);
  const day = Number(dayFirst ? match[1] : match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function formatManifestDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
}

export function isValidManifestDate(value: string) {
  return value !== EPOCH_ISO && Number.isFinite(Date.parse(value));
}
