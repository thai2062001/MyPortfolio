import { memo, useRef } from "react";
import { useIsTablet } from "@/hooks/use-mobile";
import { useHeroSettings, useProjects } from "@/core/hooks/usePortfolio";
import { usePortfolioPinTimeline } from "./usePortfolioPinTimeline";
import { HeroStageCards } from "./HeroStageCards";
import { ProjectCarouselStage } from "./ProjectCarouselStage";
import HeroSection from "../HeroSection";
import PortfolioGrid from "../PortfolioGrid";

interface PortfolioPinSectionProps {
  onNavigate: (slug: string) => void;
}

const PortfolioPinSection = memo(({ onNavigate }: PortfolioPinSectionProps) => {
  const isTablet = useIsTablet();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: hero, isLoading: isHeroLoading } = useHeroSettings();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  const isLoaded = !isHeroLoading && !isProjectsLoading && !!hero && !!projects;

  // Setup GSAP Timeline ScrollTrigger for Desktop only
  // (ScrollTrigger.refresh() được gọi bên trong usePortfolioPinTimeline, không cần gọi lại ở đây)
  usePortfolioPinTimeline(containerRef, isLoaded, isTablet);

  // --- MOBILE & TABLET FALLBACK: Normal scroll behavior without pinning ---
  if (isTablet) {
    return (
      <div className="w-full flex flex-col">
        {/* Render standard Hero Layout */}
        <HeroSection />
        {/* Render standard Portfolio Grid */}
        <PortfolioGrid onNavigate={onNavigate} />
      </div>
    );
  }

  // --- DESKTOP RENDER: Interactive Scroll-Pin Timeline ---
  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-[#0A0C0B] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image (visible during Stage 1 & 2) */}
      <div className="absolute inset-0 z-0 bg-[#0A0C0B]">
        <img
          src="https://res.cloudinary.com/dpdzbuiml/image/upload/w_1920,c_fit,dpr_auto,q_auto,f_auto/v1785488719/common/shbirsq5uksig3pt9rgd.webp"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* Absolute Dark Overlay (Fade in during Phase 3) */}
      <div className="pin-overlay absolute inset-0 z-10 bg-[#0A0C0B] pointer-events-none will-change-[opacity]" />

      {/* Stage 1 & 2: Overlapping Hero Cards */}
      <div className="relative z-20 w-full flex items-center justify-center">
        <HeroStageCards />
      </div>

      {/* Stage 4: Embla Project Carousel (Fades in, unpins, slideable) */}
      {/* opacity-0 via CSS ensures it stays hidden before GSAP gsap.set() runs */}
      {/* pointer-events-none by default: GSAP sẽ bật auto khi carousel fade vào */}
      <div className="pin-carousel-stage absolute inset-0 z-30 flex flex-col items-center justify-center w-full h-full pointer-events-none will-change-[opacity,transform,filter] opacity-0">
        <ProjectCarouselStage onNavigate={onNavigate} />
      </div>
    </div>
  );
});

PortfolioPinSection.displayName = "PortfolioPinSection";

export default PortfolioPinSection;
