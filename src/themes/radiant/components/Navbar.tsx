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

    if (isMobile) {
      navigate(to);
      return;
    }

    setPendingUrl(to);
  }, [isMobile, location.pathname, navigate]);

  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      {!isMobile && (
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
          className="fixed top-0 inset-x-0 z-[300] px-4"
        >
          <div 
            className={cn(
              "mx-auto flex items-center justify-between h-14 md:h-16 px-10 md:px-16 rounded-full transition-all duration-500 gap-20 md:gap-36 w-fit min-w-[320px] md:min-w-[600px]",
              isTransparent
                ? "bg-transparent border-transparent shadow-none"
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
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center shrink-0 z-10">
              <button
                onClick={() => handleLinkClick("/portfolio#contact")}
                className={cn(
                  "group relative px-8 md:px-10 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-black/10",
                  isTransparent 
                    ? "bg-white text-[#1c1c19]" 
                    : "bg-[#1c1c19] text-white"
                )}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  {t("Contact", "お問い合わせ")}
                </span>
                <div className="absolute inset-0 bg-sage translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </div>
          </div>
        </motion.header>
      )}

      {isMobile && (
        <>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "fixed top-4 right-4 z-[10000] w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500",
              isMobileMenuOpen 
                ? "bg-white text-[#1c1c19] border border-black/10" 
                : "bg-[#1c1c19] text-white border border-white/10 shadow-xl"
            )}
          >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="absolute block w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute block w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                transition={{ duration: 0.4 }}
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
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9999] bg-[#fcfaf7]/98 backdrop-blur-md"
              >
                <div className="h-full w-full px-8 pt-32 pb-10 flex flex-col items-center justify-center gap-20 overflow-y-auto">
                  {/* Mobile Branding */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLinkClick("/");
                    }}
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
                  </div>

                  <div className="flex flex-col items-center gap-12 mt-4">
                    {[
                      { label: t("Home", "ホーム", "Trang chủ"), to: "/" },
                      { label: t("Portfolio", "ポートフォリオ", "Portfolio"), to: "/portfolio" },
                    ].map((link, i) => (
                      <button
                        key={link.to}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLinkClick(link.to);
                        }}
                        className="group relative text-sm font-bold uppercase tracking-[0.5em] text-[#1c1c19]/60 hover:text-[#1c1c19] transition-all font-display"
                      >
                        {link.label}
                        <motion.div
                          className="absolute -bottom-2 left-0 right-0 h-px bg-[#1c1c19]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: location.pathname === link.to ? 1 : 0 }}
                          style={{ transformOrigin: "left" }}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLinkClick("/portfolio#contact");
                    }}
                    className="group relative mt-8 px-12 py-5 rounded-full bg-[#1c1c19] text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-2xl font-display hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                      {t("Contact", "お問い合わせ", "Liên hệ")}
                    </span>
                    <div className="absolute inset-0 bg-sage translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
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
