import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageCurtainProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
  color?: string;
  zIndex?: number;
  direction?: "up" | "down";
}

const PageCurtain = memo(({
  isVisible,
  onAnimationComplete,
  color = "bg-[#fcfaf7]",
  zIndex = 10000,
  direction = "down",
}: PageCurtainProps) => {
  const isMobile = useIsMobile();

  if (isMobile) return null;
  
  const initialY = direction === "down" ? 0 : "100%";
  const animateY = direction === "down" ? "-100%" : 0;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: initialY }}
          animate={{ y: isVisible ? initialY : animateY }} // Note: This logic depends on usage
          // The pattern used in ProjectDetail and Portfolio is actually different for Entrance vs Transition
          // Entrance: initial 0, animate -100%
          // Transition: initial 100%, animate 0
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={onAnimationComplete}
          className={`fixed inset-0 ${zIndex} ${color} pointer-events-none`}
          style={{ zIndex }}
        />
      )}
    </AnimatePresence>
  );
});

PageCurtain.displayName = "PageCurtain";

/**
 * Entrance Curtain: Starts at 0, animates to -100% (Upward reveal)
 */
export const EntranceCurtain = memo(({ 
  isLoading, 
  color = "bg-[#fcfaf7]",
  isMobile = false 
}: { isLoading: boolean, color?: string, isMobile?: boolean }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: isLoading ? 0 : "-100%" }}
    transition={{ duration: isMobile ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`fixed inset-0 z-[10000] ${color} pointer-events-none`}
  />
));

/**
 * Transition Curtain: Starts at 100%, animates to 0 (Upward cover)
 */
export const TransitionCurtain = memo(({
  isActive, 
  onComplete,
  color = "bg-[#fcfaf7]"
}: { isActive: boolean, onComplete: () => void, color?: string }) => {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={onComplete}
          className={`fixed inset-0 z-[9999] ${color}`}
        />
      )}
    </AnimatePresence>
  );
});

export default PageCurtain;
