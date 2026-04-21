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
  const isTransparent = isHomePage && !isScrolled && (heroLayout === "full-background" || !hero);

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
          "mx-auto flex items-center justify-between h-14 md:h-16 px-6 md:px-10 rounded-full border transition-all duration-500 gap-8 md:gap-14 bg-white/80 dark:bg-[#1c1c19]/80 backdrop-blur-xl border-black/5 dark:border-white/5 shadow-lg shadow-black/5 w-fit",
          !isScrolled && isTransparent && "bg-transparent border-transparent backdrop-blur-none shadow-none"
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
            <nav className="flex items-center gap-8 lg:gap-12 pointer-events-auto">
                {[
                  { label: t("Home", "ホーム"), to: "/" },
                  { label: t("Portfolio", "ポートフォリオ"), to: "/portfolio" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleLinkClick(item.to)}
                    className={cn(
                      "text-sm md:text-lg font-serif font-bold tracking-tight transition-all duration-300 relative group",
                      isTransparent ? "text-white/80 hover:text-white" : "text-[#1c1c19]/80 hover:text-[#1c1c19]"
                    )}
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full opacity-30" />
                  </button>
                ))}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-6 z-10">
              <button 
                onClick={toggleLang}
                className={cn(
                  "text-[10px] md:text-xs font-black w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                  isTransparent 
                    ? "border-white/10 text-white hover:bg-white/10" 
                    : "border-black/5 text-[#1c1c19] hover:bg-black/5"
                )}
              >
                {langLabel}
              </button>

              <button
                onClick={() => handleLinkClick("/portfolio#contact")}
                className={cn(
                  "h-10 md:h-12 px-5 md:px-8 rounded-full font-sans font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.05] active:scale-[0.98] shadow-xl shadow-black/5",
                  isTransparent 
                    ? "bg-white text-[#1c1c19] hover:bg-white/90" 
                    : "bg-[#1c1c19] text-white hover:bg-[#1c1c19]/90"
                )}
              >
                {t("Contact", "お問い合わせ")}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
