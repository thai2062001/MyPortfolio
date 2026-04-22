import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ShinyText from "./framer-ui/ShinyText";
import { HeroSectionWithLayout } from "@/types/admin";
import { TransitionCurtain } from "./shared/PageCurtain";
import { useHeroSettings, usePersonalInfo } from "@/core/hooks/usePortfolio";

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { lang, setLang, t } = useLang();
  const { data: personalInfo } = usePersonalInfo();

  // Use lightweight scroll tracking on small screens to keep header layering/styling correct.
  useEffect(() => {
    if (isTablet) {
      setIsVisible(true);
      let ticking = false;
      const onTabletScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
      };

      onTabletScroll();
      window.addEventListener("scroll", onTabletScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onTabletScroll);
      };
    }

    let ticking = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const latest = window.scrollY || 0;
        const newScrolled = latest > 20;
        setIsScrolled((prev) => (prev === newScrolled ? prev : newScrolled));

        const directionDown = latest > lastScrollYRef.current;
        if (directionDown && latest > 100) {
          setIsVisible((prev) => (prev ? false : prev));
        } else {
          setIsVisible((prev) => (prev ? prev : true));
        }

        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setIsVisible(true), 300);

        lastScrollYRef.current = latest;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTablet]);

  useEffect(() => {
    if (!isTablet) return;
    setIsVisible(true);
  }, [isTablet, location.pathname]);

  useEffect(() => {
    if (!isMobile) return;
    setIsMobileMenuOpen(false);
  }, [isMobile, location.pathname]);

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isMobileMenuOpen]);

  const handleLinkClick = useCallback((to: string) => {
    const [targetPath, hash] = to.split("#");
    const normalize = (p: string) => (p === "" || p === "/" ? "/" : p.endsWith("/") ? p.slice(0, -1) : p);
    
    if (normalize(location.pathname) === normalize(targetPath)) {
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    setPendingUrl(to);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";
  const { data: hero } = useHeroSettings();
  const heroData = hero as HeroSectionWithLayout | undefined;
  const isScrolledLocal = isScrolled;
  const isTransparent = isHomePage && !isScrolledLocal;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-[300] px-4 transition-all duration-500",
          isMobile && "hidden",
          isScrolledLocal ? "py-3" : "py-5"
        )}
      >
        <div className={cn(
          "mx-auto flex items-center justify-between h-14 md:h-16 px-10 md:px-16 rounded-full transition-all duration-500 gap-20 md:gap-36 w-fit min-w-[320px] md:min-w-[600px]",
          isTransparent && !isScrolledLocal
            ? "bg-transparent border-transparent shadow-none backdrop-blur-none"
            : isTablet
              ? "bg-white/92 dark:bg-[#1c1c19]/92 border border-black/5 dark:border-white/5 shadow-lg shadow-black/5"
              : "bg-white/80 dark:bg-[#1c1c19]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-lg shadow-black/5"
        )}>
          {/* Identity/Logo */}
          <div 
            className="group flex items-center shrink-0 cursor-pointer z-10"
            onClick={() => handleLinkClick("/")}
          >
            <div className="font-artistic text-xl md:text-2xl tracking-tight">
              <ShinyText 
                text={personalInfo?.full_name || "Pham Ba Thai"} 
                disabled={isTablet}
                speed={5} 
                color={isTransparent ? "#ffffff" : "#1c1c19"} 
                shineColor={isTransparent ? "#000000" : "#ffffff"}
              />
            </div>
          </div>

          {!isMobile && (
            <nav className="flex items-center gap-16 lg:gap-24 pointer-events-auto">
                {[
                  { label: t("Home", "ホーム"), to: "/" },
                  { label: t("Portfolio", "ポートフォリオ"), to: "/portfolio" },
                ].map((link) => (
                  <button
                    key={link.to}
                    onClick={() => handleLinkClick(link.to)}
                    className={cn(
                      "relative text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 py-1 font-serif",
                      isTransparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-sage"
                    )}
                  >
                    {link.label}
                    <motion.div
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[1px]",
                        isTransparent ? "bg-white" : "bg-sage"
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: location.pathname === link.to ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                ))}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 md:gap-10 z-10">
              <button
                onClick={() => handleLinkClick("/portfolio#contact")}
                className={cn(
                  "px-8 md:px-10 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 shadow-xl shadow-black/10 flex items-center gap-2",
                  isTransparent 
                    ? "bg-white text-[#1c1c19] hover:bg-white/90" 
                    : "bg-[#1c1c19] text-white hover:bg-[#1c1c19]/90"
                )}
              >
                {t("Contact", "お問い合わせ")}
              </button>
            </div>
          </div>
        </motion.header>

      {isMobile && (
        <>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "fixed top-4 right-4 z-[320] w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500",
              isMobileMenuOpen 
                ? "bg-white text-[#1c1c19] border border-black/10" 
                : "bg-[#1c1c19] text-white border border-white/10 shadow-xl"
            )}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute block w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute block w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute block w-full h-0.5 bg-current rounded-full"
              />
            </div>
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[310] bg-[#fcfaf7]/95 backdrop-blur-md"
              >
                <div className="h-full w-full px-6 pt-6 pb-10 flex flex-col">
                  <div className="flex-1 flex flex-col justify-center items-center gap-8">
                    {[
                      { label: t("Home", "ホーム", "Trang chủ"), to: "/" },
                      { label: t("Portfolio", "ポートフォリオ", "Portfolio"), to: "/portfolio" },
                    ].map((link, i) => (
                      <motion.button
                        key={link.to}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLinkClick(link.to);
                        }}
                        className="text-4xl md:text-5xl font-display text-[#1c1c19] hover:text-sage transition-colors"
                      >
                        {link.label}
                      </motion.button>
                    ))}
                    
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLinkClick("/portfolio#contact");
                      }}
                      className="mt-8 w-full max-w-[280px] rounded-full bg-[#1c1c19] py-5 text-lg font-bold uppercase tracking-widest text-white shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      {t("Contact", "お問い合わせ", "Liên hệ")}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
