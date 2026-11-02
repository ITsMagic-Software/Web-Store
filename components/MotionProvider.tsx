"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";
import { transition } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={transition.reveal}>
      <LazyMotion features={domMax} strict>{children}</LazyMotion>
    </MotionConfig>
  );
}
