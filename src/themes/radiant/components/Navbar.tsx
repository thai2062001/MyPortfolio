import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import ShinyText from "./framer-ui/ShinyText";
import CardNav from "./framer-ui/CardNav";
import { HeroSectionWithLayout } from "@/types/admin";
import { TransitionCurtain } from "./shared/PageCurtain";
import { useHeroSettings, usePersonalInfo } from "@/core/hooks/usePortfolio";
import { useSectionRenderer } from "@/core/hooks/useSectionRenderer";

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { lang, setLang, t } = useLang();
  const { data: hero } = useHeroSettings();
  const { data: personalInfo } = usePersonalInfo();

  // Use framer-motion's useMotionValueEvent for high-performance scroll tracking
  useMotionValueEvent(scrollY, "change", (latest) => {
    // 1. Handle isScrolled
    const newScrolled = latest > 20;
    if (newScrolled !== isScrolled) {
      setIsScrolled(newScrolled);
    }

    // 2. Handle isVisible (Directional hide/show)
    if (isMenuOpen) {
      if (!isVisible) setIsVisible(true);
      return;
    }

    const direction = latest > lastScrollYRef.current ? "down" : "up";
    
    // Threshold: only start hiding after 100px
    if (direction === "down" && latest > 100) {
      if (isVisible) setIsVisible(false);
    } else if (direction === "up") {
      if (!isVisible) setIsVisible(true);
    }

    // Force visible after stop scrolling
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 450);

    lastScrollYRef.current = latest;
  });

  const handleLinkClick = useCallback((to: string) => {
    setIsMenuOpen(false);
    
    // Parse target path and hash
    const [targetPath, hash] = to.split("#");
    
    // Normalize paths by removing trailing slashes for comparison
    const normalize = (path: string) => {
      const p = path === "" || path === "/" ? "/" : path;
      return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
    };
    
    const normalizedTarget = normalize(targetPath);
    const normalizedCurrent = normalize(location.pathname);
    const isSamePage = normalizedCurrent === normalizedTarget;

    if (isSamePage) {
      if (hash) {
        window.history.replaceState(null, "", `#${hash}`);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (isTablet) {
        navigate(to);
      } else {
        setPendingUrl(to);
      }
    }
  }, [location.pathname, navigate, isTablet]);

  const isHomePage = location.pathname === "/";
  const heroData = hero as HeroSectionWithLayout | undefined;
  const heroLayout = isHomePage ? (heroData?.selected_layout_key || "split-left-image-right") : null;

  const isTransparentLayout = 
    heroLayout === "full-background" || 
    heroLayout === "card-overlay" || 
    heroLayout === "centered-minimal" ||
    (isHomePage && !hero);

  const shouldBeTransparent = (isHomePage && !isScrolled && isTransparentLayout);

  const { sections: homeSections } = useSectionRenderer("home");
  const { sections: portfolioSections } = useSectionRenderer("portfolio");

  // Map database section keys to human-readable labels and anchor IDs
  // This ensures the menu reflects exactly what's published and in the right order
  const sectionMetadata: Record<string, { labelKey: string; defaultEn: string; defaultJa: string; hash: string }> = useMemo(() => ({
    'home_hero': { labelKey: "Introduction", defaultEn: "Intro", defaultJa: "トップ", hash: "/" },
    'home_about': { labelKey: "About", defaultEn: "About", defaultJa: "私について", hash: "/#about" },
    'home_metrics': { labelKey: "Global Impact", defaultEn: "Impact", defaultJa: "実績値", hash: "/#stats" },
    'home_stats': { labelKey: "Global Impact", defaultEn: "Impact", defaultJa: "実績値", hash: "/#stats" },
    'home_clients': { labelKey: "Partners", defaultEn: "Clients", defaultJa: "取引実績", hash: "/#clients" },
    'home_services': { labelKey: "Services", defaultEn: "Services", defaultJa: "サービス", hash: "/#skills" },
    'home_skills': { labelKey: "Strategic Skills", defaultEn: "Strategic Skills", defaultJa: "専門知識", hash: "/portfolio#proficiencies" },
    'home_expertise': { labelKey: "Expertise", defaultEn: "Expertise", defaultJa: "専門知識", hash: "/portfolio#proficiencies" },
    'home_timeline': { labelKey: "Timeline", defaultEn: "Journey", defaultJa: "経歴", hash: "/#timeline" },
    'home_contact': { labelKey: "Contact", defaultEn: "Contact", defaultJa: "お問い合わせ", hash: "/portfolio#contact" },
    'home_faq': { labelKey: "FAQ", defaultEn: "FAQ", defaultJa: "質問", hash: "/portfolio#faq" },
    'home_blogs': { labelKey: "Blogs", defaultEn: "Blogs", defaultJa: "ブログ", hash: "/#blog" },
    'portfolio_blogs': { labelKey: "Blogs", defaultEn: "Blogs", defaultJa: "ブログ", hash: "/portfolio#blog" },
    
    'portfolio_grid': { labelKey: "Project Grid", defaultEn: "Works", defaultJa: "プロジェクト", hash: "/portfolio#works" },
    'portfolio_proficiencies': { labelKey: "Strategic Skills", defaultEn: "Strategic Skills", defaultJa: "専門知識", hash: "/portfolio#proficiencies" },
    'portfolio_testimonials': { labelKey: "Testimonials", defaultEn: "Kind Words", defaultJa: "推奨", hash: "/portfolio#kind-words" },
    'portfolio_contact': { labelKey: "Got In Touch", defaultEn: "Contact", defaultJa: "お問い合わせ", hash: "/portfolio#contact" },
    'portfolio_faq': { labelKey: "General FAQ", defaultEn: "FAQ", defaultJa: "よくある質問", hash: "/portfolio#faq" },
  }), []);

  const navItems = useMemo(() => {
    // Helper to get correct path based on category
    const getLink = (metaHash: string, defaultPage: string) => {
      if (metaHash === "/" || metaHash === "/portfolio") return metaHash;
      const anchor = metaHash.split("#")[1];
      return anchor ? `${defaultPage}#${anchor}` : metaHash;
    };

    // 1. Build Home Links dynamically
    const homeLinks = homeSections
      .filter(s => sectionMetadata[s.section_key])
      .map(s => {
        const meta = sectionMetadata[s.section_key];
        return {
          label: t(meta.labelKey, meta.defaultEn),
          onClick: () => handleLinkClick(getLink(meta.hash, "/"))
        };
      });

    const introLabel = t("Introduction", "Intro");
    const introLabelJa = t("Introduction", "トップ");

    if (!homeLinks.some(l => l.label === introLabel || l.label === introLabelJa)) {
      homeLinks.unshift({ label: introLabel, onClick: () => handleLinkClick("/") });
    }

    // 2. Build Portfolio Links dynamically
    const portfolioLinks = portfolioSections
      .filter(s => sectionMetadata[s.section_key])
      .map(s => {
        const meta = sectionMetadata[s.section_key];
        return {
          label: t(meta.labelKey, meta.defaultEn),
          onClick: () => handleLinkClick(getLink(meta.hash, "/portfolio"))
        };
      });

    const langLabel = lang === "en" ? "日本語" : lang === "ja" ? "Tiếng Việt" : "English";

    return [
      {
        label: t("Main Page", "ホーム"),
        bgColor: "#1c1c19",
        textColor: "#fcfaf7",
        links: homeLinks
      },
      {
        label: t("Portfolio", "ポートフォリオ"),
        bgColor: "#2a2a28",
        textColor: "#fcfaf7",
        links: portfolioLinks
      },
      {
        label: t("Options", "オプション"),
        bgColor: "#d4d4d2",
        textColor: "#1c1c19",
        links: [
          { 
            label: lang === "en" 
              ? `Switch to ${langLabel}` 
              : lang === "ja" 
                ? "Tiếng Việt に切り替え" 
                : "Switch to English", 
            onClick: () => {
              if (lang === "en") setLang("ja");
              else if (lang === "ja") setLang("vi");
              else setLang("en");
            }
          },
        ]
      }
    ];
  }, [lang, t, homeSections, portfolioSections, handleLinkClick, sectionMetadata, setLang]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <CardNav
          items={navItems}
          onToggle={setIsMenuOpen}
          logo={
            <div 
              className="font-artistic text-xl md:text-2xl cursor-pointer"
              onClick={() => handleLinkClick("/")}
            >
              <ShinyText 
                text={personalInfo?.full_name || "Pham Ba thai"} 
                disabled={false} 
                speed={5} 
                color={shouldBeTransparent ? "#fcfaf7" : "#1c1c19"} 
                shineColor={shouldBeTransparent ? "#000000" : "#ffffff"}
              />
            </div>
          }
          baseColor={shouldBeTransparent ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.85)"}
          menuColor={shouldBeTransparent ? "#fff" : "#1c1c19"}
          buttonBgColor={shouldBeTransparent ? "#fff" : "#1c1c19"}
          buttonTextColor={shouldBeTransparent ? "#1c1c19" : "#fff"}
          ctaText={t("Contact", "お問い合わせ")}
          ctaAction={() => handleLinkClick("/portfolio#contact")}
          className={shouldBeTransparent ? "backdrop-blur-none border-white/5" : "backdrop-blur-md md:backdrop-blur-lg border-black/5 shadow-xl shadow-black/5"}
        />
      </motion.div>

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
