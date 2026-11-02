"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { Asset } from "@/domain/models";
import { SafeImage } from "@/components/ui/SafeImage";
import { translate, type Locale } from "@/lib/i18n";
import { buttonMotion, fadeVariants, spring } from "@/lib/motion";

export function AssetGallery({ asset, locale }: { asset: Asset; locale: Locale }) {
  const images = asset.imageUrls?.length ? asset.imageUrls : asset.thumbnailUrl ? [asset.thumbnailUrl] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const index = activeIndex % Math.max(images.length, 1);
  const hasMultiple = images.length > 1;
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values);
  const imageLabel = t("assetImageLabel", { title: asset.title, current: index + 1, total: images.length });
  const navigate = (step: number) => setActiveIndex((current) => (current + step + images.length) % images.length);

  useEffect(() => {
    const strip = thumbnails.current;
    const selected = strip?.children[index] as HTMLButtonElement | undefined;
    if (strip && selected) {
      strip.scrollTo({
        left: selected.offsetLeft - (strip.clientWidth - selected.offsetWidth) / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }, [index, reducedMotion]);

  return (
    <section
      aria-label={t("assetGalleryLabel")}
      tabIndex={hasMultiple ? 0 : undefined}
      className="asset-gallery min-w-0 rounded-xl"
      onKeyDown={(event) => {
        if (!hasMultiple || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          navigate(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div
        className="asset-gallery-preview relative aspect-video touch-pan-y overflow-hidden rounded-xl border border-divider bg-muted ring-1 ring-inset ring-border"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = event.touches.length === 1 && touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          const end = event.changedTouches[0];
          touchStart.current = null;
          if (!hasMultiple || !start || !end) return;
          const deltaX = end.clientX - start.x;
          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(end.clientY - start.y)) navigate(deltaX < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence initial={false}>
          <m.div key={images[index] ?? "fallback"} variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0">
            <SafeImage src={images[index] ?? null} alt={images.length ? imageLabel : ""} seed={asset.id} sizes="(min-width: 1024px) 672px, (min-width: 640px) 85vw, 100vw" className="object-contain" />
          </m.div>
        </AnimatePresence>
      </div>

      {hasMultiple && (
        <>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p aria-live="polite" aria-atomic="true" className="text-xs tabular-nums text-muted-foreground">
              <span className="sr-only">{t("assetGalleryLabel")}: </span>{index + 1} / {images.length}
            </p>
            <div className="flex gap-1.5">
              {([-1, 1] as const).map((step) => (
                <m.button key={step} type="button" onClick={() => navigate(step)} aria-label={t(step === -1 ? "previousImage" : "nextImage")} whileHover={buttonMotion.hover} whileTap={buttonMotion.tap} transition={spring.hover} className="grid size-11 place-items-center rounded-full border border-divider bg-surface text-foreground transition-colors hover:bg-muted">
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4"><path d={step === -1 ? "m12 5-5 5 5 5" : "m8 5 5 5-5 5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </m.button>
              ))}
            </div>
          </div>
          <div ref={thumbnails} className="relative mt-2 flex gap-2 overflow-x-auto p-1" aria-label={t("assetThumbnailsLabel")} role="group">
            {images.map((src, imageIndex) => (
              <m.button key={src} type="button" onClick={() => setActiveIndex(imageIndex)} aria-label={t("showAssetImage", { current: imageIndex + 1, total: images.length })} aria-current={index === imageIndex ? "true" : undefined} whileTap={buttonMotion.tap} transition={spring.hover} className={`relative aspect-video min-h-11 w-20 shrink-0 overflow-hidden rounded-lg border sm:w-24 ${index === imageIndex ? "border-accent ring-2 ring-accent/30" : "border-divider opacity-60 hover:opacity-100"}`}>
                <SafeImage src={src} alt="" seed={asset.id} sizes="96px" className="object-cover" />
              </m.button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
