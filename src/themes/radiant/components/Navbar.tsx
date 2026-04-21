import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ShinyText from "./framer-ui/ShinyText";
import CardNav from "./framer-ui/CardNav";
import { HeroSectionWithLayout } from "@/types/admin";
import { TransitionCurtain } from "./shared/PageCurtain";
import { useHeroSettings, usePersonalInfo } from "@/core/hooks/usePortfolio";
import { useSectionRenderer } from "@/core/hooks/useSectionRenderer";

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { lang, setLang, t } = useLang();
  const { data: personalInfo } = usePersonalInfo();

  // Scroll tracking for visibility and background states
  useMotionValueEvent(scrollY, "change", (latest) => {
    const newScrolled = latest > 20;
    if (newScrolled !== isScrolled) setIsScrolled(newScrolled);

    const direction = latest > lastScrollYRef.current ? "down" : "up";
    if (direction === "down" && latest > 100) {
      if (isVisible) setIsVisible(false);
    } else if (direction === "up") {
      if (!isVisible) setIsVisible(true);
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsVisible(true), 1000);
    lastScrollYRef.current = latest;
  });

  const handleLinkClick = useCallback((to: string) => {
    const [targetPath, hash] = to.split("#");
    const normalize = (p: string) => (p === "" || p === "/" ? "/" : p.endsWith("/") ? p.slice(0, -1) : p);
    
    if (normalize(location.pathname) === normalize(targetPath)) {
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setPendingUrl(to);
    }
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";
  const { data: hero } = useHeroSettings();
  const heroData = hero as HeroSectionWithLayout | undefined;
  const heroLayout = isHomePage ? (heroData?.selected_layout_key || "split-left-image-right") : null;
  const isTransparent = isHomePage && !isScrolled;

  const langLabel = lang === "en" ? "JA" : lang === "ja" ? "VN" : "EN";
  const toggleLang = () => {
    if (lang === "en") setLang("ja");
    else if (lang === "ja") setLang("vi");
    else setLang("en");
  };

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
          "fixed top-0 inset-x-0 z-[100] px-4 transition-all duration-500",
          isScrolled ? "py-3" : "py-5"
        )}
      >
        <div className={cn(
          "mx-auto flex items-center justify-between h-14 md:h-16 px-10 md:px-16 rounded-full transition-all duration-500 gap-20 md:gap-36 w-fit min-w-[320px] md:min-w-[600px]",
          isTransparent && !isScrolled
            ? "bg-transparent border-transparent shadow-none backdrop-blur-none"
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
                onClick={() => handleLinkClick("/contact")}
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

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
