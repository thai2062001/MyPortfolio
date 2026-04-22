import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ShinyText from "./framer-ui/ShinyText";
import { TransitionCurtain } from "./shared/PageCurtain";
import { usePersonalInfo } from "@/core/hooks/usePortfolio";

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { t } = useLang();
  const { data: personalInfo } = usePersonalInfo();

  const lastScrollY = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Mobile: render menu icon only, skip scroll-driven navbar logic.
    if (isMobile) {
      setIsVisible(true);
      setIsScrolled(false);
      return;
    }

    const onScroll = () => {
      const latest = window.scrollY || 0;
      setIsScrolled(latest > 20);

      const diff = latest - lastScrollY.current;
      if (latest < 50) {
        setIsVisible(true);
      } else if (diff > 15) {
        setIsVisible(false);
      } else if (diff < -10) {
        setIsVisible(true);
      }

      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      lastScrollY.current = latest;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [isMobile]);

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
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -120 }}
        animate={{ 
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0,
          paddingTop: isScrolled ? "12px" : "24px",
          paddingBottom: isScrolled ? "12px" : "24px"
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.4 }
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-[300] px-4",
          isMobile && "hidden"
        )}
      >
        <div 
          className={cn(
            "mx-auto flex items-center justify-between h-14 md:h-16 px-10 md:px-16 rounded-full transition-all duration-500 gap-20 md:gap-36 w-fit min-w-[320px] md:min-w-[600px]",
            isTransparent
              ? "bg-transparent border-transparent shadow-none backdrop-blur-none"
              : isTablet
                ? "bg-white/92 dark:bg-[#1c1c19]/92 border border-black/5 dark:border-white/5 shadow-lg shadow-black/5"
                : "bg-white/80 dark:bg-[#1c1c19]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-lg shadow-black/5"
          )}
        >
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
                  <motion.button
                    key={link.to}
                    onClick={() => handleLinkClick(link.to)}
                    initial="initial"
                    whileHover="hover"
                    animate="animate"
                    className={cn(
                      "relative text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300 py-1 font-display",
                      isTransparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-sage"
                    )}
                  >
                    {link.label}
                    <motion.div
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[1.5px]",
                        isTransparent ? "bg-white" : "bg-sage"
                      )}
                      variants={{
                        initial: { scaleX: 0 },
                        animate: { scaleX: location.pathname === link.to ? 1 : 0 },
                        hover: { scaleX: 1 }
                      }}
                      style={{ transformOrigin: "left" }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                    />
                  </motion.button>
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
                <div className="h-full w-full px-8 pt-20 pb-10 flex flex-col relative overflow-y-auto">
                  <div className="flex-1 flex flex-col justify-center items-center gap-12">
                    {/* Mobile Logo Branding - Now part of the center stack */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.5 }}
                      onClick={() => {
                         setIsMobileMenuOpen(false);
                         handleLinkClick("/");
                      }}
                      className="mb-4"
                    >
                      <div className="font-artistic text-3xl tracking-tight">
                        <ShinyText 
                          text={personalInfo?.full_name || "Pham Ba Thai"} 
                          disabled={false}
                          speed={5} 
                          color="#1c1c19" 
                          shineColor="#ffffff"
                        />
                      </div>
                    </motion.div>

                    <div className="flex flex-col items-center gap-6">
                      {[
                        { label: t("Home", "ホーム", "Trang chủ"), to: "/" },
                        { label: t("Portfolio", "ポートフォリオ", "Portfolio"), to: "/portfolio" },
                      ].map((link, i) => (
                        <motion.button
                          key={link.to}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * (i + 1) }}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLinkClick(link.to);
                          }}
                          className="text-4xl md:text-5xl font-display text-[#1c1c19] hover:text-sage transition-colors"
                        >
                          {link.label}
                        </motion.button>
                      ))}
                    </div>
                    
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLinkClick("/portfolio#contact");
                      }}
                      className="w-full max-w-[280px] rounded-full bg-[#1c1c19] py-5 text-lg font-bold uppercase tracking-widest text-white shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
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
