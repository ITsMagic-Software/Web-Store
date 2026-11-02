"use client";

import { m } from "motion/react";
import { buttonMotion, spring } from "@/lib/motion";
import type { Asset } from "@/domain/models";
import { AssetThumbnail } from "@/components/AssetThumbnail";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { formatManifestDate, isValidManifestDate } from "@/lib/date";

export interface AssetDetailProps {
  asset: Asset;
  locale: Locale;
}

export function AssetDetailContent({ asset, locale }: AssetDetailProps) {
  const messages = getDictionary(locale);
  const packageIsRepository = asset.packageUrl?.startsWith("https://github.com/") ?? false;
  const category = asset.category === "template" ? messages.assetTypeTemplate : asset.category === "package" ? messages.assetTypePackage : asset.category;
  const details = [
    { label: messages.creatorLabel, value: asset.creator },
    { label: messages.assetCategoryLabel, value: category },
    { label: messages.assetVersionLabel, value: asset.version },
    { label: messages.publishedAtLabel, value: isValidManifestDate(asset.publishedAt) ? formatManifestDate(asset.publishedAt, locale) : undefined },
    { label: messages.updatedAtLabel, value: asset.updatedAt && isValidManifestDate(asset.updatedAt) ? formatManifestDate(asset.updatedAt, locale) : undefined },
  ].filter((detail) => detail.value);

  return (
    <div className="asset-detail-content">
      <div className="asset-detail-body grid gap-7 p-5 sm:gap-8 sm:p-7 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <AssetThumbnail src={asset.thumbnailUrl ?? null} seed={asset.id} />
          <section aria-labelledby="asset-description-title" className="mt-7">
            <h3 id="asset-description-title" className="text-base font-semibold tracking-tight text-foreground">{messages.assetDescriptionLabel}</h3>
            <p className="mt-3 whitespace-pre-line wrap-anywhere text-sm leading-7 text-muted-foreground">{asset.description?.trim() || messages.assetDescriptionUnavailable}</p>
          </section>
          {asset.tags && asset.tags.length > 0 && (
            <ul aria-label={messages.assetTagsLabel} className="mt-5 flex flex-wrap gap-2">
              {[...new Set(asset.tags)].map((tag) => <li key={tag} className="max-w-full wrap-anywhere rounded-md bg-muted px-2.5 py-1 text-xs leading-5 text-muted-foreground">{tag}</li>)}
            </ul>
          )}
        </div>

        {details.length > 0 && (
          <aside aria-labelledby="asset-information-title" className="h-fit min-w-0 rounded-xl border border-divider bg-surface p-5 lg:sticky lg:top-0">
            <h3 id="asset-information-title" className="mb-5 text-sm font-semibold text-foreground">{messages.assetInformationTab}</h3>
            <dl className="space-y-5">
              {details.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 wrap-anywhere text-sm font-medium leading-6 text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>

      <footer className="asset-detail-actions flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-divider bg-surface px-5 py-4 sm:px-7">
        <p className="hidden text-xs text-muted-foreground sm:block">{asset.packageUrl ? messages.assetExternalLinkHint : messages.assetDownloadUnavailable}</p>
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
          {asset.licenseUrl && (
            <m.a whileHover={buttonMotion.hover} whileTap={buttonMotion.tap} transition={spring.hover} href={asset.licenseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-divider px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">{messages.licenseLabel}</m.a>
          )}
          {asset.packageUrl ? (
            <m.a initial="rest" whileHover="hover" whileTap={buttonMotion.tap} variants={{ rest: { scale: 1 }, hover: buttonMotion.hover }} transition={spring.hover} href={asset.packageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-3 rounded-xl bg-accent px-5 py-2.5 text-center text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:flex-none">
              {packageIsRepository ? messages.viewGithub : messages.downloadPackage}
              <m.svg variants={{ rest: { x: 0, y: 0 }, hover: { x: 1, y: -1 } }} transition={spring.hover} aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0"><path d="M6 14 14 6M6.5 6H14v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></m.svg>
            </m.a>
          ) : <p className="text-sm text-muted-foreground sm:hidden">{messages.assetDownloadUnavailable}</p>}
        </div>
      </footer>
    </div>
  );
}
