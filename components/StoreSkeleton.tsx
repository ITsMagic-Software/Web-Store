"use client";

import { useApp } from "@/components/Providers";
import { SkeletonPulse } from "@/components/MotionEffects";

export function StoreSkeleton() {
  const { t } = useApp();
  return (
    <SkeletonPulse>
      <main aria-label={t("catalogLoading")} aria-busy="true" className="min-h-screen bg-background">
        <div className="h-14 border-b border-divider" />
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
            <div className="skeleton h-3 w-40 rounded-full" />
            <div className="skeleton h-11 w-full max-w-xl rounded-lg sm:h-14" />
            <div className="skeleton h-4 w-2/3 max-w-lg rounded-full" />
          </div>
        </div>
        <div className="border-y border-divider py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="skeleton h-11 min-w-0 flex-1 rounded-xl" />
              <div className="skeleton h-11 w-24 shrink-0 rounded-xl" />
            </div>
            <div className="hidden gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)_minmax(0,1fr)] lg:items-center lg:gap-5">
              <div className="skeleton h-11 w-full rounded-full" />
              <div className="skeleton h-11 w-full rounded-xl" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2"><div className="skeleton h-11 w-40 rounded-xl" /><div className="skeleton h-11 w-28 rounded-xl" /></div>
                <div className="skeleton h-4 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <article key={index} className="overflow-hidden rounded-lg border border-divider bg-surface">
              <div className="skeleton aspect-[16/10]" />
              <div className="space-y-3 p-4"><div className="skeleton h-5 w-3/5 rounded" /><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-4 w-4/5 rounded" /></div>
            </article>
          ))}
        </div>
      </main>
    </SkeletonPulse>
  );
}

export function CatalogSkeleton() {
  const { t } = useApp();
  return (
    <SkeletonPulse>
      <div role="region" aria-label={t("catalogLoading")} aria-busy="true">
        <section className="border-y border-divider bg-background/70 py-3 sm:sticky sm:top-16 sm:z-30">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)_minmax(0,1fr)] lg:items-center lg:gap-5 lg:px-8">
            <div className="hidden min-w-0 items-center gap-2 overflow-hidden lg:flex">
              <div className="skeleton h-10 w-20 shrink-0 rounded-full" />
              <div className="skeleton h-10 w-24 shrink-0 rounded-full" />
              <div className="skeleton h-10 w-20 shrink-0 rounded-full" />
            </div>
            <div className="flex min-w-0 items-center gap-2 lg:justify-self-center">
              <div className="skeleton h-11 min-w-0 flex-1 rounded-xl" />
              <div className="skeleton h-11 w-24 shrink-0 rounded-xl lg:hidden" />
            </div>
            <div className="hidden items-center justify-between gap-3 lg:flex">
              <div className="flex items-center gap-2">
                <div className="skeleton h-11 w-40 rounded-xl" />
                <div className="skeleton h-11 w-32 rounded-xl" />
              </div>
              <div className="skeleton h-4 w-20 rounded-full" />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <article key={index} className="overflow-hidden rounded-lg border border-divider bg-surface">
                <div className="skeleton aspect-[16/10]" />
                <div className="space-y-3 p-4">
                  <div className="skeleton h-5 w-3/5 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-4/5 rounded" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SkeletonPulse>
  );
}
