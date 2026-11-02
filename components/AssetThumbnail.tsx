import { SafeImage } from "@/components/ui/SafeImage";

interface AssetThumbnailProps {
  src?: string | null;
  seed: string;
}

export function AssetThumbnail({ src, seed }: AssetThumbnailProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-divider bg-muted ring-1 ring-inset ring-border">
      <SafeImage src={src ?? null} alt="" seed={seed} sizes="(min-width: 1024px) 672px, (min-width: 640px) 85vw, 100vw" className="object-contain" />
    </div>
  );
}
