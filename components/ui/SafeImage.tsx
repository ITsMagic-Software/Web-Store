"use client";

import Image from "next/image";
import { useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { transition } from "@/lib/motion";
import { getThumbnailClass, isAllowedImageUrl } from "@/lib/images";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  seed: string;
}

export function SafeImage({ src, alt, sizes, priority = false, className = "", seed }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  const allowed = isAllowedImageUrl(src);

  if (!allowed || failedSrc === src) {
    return (
      <div aria-hidden="true" className={`absolute inset-0 grid place-items-center ${getThumbnailClass(seed)}`}>
        <svg viewBox="0 0 48 48" fill="none" className="size-12 text-foreground/25">
          <rect x="7" y="9" width="34" height="30" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="19" r="3" fill="currentColor" />
          <path d="m10 34 10-10 7 7 5-5 6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div ref={scope} className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailedSrc(src)}
        onLoad={() => { if (!reduced && scope.current) void animate(scope.current, { opacity: [0.7, 1] }, transition.reveal); }}
        className={className}
      />
    </div>
  );
}
