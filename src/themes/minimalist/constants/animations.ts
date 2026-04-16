/**
 * Shared Animation Configurations for Minimalist Theme
 * Following the "Organic Neo-Nordic" design language.
 */

export const NORDIC_TRANSITION = {
  type: "spring",
  stiffness: 70,
  damping: 15,
  mass: 1,
} as const;

export const SUPPLE_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;

export const FADE_UP_VARIANTS = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98 
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...NORDIC_TRANSITION,
      delay: i * 0.1,
    },
  }),
};

export const REVEAL_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: NORDIC_TRANSITION,
  },
};
