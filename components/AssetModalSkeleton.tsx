import { SkeletonPulse } from "@/components/MotionEffects";

interface AssetModalSkeletonProps {
  title: string;
}

export function AssetModalSkeleton({ title }: AssetModalSkeletonProps) {
  return (
    <SkeletonPulse>
      <div aria-busy="true" className="mx-auto max-w-7xl">
        <h1 id="asset-detail-title" className="sr-only">{title}</h1>
        <div aria-hidden="true">
          <div className="flex gap-6 border-b border-divider px-5 py-4 sm:px-8"><div className="skeleton h-5 w-20 rounded" /><div className="skeleton h-5 w-28 rounded" /></div>
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="order-2 lg:order-1"><div className="skeleton aspect-video rounded-xl" /><div className="skeleton mt-6 h-5 w-40 rounded-lg" /><div className="skeleton mt-3 h-20 rounded-lg" /></div>
            <div className="order-1 space-y-5 rounded-xl border border-divider bg-surface p-5 lg:order-2"><div className="skeleton h-4 w-1/3 rounded" /><div className="skeleton h-8 w-3/4 rounded" /><div className="skeleton h-11 rounded-xl" /><div className="skeleton h-px w-full rounded" /><div className="skeleton h-5 w-1/2 rounded" /><div className="skeleton h-16 rounded-lg" /></div>
          </div>
        </div>
      </div>
    </SkeletonPulse>
  );
}
