import { useState, useCallback, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import { useHeroSettings } from "@/core/hooks/usePortfolio";
import { getHeroLayout } from "./hero-layouts";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { TransitionCurtain } from "./shared/PageCurtain";

const HeroSection = memo(() => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { data: hero, isLoading } = useHeroSettings();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (hero) {
      if (hero.hero_image_url && !hero.hero_image_url.includes('.mp4')) {
        const isMobile = window.innerWidth < 768;
        // Optimization: Mobile devices only need ~800px, while desktop background layouts need 1920px
        const width = isMobile ? 800 : ((layoutKey === "background" || layoutKey === "card-overlay") ? 1920 : 1200);
        
        // Synchronize with layout components optimization parameters
        const optimizedUrl = optimizeCloudinary(hero.hero_image_url, { width });
        const existingLink = document.head.querySelector(`link[rel="preload"][href="${optimizedUrl}"]`);
        
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = optimizedUrl;
          link.setAttribute('data-hero-preload', 'true');
          // @ts-expect-error - fetchpriority is a new attribute
          link.fetchpriority = 'high';
          document.head.appendChild(link);
        }
      }
    }
    return () => { 
      document.querySelectorAll('link[data-hero-preload="true"]').forEach(el => el.remove());
    };
  }, [hero]);

  const handleNavigate = useCallback((to: string) => {
    // If it's hash on same page, don't use curtain
    if (to.startsWith("#") || (to.startsWith("/") && to.includes("#") && to.split("#")[0] === window.location.pathname)) {
      const hash = to.includes("#") ? to.split("#")[1] : to.replace("#", "");
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    setPendingUrl(to);
  }, []);

  const videoUrl = "https://res.cloudinary.com/dpdzbuiml/video/upload/q_auto/f_auto/v1775532590/Cinematic_Woman_Scene_A_woman_sits_at_a_desk_in_a_field_of_flowers_8LsdavUH_xeukdy.mp4";
  const layoutKey = hero?.selected_layout_key || "split-left-image-right";

  useEffect(() => {
    if (!isLoading && hero) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hero-ready'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, hero]);

  if (isLoading) {
    return <section className="min-h-screen min-h-[100svh] bg-[#00040d]" />;
  }

  if (!hero) return null;

  const finalMediaUrl = (hero.hero_image_url && hero.hero_image_url.length > 10) 
    ? hero.hero_image_url 
    : videoUrl;

  const HeroLayoutComponent = getHeroLayout(layoutKey);

  return (
    <>
      <HeroLayoutComponent
        content={{ ...hero, hero_image_url: finalMediaUrl }}
        config={hero.layout_config || {}}
        onNavigate={handleNavigate}
        lang={lang}
      />
      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
