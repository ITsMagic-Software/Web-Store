import { describe, expect, it } from "vitest";
import { decodeMaybe, mapManifestAssets } from "@/services/assetMapper";
import { parseManifestDate } from "@/lib/date";

describe("manifest decoding", () => {
  const wrap = (value: string) => `base64@${Buffer.from(value).toString("base64")}`;
  it("decodes UTF-8 through at most three layers without throwing on malformed input", () => {
    const text = "Animação 🎮";
    expect(decodeMaybe(wrap(wrap(wrap(text))))).toBe(text);
    expect(decodeMaybe(wrap(wrap(wrap(wrap(text)))))).toBe(wrap(text));
    expect(decodeMaybe("base64@%%%")).toBe("base64@%%%");
    expect(decodeMaybe(null)).toBe(null);
  });
  it("skips incompatible/invalid packages and rejects unsafe external links", () => {
    const item = { id: "example", titleB64: Buffer.from("Example").toString("base64"), appMajorVersion: 2, date: "31/02/2026", repositoryURL: "javascript:alert(1)" };
    const result = mapManifestAssets({ packages: [item, { ...item, appMajorVersion: 1 }, null] });
    expect(result.assets).toHaveLength(1);
    expect(result.assets[0]?.packageUrl).toBeUndefined();
    expect(result.assets[0]?.downloadUrl).toBeUndefined();
    expect(result.invalidDates).toBe(1);
    expect(result.skippedInvalid).toBe(1);
  });
  it("provides a default-branch ZIP for GitHub repositories and preserves direct ZIP URLs", () => {
    const item = { id: "example", title: "Example", appMajorVersion: 2, date: "2026-01-01" };
    const result = mapManifestAssets({ packages: [
      { ...item, id: "repository", repositoryURL: "https://github.com/owner/package.git/" },
      { ...item, id: "zip", repositoryURL: "https://downloads.example.com/package.ZIP?version=2" },
      { ...item, id: "other", repositoryURL: "https://example.com/package" },
      { ...item, id: "spoof", repositoryURL: "https://github.com.evil.test/owner/package" },
    ] });
    expect(result.assets.map((asset) => asset.downloadUrl)).toEqual([
      "https://github.com/owner/package/archive/HEAD.zip",
      "https://downloads.example.com/package.ZIP?version=2",
      undefined,
      undefined,
    ]);
  });
});
describe("manifest dates", () => {
  it("validates calendar dates strictly in UTC", () => {
    expect(parseManifestDate("29/02/2024")?.toISOString()).toBe("2024-02-29T00:00:00.000Z");
    expect(parseManifestDate("2026-01-01")?.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(parseManifestDate("29/02/2025")).toBeNull();
    expect(parseManifestDate("01/01/2026junk")).toBeNull();
  });
});
