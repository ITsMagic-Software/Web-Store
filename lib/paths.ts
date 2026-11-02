export const BASE_PATH = "/store";
export function withoutBasePath(path: string): string {
  return path === BASE_PATH || path.startsWith(`${BASE_PATH}/`) ? path.slice(BASE_PATH.length) || "/" : path;
}
export function withBasePath(path: string): string {
  const local = withoutBasePath(path);
  const [pathname, ...query] = local.split("?");
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${BASE_PATH}${normalized}${query.length ? `?${query.join("?")}` : ""}`;
}
