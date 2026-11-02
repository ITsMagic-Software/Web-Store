import type { Variants } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export const transition = {
  quick: { duration: 0.16, ease },
  reveal: { duration: 0.24, ease },
  exit: { duration: 0.12, ease: "easeIn" as const },
};

export const spring = {
  hover: { type: "spring" as const, stiffness: 400, damping: 32, mass: 0.7 },
  layout: { type: "spring" as const, stiffness: 360, damping: 36, mass: 0.8 },
};

export const buttonMotion = {
  hover: { scale: 1.015 },
  tap: { scale: 0.975 },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transition.reveal },
  exit: { opacity: 0, y: 6, scale: 0.99, transition: transition.exit },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.quick },
  exit: { opacity: 0, transition: transition.exit },
};

export const contentVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: transition.reveal },
  exit: { opacity: 0, y: -3, transition: transition.exit },
};

export const menuVariants: Variants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transition.quick },
  exit: { opacity: 0, y: -2, scale: 0.99, transition: transition.exit },
};

export const iconVariants: Variants = {
  hidden: { opacity: 0, rotate: -20, scale: 0.9 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: transition.quick },
  exit: { opacity: 0, rotate: 20, scale: 0.9, transition: transition.exit },
};

export const cardVariants: Variants = {
  rest: { y: 0, transition: spring.hover },
  hover: { y: -3, transition: spring.hover },
};

export const thumbnailVariants: Variants = {
  rest: { scale: 1, transition: transition.reveal },
  hover: { scale: 1.025, transition: transition.reveal },
};

export const arrowVariants: Variants = {
  rest: { opacity: 0, x: -3, y: 3, rotate: -8, transition: transition.quick },
  hover: { opacity: 1, x: 0, y: 0, rotate: 0, transition: transition.quick },
};
