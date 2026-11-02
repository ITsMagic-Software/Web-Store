export const CATALOG_PAGE_SIZES = [12, 24, 48] as const;
export const DEFAULT_CATALOG_PAGE_SIZE = 24;

type CatalogParameter = "q" | "category" | "sort" | "page" | "perPage";
type CatalogChanges = Partial<Record<CatalogParameter, string>>;

export function normalizeCatalogPageSize(value: string): number {
  return CATALOG_PAGE_SIZES.find((pageSize) => String(pageSize) === value) ?? DEFAULT_CATALOG_PAGE_SIZE;
}

export function buildCatalogUrl(pathname: string, searchString: string, changes: CatalogChanges = {}): string {
  const params = new URLSearchParams(searchString);
  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}
