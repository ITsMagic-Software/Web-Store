"use client";

import { m, type HTMLMotionProps } from "motion/react";
import { buttonMotion, spring } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "default" | "icon";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background transition-opacity hover:opacity-85 focus-visible:opacity-85",
  secondary: "bg-surface text-foreground transition-colors hover:bg-muted focus-visible:bg-muted",
  quiet: "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted",
};

const sizes: Record<ButtonSize, string> = {
  default: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium",
  icon: "grid size-11 shrink-0 place-items-center rounded-full",
};

export function Button({ variant = "secondary", size = "default", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <m.button
      type={type}
      initial="rest"
      animate="rest"
      whileHover={props.disabled ? undefined : "hover"}
      variants={{ rest: { scale: 1 }, hover: buttonMotion.hover }}
      whileTap={props.disabled ? undefined : buttonMotion.tap}
      transition={spring.hover}
      className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
