import React, { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import type { PageSection } from "@/core/types/sections";

// Tối ưu Hero: Load ngay lập tức để ưu tiên tài nguyên
// Highlight: Import directly to ensure it renders first
import HeroSection from "@/themes/radiant/components/HeroSection.tsx";

// Tối ưu hiệu năng: Các section khác load khi cần thiết (Lazy load)
// Performance: Lazy-load other components only when visible or near viewport
const AboutSection = lazy(() => import("@/themes/radiant/components/AboutSection.tsx"));
const SkillsSection = lazy(() => import("@/themes/radiant/components/SkillsSection.tsx"));
const ClientsSection = lazy(() => import("@/themes/radiant/components/ClientsSection.tsx"));
const TimelineSection = lazy(() => import("@/themes/radiant/components/TimelineSection.tsx"));
const PortfolioGrid = lazy(() => import("@/themes/radiant/components/PortfolioGrid.tsx"));
const TestimonialsSection = lazy(() => import("@/themes/radiant/components/TestimonialsSection.tsx"));
const ProficienciesSection = lazy(() => import("@/themes/radiant/components/ProficienciesSection.tsx"));
const ContactSection = lazy(() => import("@/themes/radiant/components/ContactSection.tsx"));
const StatsSection = lazy(() => import("@/themes/radiant/components/StatsSection.tsx"));
const FaqSection = lazy(() => import("@/themes/radiant/components/FaqSection.tsx"));
const BlogSection = lazy(() => import("@/themes/radiant/components/BlogSection.tsx"));

// Skeleton placeholder trong khi chờ component được tải
const SectionSkeleton = () => (
  <div className="w-full py-32 md:py-48 min-h-[60vh] bg-transparent overflow-hidden">
    <div className="container mx-auto px-6 max-w-6xl space-y-12">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="h-2 bg-heading/5 rounded-full w-24 animate-pulse" />
        <div className="space-y-4 w-full flex flex-col items-center">
          <div className="h-12 md:h-20 bg-heading/5 rounded-2xl w-3/4 animate-pulse" />
          <div className="h-4 bg-heading/5 rounded-full w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
        {[1, 2, 3].map(i => (
          <div key={i} className="aspect-[4/5] bg-heading/5 rounded-[3rem] animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// Wrapper component để hoãn render cho tới khi gần viewport (Lazy Rendering)
const LazySection = ({ children, sectionKey }: { children: React.ReactNode, sectionKey: string }) => {
  const { hash } = useLocation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '600px 0px', // Load trước khi cuộn tới 600px
  });

  // Map section keys to their HTML element IDs for hash-navigation detection
  const sectionKeyToIdMap: Record<string, string> = {
    'home_hero': 'hero',
    'portfolio_grid': 'works',
    'portfolio_faq': 'faq',
    'portfolio_testimonials': 'kind-words',
    'portfolio_contact': 'contact',
    'portfolio_proficiencies': 'proficiencies',
    'home_about': 'about',
    'home_metrics': 'stats',
    'home_stats': 'stats',
    'home_clients': 'clients',
    'home_services': 'skills',
    'home_skills': 'proficiencies',
    'home_expertise': 'proficiencies',
    'home_testimonials': 'kind-words',
    'home_timeline': 'timeline',
    'home_contact': 'contact',
    'home_faq': 'faq',
    'home_blog': 'blog',
    'stats': 'stats',
    'faq': 'faq',
    'blog': 'blog'
  };

  const targetId = sectionKeyToIdMap[sectionKey];
  const isHashTarget = targetId && hash === `#${targetId}`;
  const isTimeline = sectionKey === 'home_timeline';

  // If this section is the target of the current URL hash, render it immediately
  // bypassing the IntersectionObserver for reliability
  return (
    <div ref={ref} id={targetId} className={`min-h-[100px] scroll-mt-0 ${isTimeline ? 'snap-start' : 'snap-center'}`}>
      {(inView || isHashTarget) ? (
        <Suspense fallback={<SectionSkeleton />}>
          {children}
        </Suspense>
      ) : (
        <div className="h-[200px]" /> // Placeholder nhẹ khi chưa cuộn tới
      )}
    </div>
  );
};

// Map section_key to component
const sectionComponentMap: Record<string, React.ComponentType<any>> = {
  // Home page sections
  home_hero: HeroSection, // Trả về component gốc để ko bị Suspense lồng nhau nếu ko cần
  home_about: AboutSection,
  home_metrics: StatsSection,
  home_skills: SkillsSection,
  home_expertise: SkillsSection,
  home_testimonials: TestimonialsSection,
  home_timeline: TimelineSection,
  home_contact: ContactSection,
  home_stats: StatsSection,
  home_faq: FaqSection,
  home_blog: BlogSection,

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

  // Các section khác sẽ được Lazy Render + Suspense
  return (
    <LazySection key={section.id} sectionKey={section.section_key}>
      <Component {...extraProps} />
    </LazySection>
  );
}

export function renderSectionsByOrder(
  sections: PageSection[],
  extraProps?: any
): React.ReactNode[] {
  return sections.map((section) => renderSectionByKey(section, extraProps) as React.ReactElement);
}
