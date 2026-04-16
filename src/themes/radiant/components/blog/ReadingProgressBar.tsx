import React, { memo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ReadingProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] md:h-[3px] bg-sage origin-left z-[100] pointer-events-none"
      style={{ scaleX }}
    />
  );
};

export default memo(ReadingProgressBar);
