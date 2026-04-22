import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import Navbar from "@/themes/radiant/components/Navbar.tsx";
import { Footer } from "@/themes/radiant/components/Footer.tsx";
import PremiumLoader from "@/components/ui/PremiumLoader";
import SEO from "@/themes/radiant/components/SEO";
import { EntranceCurtain } from "./shared/PageCurtain";

interface PageLayoutProps {
  children: ReactNode;
  isLoading: boolean;
  loaderText: string;
  seoTitle?: string;
  seoDescription?: string;
  manualReadySignal?: boolean; 
  disableSnap?: boolean;
}

const PageLayout = ({
  children,
  isLoading,
  loaderText,
  seoTitle,
  seoDescription,
  manualReadySignal = false,
  disableSnap = false,
}: PageLayoutProps) => {
  const { pathname, hash } = useLocation();
  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(!manualReadySignal);

  useEffect(() => {
    if (!manualReadySignal) {
        setIsReady(true);
        return;
    }

    const handleReady = () => setIsReady(true);
    window.addEventListener('hero-ready', handleReady);
    window.addEventListener('page-ready', handleReady);
    
    const timer = setTimeout(() => setIsReady(true), 800);
    
    return () => {
      window.removeEventListener('hero-ready', handleReady);
      window.removeEventListener('page-ready', handleReady);
      clearTimeout(timer);
    };
  }, [manualReadySignal]);

  // 1. Immediate Scroll Reset on page change/mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  // 2. High-Precision Anchor Scroll logic
  useEffect(() => {
    if (isMobile || !isLoading && isReady && hash) {
      if (isMobile) return;
      let retries = 0;
      const maxRetries = 30; 
      let lastAbsoluteTop = -1;
      let interval: NodeJS.Timeout;

      const stopAutoScroll = () => {
        if (interval) clearInterval(interval);
      };

      // Stop auto-scroll if user interacts
      window.addEventListener('wheel', stopAutoScroll, { once: true });
      window.addEventListener('touchstart', stopAutoScroll, { once: true });
      
      const performScroll = () => {
        const el = document.querySelector(hash) as HTMLElement;
        if (el && el.offsetHeight > 0) {
          // Calculate absolute document position
          let actualTop = 0;
          let currentEl = el;
          while (currentEl) {
              actualTop += currentEl.offsetTop;
              currentEl = currentEl.offsetParent as HTMLElement;
          }

          // Only scroll if the ABSOLUTE position of the section changed (layout shift)
          // This prevents fighting with the user's manual scroll
          if (Math.abs(actualTop - lastAbsoluteTop) > 2) {
            const isTimeline = hash === '#timeline';
            el.scrollIntoView({ 
              behavior: lastAbsoluteTop === -1 ? "smooth" : "auto",
              block: isTimeline ? "start" : "center" 
            });
            lastAbsoluteTop = actualTop;
            return true;
          }
          
          // If position is stable for a while, we can stop early
          if (lastAbsoluteTop !== -1 && retries > 15) stopAutoScroll();
        }
        return false;
      };

      const scrollTimer = setTimeout(() => {
        interval = setInterval(() => {
          retries++;
          performScroll();
          if (retries >= maxRetries) stopAutoScroll();
        }, 100);
      }, 950); 

      return () => {
        clearTimeout(scrollTimer);
        stopAutoScroll();
        window.removeEventListener('wheel', stopAutoScroll);
        window.removeEventListener('touchstart', stopAutoScroll);
      };
    }
  }, [hash, pathname, isLoading, isReady, isMobile]);

  const isActuallyLoading = isLoading || !isReady;
  const isTablet = useIsTablet();
  
  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />
      
      <AnimatePresence>
        {isActuallyLoading && isTablet && <PremiumLoader text={loaderText} />}
      </AnimatePresence>
      
      <Navbar />

      <main className={`min-h-screen relative overflow-x-hidden ${(!isTablet && !disableSnap) ? "snap-y snap-mandatory" : ""}`}>
        {/* Premium Grainy Texture Overlay - PC Only for performance */}
        {!isTablet && (
          <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] mix-blend-multiply transition-opacity duration-1000" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        )}
        {/* Wrapper to apply snap-align to children via CSS if needed, but easier to do in sectionRenderer */}
        {children}
      </main>

      {!isLoading && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: isActuallyLoading ? 0 : 1 }}
           transition={{ delay: 1, duration: 1 }}
        >
          <Footer />
        </motion.div>
      )}

      {/* Entrance Animation Curtain */}
      <EntranceCurtain isLoading={isActuallyLoading} isMobile={isMobile} />
    </>
  );
};

export default PageLayout;
