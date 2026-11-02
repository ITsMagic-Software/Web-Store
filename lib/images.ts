export const IMAGE_HOSTS = ["raw.githubusercontent.com"] as const;

const thumbnailClasses = [
  "bg-[image:var(--thumb-1)]",
  "bg-[image:var(--thumb-2)]",
  "bg-[image:var(--thumb-3)]",
  "bg-[image:var(--thumb-4)]",
  "bg-[image:var(--thumb-5)]",
  "bg-[image:var(--thumb-6)]",
] as const;

export function isAllowedImageUrl(value: string | null | undefined): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.port === ""
      && !url.username
      && !url.password
      && IMAGE_HOSTS.some((hostname) => hostname === url.hostname);
  } catch {
    return false;
  }
}

export function getThumbnailClass(seed: string): string {
  const hash = Array.from(seed).reduce((value, character) => value + character.charCodeAt(0), 0);
  return thumbnailClasses[hash % thumbnailClasses.length] ?? thumbnailClasses[0];
}
