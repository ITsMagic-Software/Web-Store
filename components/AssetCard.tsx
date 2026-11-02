"use client";

import { m } from "motion/react";
import { useState } from "react";
import type { Asset } from "@/services";
import { useApp } from "@/components/Providers";
import { SafeImage } from "@/components/ui/SafeImage";
import { PackageLink } from "@/components/PackageLink";
import { arrowVariants, cardVariants, thumbnailVariants } from "@/lib/motion";
import { getThumbnailClass } from "@/lib/images";

export interface AssetCardProps {
  asset: Asset;
  searchString: string;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4"><path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function AssetCard({ asset, searchString }: AssetCardProps) {
  const { t, locale } = useApp();
  const [focused, setFocused] = useState(false);
  const thumbnailToken = getThumbnailClass(asset.id);
  const packageParams = new URLSearchParams(searchString);
  packageParams.set("pkg", asset.id);
  const packageHref = `/${locale === "pt-BR" ? "pt-br" : "en"}?${packageParams.toString()}`;

  return (
    <m.article
      variants={cardVariants}
      initial={false}
      animate={focused ? "hover" : "rest"}
      whileHover="hover"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      className="asset-card group relative flex min-h-full flex-col overflow-hidden rounded-2xl border border-divider/70 bg-surface/85 shadow-sm backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-card-hover-border"
    >
      <div className={`relative aspect-16/10 overflow-hidden ring-1 ring-inset ring-border/40 ${thumbnailToken}`}>
        <m.div variants={thumbnailVariants} className="absolute inset-0">
          <SafeImage src={asset.thumbnailUrl ?? null} alt="" seed={asset.id} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="asset-thumbnail object-cover" />
        </m.div>
        {asset.category && <span className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-xs text-foreground backdrop-blur-sm">{asset.category}</span>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-base font-medium tracking-tight text-foreground">{asset.title}</h3>
        {asset.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{asset.description}</p>}
        {(asset.creator || asset.version) && (
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-divider pt-3 text-xs text-muted-foreground">
            {asset.creator && <span className="truncate">{asset.creator}</span>}
            {asset.version && <span className="shrink-0 tabular-nums">{asset.version}</span>}
          </div>
        )}
      </div>

      <PackageLink href={packageHref} label={`${t("viewPackage")}: ${asset.title}`} className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none">
          <span className="sr-only">{t("viewPackage")}</span>
          <m.span aria-hidden="true" variants={arrowVariants} className="asset-card-arrow absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-divider bg-background/85 text-foreground backdrop-blur-sm"><ArrowIcon /></m.span>
      </PackageLink>
    </m.article>
  );
}
