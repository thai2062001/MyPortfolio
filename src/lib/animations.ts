import { Variants } from "framer-motion";

// Helper to determine if we should use high-performance transitions
const isReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
const isSmallScreen = typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false;

export const fadeIn = (direction: "up" | "down" | "left" | "right" | "none" = "none", delay: number = 0, isMobile: boolean = false): Variants => {
  const lightweightMotion = isReducedMotion || isMobile || isSmallScreen;

  if (lightweightMotion) {
    return {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { duration: 0.3, delay: Math.min(delay, 0.08), ease: "easeOut" }
      }
    };
  }

  return {
    hidden: {
      y: direction === "up" ? (isMobile ? 15 : 30) : direction === "down" ? (isMobile ? -15 : -30) : 0,
      x: direction === "left" ? (isMobile ? 15 : 30) : direction === "right" ? (isMobile ? -15 : -30) : 0,
      opacity: 0,
      transition: { duration: 0 }
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: isMobile ? "tween" : "spring",
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for premium feel
        duration: isMobile ? 0.6 : 1.2,
        delay: delay,
        bounce: 0, // Reduced bounce for cleaner look
      },
    },
  };
};

export const staggerContainer = (staggerChildren?: number, delayChildren?: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: isSmallScreen ? 0 : (staggerChildren || 0.1),
      delayChildren: isSmallScreen ? 0 : (delayChildren || 0),
    },
  },
});

export const textVariant = (delay: number, isMobile: boolean = false): Variants => ({
  hidden: {
    y: isMobile ? 20 : 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: isMobile ? "tween" : "spring",
      duration: isMobile ? 0.8 : 1.25,
      delay: delay,
      ease: "easeOut"
    },
  },
});

// Added GPU accelerated hover effect
export const hoverScale = (isMobile: boolean = false) => {
  if (isMobile) return {}; // Disable expensive hover effects on mobile touch
  return {
    scale: 1.02,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  };
};
