import { z } from "zod";
import { logger } from "@/lib/logger";
import { fetchLatestGitHubCommit } from "@/services/shared/httpClient";

const GitHubCommitDate = z.object({ date: z.string().optional().nullable() }).nullable().optional();
const GitHubCommitList = z.array(z.object({
  commit: z.object({
    author: GitHubCommitDate,
    committer: GitHubCommitDate,
  }),
}));

export interface GitHubRepositoryCoordinates {
  owner: string;
  repository: string;
}

export function getGitHubRepositoryCoordinates(value: string): GitHubRepositoryCoordinates | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password) return null;
    const [owner, repository, ...extraSegments] = url.pathname.split("/").filter(Boolean);
    const normalizedRepository = repository?.replace(/\.git$/i, "");
    const validSegment = /^[A-Za-z0-9_.-]+$/;

    if (
      !owner || !normalizedRepository || extraSegments.length > 0 || url.search || url.hash ||
      !validSegment.test(owner) || !validSegment.test(normalizedRepository)
    ) return null;

    return { owner, repository: normalizedRepository };
  } catch {
    return null;
  }
}

export function parseLatestCommitDate(payload: unknown): string | null {
  const parsed = GitHubCommitList.safeParse(payload);
  if (!parsed.success) return null;

  const latestCommit = parsed.data[0];
  if (!latestCommit) return null;

  const candidates = [latestCommit.commit.committer?.date, latestCommit.commit.author?.date];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const timestamp = Date.parse(candidate);
    if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
  }
  return null;
}

export async function getRepositoryUpdatedAt(
  repository: GitHubRepositoryCoordinates,
  correlationId: string,
): Promise<string | undefined> {
  try {
    const payload = await fetchLatestGitHubCommit(repository.owner, repository.repository, correlationId);
    const updatedAt = parseLatestCommitDate(payload);
    if (updatedAt) return updatedAt;

    logger.warn("GitHub returned no valid date for the repository's latest commit", {
      service: "storeService",
      operation: "getAssetUpdatedAt",
      code: "GITHUB_COMMIT_DATE_INVALID",
      correlationId,
    });
  } catch (error) {
    logger.warn("Could not load the repository's latest commit date", {
      service: "storeService",
      operation: "getAssetUpdatedAt",
      code: "GITHUB_COMMIT_UNAVAILABLE",
      correlationId,
      err: {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : "Unknown failure",
      },
    });
  }

  return undefined;
}
