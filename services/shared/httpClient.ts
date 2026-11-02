import { logger } from "@/lib/logger";

class HttpStatusError extends Error {
  constructor(readonly status: number, readonly retryAfterMs?: number) {
    super(`Asset source returned ${status}`);
    this.name = "HttpStatusError";
  }
}

function retryDelay(error: unknown, attempt: number): number {
  if (error instanceof HttpStatusError && error.retryAfterMs !== undefined) return error.retryAfterMs;
  return Math.random() * Math.min(5000, 300 * 2 ** attempt);
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}

function canRetry(error: unknown): boolean {
  if (error instanceof HttpStatusError) {
    return error.status === 408 || error.status === 429 || [500, 502, 503, 504].includes(error.status);
  }
  return error instanceof TypeError || (error instanceof DOMException && error.name === "TimeoutError");
}

async function withRetry<T>(
  operation: () => Promise<T>,
  correlationId: string,
  retries = 3,
  operationName = "getAssets",
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!canRetry(error) || attempt >= retries) throw error;
      logger.warn("Asset source request failed; retrying", {
        service: "storeService",
        operation: operationName,
        code: "CATALOG_RETRY",
        attempt: attempt + 1,
        correlationId,
      });
      await new Promise((resolve) => setTimeout(resolve, retryDelay(error, attempt)));
    }
  }
}

export async function fetchManifest(url: string, correlationId: string): Promise<unknown> {
  const response = await withRetry(async () => {
    const result = await fetch(url, { signal: AbortSignal.timeout(10_000), next: { revalidate: 300 } });
    if (!result.ok) throw new HttpStatusError(result.status, parseRetryAfter(result.headers.get("retry-after")));
    return result;
  }, correlationId);

  const bytes = await response.arrayBuffer();
  const content = url.endsWith(".gz")
    ? await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text()
    : new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  return JSON.parse(content) as unknown;
}

export async function fetchLatestGitHubCommit(owner: string, repository: string, correlationId: string): Promise<unknown> {
  const url = new URL(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/commits`);
  url.searchParams.set("per_page", "1");

  const response = await withRetry(async () => {
    const result = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "ITsMagic-Asset-Store",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      signal: AbortSignal.timeout(5_000),
      next: { revalidate: 3600 },
    });
    if (!result.ok) throw new HttpStatusError(result.status, parseRetryAfter(result.headers.get("retry-after")));
    return result;
  }, correlationId, 1, "getAssetUpdatedAt");

  return await response.json() as unknown;
}

export function getHttpStatus(error: unknown): number | undefined {
  return error instanceof HttpStatusError ? error.status : undefined;
}
