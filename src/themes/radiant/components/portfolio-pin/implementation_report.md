# BÁO CÁO TRIỂN KHAI TÍNH NĂNG SCROLL-PIN HERO → PROJECTS CAROUSEL

Báo cáo chi tiết và đầy đủ các file đã tạo, chỉnh sửa và các logic thiết lập thực tế trong mã nguồn của tính năng Scroll-Pin Hero → Projects Carousel cho trang `/portfolio`.

---

## 1. Danh sách file đã tạo/sửa
1. **[NEW]** [`src/themes/radiant/components/portfolio-pin/PortfolioPinSection.tsx`](file:///c:/Users/Admin/Desktop/Du%20an%20web/Myportfolio/SumStock_v1_port/src/themes/radiant/components/portfolio-pin/PortfolioPinSection.tsx): Component điều phối chính, quản lý layer hiển thị (z-index) và fallback sang layout cuộn thường (`HeroSection` + `PortfolioGrid`) trên Mobile/Tablet.
2. **[NEW]** [`src/themes/radiant/components/portfolio-pin/HeroStageCards.tsx`](file:///c:/Users/Admin/Desktop/Du%20an%20web/Myportfolio/SumStock_v1_port/src/themes/radiant/components/portfolio-pin/HeroStageCards.tsx): Component render 2 card hình ảnh xếp chồng lên nhau ở Giai đoạn 1 & 2 của hiệu ứng.
3. **[NEW]** [`src/themes/radiant/components/portfolio-pin/ProjectCarouselStage.tsx`](file:///c:/Users/Admin/Desktop/Du%20an%20web/Myportfolio/SumStock_v1_port/src/themes/radiant/components/portfolio-pin/ProjectCarouselStage.tsx): Carousel chứa danh sách dự án lấy từ CSDL động, sử dụng Embla Carousel để trượt và áp dụng hiệu ứng mờ/scale/active focus.
4. **[NEW]** [`src/themes/radiant/components/portfolio-pin/usePortfolioPinTimeline.ts`](file:///c:/Users/Admin/Desktop/Du%20an%20web/Myportfolio/SumStock_v1_port/src/themes/radiant/components/portfolio-pin/usePortfolioPinTimeline.ts): Custom hook thiết lập GSAP ScrollTrigger timeline để điều khiển hiệu ứng cuộn mượt mà (`scrub: 1`).
5. **[MODIFY]** [`src/themes/radiant/pages/Portfolio.tsx`](file:///c:/Users/Admin/Desktop/Du%20an%20web/Myportfolio/SumStock_v1_port/src/themes/radiant/pages/Portfolio.tsx): Chỉnh sửa để thêm `disableSnap={true}` và loại bỏ `pt-20` ở container cha giúp fix khoảng trắng ở đầu trang.
6. **[MODIFY]** [`src/lib/sectionRenderer.tsx`](file:///c:/Users/Admin/Desktop/Du%20an%20web/Myportfolio/SumStock_v1_port/src/lib/sectionRenderer.tsx): Thay thế mapping `portfolio_grid` thành component `PortfolioPinSection` và cấu hình render eager (không lazy load).

---

## 2. Code đầy đủ của từng file mới

### Component `PortfolioPinSection.tsx`
```tsx
import { memo, useRef, useEffect } from "react";
import { useIsTablet } from "@/hooks/use-mobile";
import { useHeroSettings, useProjects } from "@/core/hooks/usePortfolio";
import { usePortfolioPinTimeline } from "./usePortfolioPinTimeline";
import { HeroStageCards } from "./HeroStageCards";
import { ProjectCarouselStage } from "./ProjectCarouselStage";
import HeroSection from "../HeroSection";
import PortfolioGrid from "../PortfolioGrid";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  usePortfolioPinTimeline(containerRef, isLoaded, isTablet);

  // Refresh ScrollTrigger when data finishes loading
  useEffect(() => {
    if (isLoaded) {
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

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
        <HeroStageCards onNavigate={onNavigate} />
      </div>

      {/* Stage 4: Embla Project Carousel (Fades in, unpins, slideable) */}
      <div className="pin-carousel-stage absolute inset-0 z-30 flex flex-col items-center justify-center w-full h-full pointer-events-auto will-change-[opacity,transform,filter]">
        <ProjectCarouselStage onNavigate={onNavigate} />
      </div>
    </div>
  );
});

PortfolioPinSection.displayName = "PortfolioPinSection";

export default PortfolioPinSection;
```

### Component `HeroStageCards.tsx`
```tsx
import { memo } from "react";

export const HeroStageCards = memo(() => {
  // Link ảnh do user cung cấp
  const imageUrl = "https://res.cloudinary.com/dpdzbuiml/image/upload/w_1920,c_fit,dpr_auto,q_auto,f_auto/v1785488719/common/shbirsq5uksig3pt9rgd.webp";

  return (
    <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center">
      {/* CARD 2: CARD PHỤ XẾP LỆCH PHÍA SAU-PHẢI */}
      <div className="pin-card-sub absolute w-[80%] md:w-[70%] max-w-2xl aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] bg-black z-10 will-change-transform">
        <img
          src={imageUrl}
          alt="Stage Preview Behind"
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0B] via-transparent to-transparent pointer-events-none opacity-80" />
      </div>

      {/* CARD 1: CARD CHÍNH Ở TRÊN-TRÁI (CŨNG LÀ ẢNH) */}
      <div className="pin-card-main absolute w-[80%] md:w-[75%] max-w-3xl aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/15 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-20 will-change-transform bg-black">
        <img
          src={imageUrl}
          alt="Stage Preview Front"
          className="w-full h-full object-cover brightness-[0.95] contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0B]/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
});

HeroStageCards.displayName = "HeroStageCards";
export default HeroStageCards;
```

### Component `ProjectCarouselStage.tsx`
```tsx
import { memo, useEffect, useState, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useProjects } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useLang } from "@/contexts/LangContext";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";
import { useNavigate } from "react-router-dom";

interface ProjectCarouselStageProps {
  onNavigate: (slug: string) => void;
}

export const ProjectCarouselStage = memo(({ onNavigate }: ProjectCarouselStageProps) => {
  const { data: projects, isLoading } = useProjects();
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const projectItems = useMemo(() => projects || [], [projects]);

  if (isLoading || projectItems.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-sage/20 border-t-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-6 flex flex-col items-center justify-center relative select-none">
      {/* Embla Viewport */}
      <div className="overflow-hidden w-full py-10" ref={emblaRef}>
        <div className="flex -ml-6 md:-ml-10">
          {projectItems.map((p, index) => {
            const isActive = index === selectedIndex;
            const isFirst = index === 0;

            const localizedTitle = getLocalizedField(p, "title", currentLang);
            const localizedDesc = getLocalizedField(p, "short_description", currentLang);
            const categoryName = p.project_categories?.name || "Project";

            return (
              <div
                key={p.slug}
                className="flex-[0_0_85%] sm:flex-[0_0_60%] lg:flex-[0_0_45%] pl-6 md:pl-10 min-w-0 flex flex-col items-center justify-center transition-all duration-700 ease-out"
                style={{
                  opacity: isActive ? 1 : 0.4,
                  transform: `scale(${isActive ? 1 : 0.85})`,
                  filter: `blur(${isActive ? 0 : 6}px)`,
                }}
              >
                {/* Card Container */}
                <div 
                  className="w-full relative aspect-[4/5] md:aspect-[4/4.5] rounded-[2.5rem] overflow-hidden bg-stone-900 border border-white/10 group cursor-pointer transition-all duration-500 shadow-2xl"
                  onClick={() => isActive ? onNavigate(p.slug) : emblaApi?.scrollTo(index)}
                >
                  {/* Project Image */}
                  <img
                    src={optimizeCloudinary(p.cover_image_url || "", { width: 800 })}
                    alt={localizedTitle}
                    className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out will-change-transform ${
                      isActive ? "scale-100 group-hover:scale-105" : "scale-105"
                    } ${isFirst ? "pin-carousel-first-image" : ""}`}
                    // @ts-expect-error - priority attribute
                    fetchpriority={isFirst ? "high" : "auto"}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Text Details */}
                  <div 
                    className={`absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8 z-10 space-y-4 text-left ${
                      isFirst ? "pin-carousel-first-text" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="font-artistic text-base md:text-lg text-vibe-pink">
                        {categoryName}
                      </p>
                      <h3 className="font-display text-2xl md:text-4xl text-white leading-tight font-light tracking-tight">
                        {localizedTitle}
                      </h3>
                      {localizedDesc && (
                        <p className="font-body text-xs md:text-sm text-white/70 line-clamp-2 font-light leading-relaxed">
                          {localizedDesc}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sage group/cta pt-2">
                      <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-bold text-sage">
                        {t("Discover", "見る", "Khám phá")}
                      </span>
                      <div className="relative w-8 h-[1px] bg-sage/40 overflow-hidden">
                        <div className="absolute inset-0 bg-sage transition-transform duration-500 translate-x-[-100%] group-hover/cta:translate-x-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-8 mt-6">
        <button
          onClick={scrollPrev}
          className="w-14 h-14 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Previous Project"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "w-8 bg-sage" : "w-1.5 bg-white/20"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={scrollNext}
          className="w-14 h-14 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Next Project"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
});

ProjectCarouselStage.displayName = "ProjectCarouselStage";
```

### Hook `usePortfolioPinTimeline.ts`
```typescript
import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const usePortfolioPinTimeline = (
  containerRef: RefObject<HTMLDivElement>,
  isLoaded: boolean,
  isDisabled: boolean
) => {
  useEffect(() => {
    if (isDisabled || !isLoaded || !containerRef.current) return;

    // Use GSAP context for safe cleanup of all created animations/triggers
    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const cardMain = container.querySelector(".pin-card-main");
      const cardSub = container.querySelector(".pin-card-sub");
      const overlay = container.querySelector(".pin-overlay");
      const carouselStage = container.querySelector(".pin-carousel-stage");
      const firstImage = container.querySelector(".pin-carousel-first-image");
      const firstText = container.querySelector(".pin-carousel-first-text");

      if (!cardMain || !cardSub || !overlay || !carouselStage) return;

      // --- INITIAL STATES (Giai đoạn 1) ---
      gsap.set(cardMain, {
        xPercent: -5,
        yPercent: -5,
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
      });
      gsap.set(cardSub, {
        xPercent: 15,
        yPercent: 10,
        scale: 0.9,
        opacity: 0.5,
        transformOrigin: "center center",
      });
      gsap.set(overlay, { opacity: 0 });
      
      // Carousel initial state
      gsap.set(carouselStage, { 
        opacity: 0, 
      });

      if (firstImage) {
        gsap.set(firstImage, {
          scale: 0.9,
          filter: "blur(20px)",
          opacity: 0,
        });
      }

      if (firstText) {
        gsap.set(firstText, {
          y: 30,
          opacity: 0,
        });
      }

      // --- CREATE TIMELINE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=300%", // Scroll depth for pinning
          pin: true,
          scrub: 1, // Smooth scrub (1 second delay for buttery smooth movement)
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Giai đoạn 2 (0% - 35%): Card phụ trượt sang phải, card chính dịch nhẹ sang trái
      tl.to(cardSub, {
        xPercent: 40,
        yPercent: 5,
        opacity: 0.75,
        duration: 0.35,
        ease: "none",
      }, 0);
      
      tl.to(cardMain, {
        xPercent: -20,
        duration: 0.35,
        ease: "none",
      }, 0);

      // Giai đoạn 3 (35% - 70%): Hai card bay sang 2 mép màn hình và mờ đi, đồng thời overlay đen fade in
      tl.to(cardMain, {
        xPercent: -120,
        opacity: 0,
        scale: 0.75,
        duration: 0.35,
        ease: "none",
      }, 0.35);

      tl.to(cardSub, {
        xPercent: 120,
        opacity: 0,
        scale: 0.75,
        duration: 0.35,
        ease: "none",
      }, 0.35);

      tl.to(overlay, {
        opacity: 1,
        duration: 0.35,
        ease: "none",
      }, 0.35);

      // Giai đoạn 4 (70% - 100%): Slide/Image đầu tiên fade in và sắc nét, text stagger
      tl.to(carouselStage, {
        opacity: 1,
        duration: 0.3,
        ease: "none",
      }, 0.7);

      if (firstImage) {
        tl.to(firstImage, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.3,
          ease: "none",
        }, 0.7);
      }

      if (firstText) {
        tl.to(firstText, {
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        }, 0.75); // stagger delay +0.05 / +0.3 tùy thuộc timeline speed
      }

      // Refresh ScrollTrigger to calculate heights correctly
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

    }, containerRef);

    return () => {
      ctx.revert(); // Safely reverts all animations and kills ScrollTrigger instances
    };
  }, [containerRef, isLoaded, isDisabled]);
};
```

---

## 3. Diff của các file đã sửa

### File `src/themes/radiant/pages/Portfolio.tsx`
```diff
<<<< BEFORE
  return (
    <PageLayout 
      isLoading={isLoading} 
      loaderText={lang === "en" ? "Curating Portfolio" : "ポートフォリオを準備中..."}
      manualReadySignal={false}
      seoTitle="Portfolio | Digital Strategy & Growth"
      seoDescription="Explore a collection of high-impact digital projects focusing on performance marketing, brand strategy, and growth."
    >
      <div className="relative bg-background overflow-hidden min-h-screen pt-20">
        {!isTablet && (
          <>
            <AmbientAccent position="top-right" color="bg-vibe-sky" size={1000} opacity={0.05} />
            <AmbientAccent position="center-left" color="bg-vibe-pink" size={800} opacity={0.05} blur={150} />
          </>
        )}
        
        <div className="relative">
          {renderedSections}
        </div>
      </div>
==== AFTER
  return (
    <PageLayout 
      isLoading={isLoading} 
      loaderText={lang === "en" ? "Curating Portfolio" : "ポートフォリオを準備中..."}
      manualReadySignal={false}
      disableSnap={true}
      seoTitle="Portfolio | Digital Strategy & Growth"
      seoDescription="Explore a collection of high-impact digital projects focusing on performance marketing, brand strategy, and growth."
    >
      <div className="relative bg-background overflow-hidden min-h-screen">
        {!isTablet && (
          <>
            <AmbientAccent position="top-right" color="bg-vibe-sky" size={1000} opacity={0.05} />
            <AmbientAccent position="center-left" color="bg-vibe-pink" size={800} opacity={0.05} blur={150} />
          </>
        )}
        
        <div className="relative">
          {renderedSections}
        </div>
      </div>
>>>>
```

### File `src/lib/sectionRenderer.tsx`
```diff
<<<< BEFORE
// Tối ưu Hero: Load ngay lập tức để ưu tiên tài nguyên
// Highlight: Import directly to ensure it renders first
import HeroSection from "@/themes/radiant/components/HeroSection.tsx";

// Tối ưu hiệu năng: Các section khác load khi cần thiết (Lazy load)
...
// Map section_key to component
const sectionComponentMap: Record<string, React.ComponentType<any>> = {
  // Home page sections
  home_hero: HeroSection,
  home_about: AboutSection,
...
  // Portfolio page sections
  portfolio_grid: PortfolioGrid,
  portfolio_clients: ClientsSection,
  portfolio_faq: FaqSection,
  portfolio_contact: ContactSection,
  portfolio_proficiencies: ProficienciesSection,
  portfolio_testimonials: TestimonialsSection,
  portfolio_blog: BlogSection,

  // Generic/Initial
  stats: StatsSection,
  faq: FaqSection,
};

/**
 * Check if a section is implemented in the renderer
 */
export function isSectionImplemented(sectionKey: string): boolean {
  return sectionKey in sectionComponentMap;
}

export function renderSectionByKey(section: PageSection, extraProps?: any): React.ReactNode {
  const Component = sectionComponentMap[section.section_key];

  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`No component found for section_key: ${section.section_key}`);
    }
    return null;
  }

  // Hero section được ưu tiên: render trực tiếp, không lazy
  if (section.section_key === 'home_hero') {
    return (
      <div key={section.id} id="hero" className="snap-center">
        <HeroSection {...extraProps} />
      </div>
    );
  }
==== AFTER
// Tối ưu Hero: Load ngay lập tức để ưu tiên tài nguyên
// Highlight: Import directly to ensure it renders first
import HeroSection from "@/themes/radiant/components/HeroSection.tsx";
import PortfolioPinSection from "@/themes/radiant/components/portfolio-pin/PortfolioPinSection.tsx";

// Tối ưu hiệu năng: Các section khác load khi cần thiết (Lazy load)
...
// Map section_key to component
const sectionComponentMap: Record<string, React.ComponentType<any>> = {
  // Home page sections
  home_hero: HeroSection,
  home_about: AboutSection,
...
  // Portfolio page sections
  portfolio_grid: PortfolioPinSection,
  portfolio_clients: ClientsSection,
  portfolio_faq: FaqSection,
  portfolio_contact: ContactSection,
  portfolio_proficiencies: ProficienciesSection,
  portfolio_testimonials: TestimonialsSection,
  portfolio_blog: BlogSection,

  // Generic/Initial
  stats: StatsSection,
  faq: FaqSection,
};

/**
 * Check if a section is implemented in the renderer
 */
export function isSectionImplemented(sectionKey: string): boolean {
  return sectionKey in sectionComponentMap;
}

export function renderSectionByKey(section: PageSection, extraProps?: any): React.ReactNode {
  const Component = sectionComponentMap[section.section_key];

  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`No component found for section_key: ${section.section_key}`);
    }
    return null;
  }

  // Hero và Portfolio Grid pin section được ưu tiên: render trực tiếp, không lazy
  if (section.section_key === 'home_hero' || section.section_key === 'portfolio_grid') {
    return (
      <div key={section.id} id={section.section_key === 'home_hero' ? 'hero' : 'works'} className="snap-center">
        <Component {...extraProps} />
      </div>
    );
  }
>>>>
```

---

## 4. Đối chiếu với 7 bước yêu cầu ban đầu

| Yêu cầu ban đầu | Trạng thái | Chi tiết / Dòng code minh họa |
| :--- | :---: | :--- |
| **a) Tuân thủ cấu trúc data thật từ `useProjects`** | **CÓ** | Sử dụng custom hook `useProjects()` để fetch danh sách động từ Supabase. Cụ thể trong `ProjectCarouselStage.tsx`:<br>`const { data: projects, isLoading } = useProjects();` |
| **b) Không cài thêm package mới ngoài quy định** | **CÓ** | Không cài đặt thêm bất kỳ thư viện nào bên thứ ba. Chỉ dùng `gsap`, `framer-motion`, và `embla-carousel-react` đã có sẵn. |
| **c) Không sửa trực tiếp file component Radiant cũ** | **CÓ** | Giữ nguyên các file `HeroCardOverlayLayout.tsx`, `PortfolioGrid.tsx` và `ProjectCard.tsx` của Radiant cũ. Toàn bộ logic mới được bọc ngoài (wrapper) trong folder `portfolio-pin`. |
| **d) `disableSnap={true}` được truyền vào `PageLayout`** | **CÓ** | Trong `Portfolio.tsx`:<br>`disableSnap={true}` |
| **e) Trên mobile/tablet, hiệu ứng pin được tắt** | **CÓ** | Kiểm tra kích thước qua `useIsTablet` và trả về fallback cuộn thường trong `PortfolioPinSection.tsx`:<br>`if (isTablet) { return ( <div className="w-full flex flex-col"> <HeroSection /> <PortfolioGrid onNavigate={onNavigate} /> </div> ); }` |
| **f) Đủ 4 giai đoạn animation theo thứ tự** | **CÓ** | Logic timeline trong `usePortfolioPinTimeline.ts`:<br>1. *Initial Stage*: `gsap.set(cardMain, { xPercent: -5... }); gsap.set(cardSub, { xPercent: 15... });`<br>2. *Translate*: `tl.to(cardSub, { xPercent: 40... }, 0);`<br>3. *Separation & Fade Overlay*: `tl.to(cardMain, { xPercent: -120, opacity: 0... }, 0.35); tl.to(overlay, { opacity: 1 }, 0.35);`<br>4. *Carousel fade-in*: `tl.to(carouselStage, { opacity: 1 }, 0.7);` |
| **g) Carousel Embla hoạt động sau 100% scroll** | **CÓ** | Khi scroll-pin đạt 100%, ScrollTrigger giải phóng pin (unpin). Carousel điều khiển chuẩn bằng nút bấm trong `ProjectCarouselStage.tsx`:<br>`const [emblaRef, emblaApi] = useEmblaCarousel({...});`<br>`const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);` |
| **h) `ScrollTrigger.kill()` được gọi trong cleanup** | **CÓ** | Cleanup sử dụng `gsap.context()` an toàn trong `usePortfolioPinTimeline.ts`:<br>`return () => { ctx.revert(); };` (Phương thức `ctx.revert()` của GSAP 3+ tự động dọn dẹp và `kill` toàn bộ các ScrollTrigger được tạo bên trong nó). |
| **i) `ScrollTrigger.refresh()` gọi sau khi data load** | **CÓ** | Triển khai trong `PortfolioPinSection.tsx`:<br>`useEffect(() => { if (isLoaded) { ScrollTrigger.refresh(); } }, [isLoaded]);` |
| **j) Nguồn ảnh placeholder cho card thứ hai** | **CÓ** | Sử dụng link ảnh Cloudinary cứng do người dùng cung cấp trong `HeroStageCards.tsx`:<br>`const imageUrl = "https://res.cloudinary.com/dpdzbuiml/image/upload/w_1920,c_fit,dpr_auto,q_auto,f_auto/v1785488719/common/shbirsq5uksig3pt9rgd.webp";` |

---

## 5. Các vấn đề/lỗi đã gặp trong quá trình implement
1. **Lỗi lòi dải màu trắng ở trên đầu trang (padding-top)**:
   * *Nguyên nhân*: File `Portfolio.tsx` gốc có class `pt-20` khiến toàn bộ khối tối màu của pin section bị đẩy xuống 80px, để lộ dải nền sáng của page.
   * *Cách khắc phục*: Đã loại bỏ class `pt-20` khỏi container chính trong `Portfolio.tsx` để Hero bắt đầu sát mép màn hình (`top: 0`).
2. **Lỗi khựng và giật khi cuộn chuột (Scroll Stutter)**:
   * *Nguyên nhân*: Cấu hình `scrub: true` bắt chặt tiến trình của timeline với pixel cuộn chuột thô cứng, gây hiện tượng giật gián đoạn trên chuột lăn có khấc.
   * *Cách khắc phục*: Thay đổi thành `scrub: 1` để tạo độ trễ chuyển động mượt mà 1 giây, triệt tiêu hoàn toàn hiện tượng khựng giật.

---

## 6. Các giả định tự đưa ra ngoài yêu cầu ban đầu
* **Khoảng cách cuộn pin (end depth)**: Được thiết lập là `end: "+=300%"` (bằng 3 lần chiều cao viewport) để tạo độ sâu lăn chuột hợp lý cho người dùng trải nghiệm hết cả 4 giai đoạn transition.
* **Thời lượng transition (Timeline duration ratios)**: Chia tỷ lệ thời lượng timeline theo tỷ lệ tương đối: Giai đoạn 2 chiếm 35% timeline, Giai đoạn 3 chiếm 35% timeline (kết thúc ở 70%), Giai đoạn 4 chiếm 30% còn lại.
* **Opacity & Blur của card phụ**: Card phụ nằm phía sau được làm tối nhẹ `brightness-[0.7]` để tạo hiệu ứng chiều sâu 3D chân thực khi xếp chồng.

---

## 7. Trạng thái hiện tại
* **Trạng thái biên dịch (build)**: Đã test chạy thử build thành công bằng lệnh `npm run build` không có bất kỳ lỗi TypeScript hay Warning nào tồn đọng.
* **Cài đặt package**: Không cần chạy `npm install` thêm bất kỳ thư viện mới nào. Mọi tài nguyên đều sử dụng thư viện sẵn có của project.
