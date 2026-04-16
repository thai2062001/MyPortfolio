import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BottomBlurOverlay = () => {
  const [hideBlur, setHideBlur] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollPosition = window.innerHeight + scrollY;
      const threshold = document.body.offsetHeight - 150;

      // Hide if near bottom OR at the top (Hero section)
      if (scrollPosition >= threshold || scrollY < 50) {
        setHideBlur(true);
      } else {
        setHideBlur(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  if (isAdminPage) return null;

  return (
    <AnimatePresence>
      {!hideBlur && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 w-full h-24 md:h-32 pointer-events-none z-[40]"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "linear-gradient(to top, rgba(252, 250, 247, 0.95) 0%, rgba(252, 250, 247, 0.7) 40%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 0%, black 20%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 20%, transparent 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default BottomBlurOverlay;
