"use client";

import { useEffect, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { transition } from "@/lib/motion";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const controls = animate(scope.current, { opacity: [0.94, 1], y: [4, 0] }, transition.reveal);
    return () => controls.complete();
  }, [animate, reduced, scope]);
  return <div ref={scope} className={className}>{children}</div>;
}

export function SkeletonPulse({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const root = scope.current;
    const controls = animate(".skeleton", { opacity: [0.6, 1, 0.6] }, { duration: 1.8, ease: "easeInOut", repeat: Infinity });
    return () => {
      controls.stop();
      root?.querySelectorAll<HTMLElement>(".skeleton").forEach((element) => element.style.removeProperty("opacity"));
    };
  }, [animate, reduced, scope]);
  return <div ref={scope} className="contents">{children}</div>;
}
