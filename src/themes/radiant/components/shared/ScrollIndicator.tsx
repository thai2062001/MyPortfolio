import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback } from "react";
import { useIsTablet } from "@/hooks/use-mobile";

interface ScrollIndicatorProps {
  color?: string;
  className?: string;
}

export const ScrollIndicator = ({ color = "white", className = "" }: ScrollIndicatorProps) => {
  const isTablet = useIsTablet();
  const { scrollY } = useScroll();
  // Fade out as we scroll down
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const scrollToNext = useCallback(() => {
    // Find the next section after hero
    const hero = document.querySelector('section');
    if (hero) {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback: scroll by viewport height
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }
    }
  }, []);

  if (isTablet) return null;

  return (
    <motion.div
      style={{ opacity }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1 }}
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 cursor-pointer group ${className}`}
      onClick={scrollToNext}
    >
      <span 
        className="font-sans text-[8px] md:text-[9px] tracking-[0.5em] uppercase font-bold transition-colors duration-300"
        style={{ color: color === "white" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
      >
        Scroll
      </span>
      
      {/* Mouse Icon with animated wheel */}
      <div 
        className="w-[20px] h-[32px] rounded-full border-2 flex justify-center p-1.5 transition-colors duration-300 group-hover:border-vibe-pink group-hover:shadow-[0_0_15px_rgba(255,0,122,0.2)]"
        style={{ borderColor: color === "white" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
      >
        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [1, 0.4, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-1 h-1.5 rounded-full bg-vibe-pink"
        />
      </div>
    </motion.div>
  );
};
