"use client";

import React, { Suspense } from "react";
import HeroSection from "@/themes/radiant/components/HeroSection";
import AboutSection from "@/themes/radiant/components/AboutSection";
import SkillsSection from "@/themes/radiant/components/SkillsSection";
import ClientsSection from "@/themes/radiant/components/ClientsSection";
import TimelineSection from "@/themes/radiant/components/TimelineSection";
import PortfolioGrid from "@/themes/radiant/components/PortfolioGrid";
import TestimonialsSection from "@/themes/radiant/components/TestimonialsSection";
import ProficienciesSection from "@/themes/radiant/components/ProficienciesSection";
import ContactSection from "@/themes/radiant/components/ContactSection";
import FaqSection from "@/themes/radiant/components/FaqSection";
import StatsSection from "@/themes/radiant/components/StatsSection";

interface SectionPreviewProps {
  sectionKey: string;
  name: string;
}

// Map section_key to component
const sectionComponentMap: Record<string, React.ComponentType<any>> = {
  home_hero: HeroSection,
  home_about: AboutSection,
  home_metrics: StatsSection,
  home_services: SkillsSection,
  home_skills: ProficienciesSection,
  home_expertise: ProficienciesSection,
  home_testimonials: TestimonialsSection,
  home_timeline: TimelineSection,
  home_faq: FaqSection,
  home_contact: ContactSection,
  home_stats: StatsSection,
  portfolio_grid: PortfolioGrid,
  portfolio_clients: ClientsSection,
  faq: FaqSection,
  portfolio_faq: FaqSection,
  stats: StatsSection,
};

const PreviewSkeleton = () => (
  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
);

export function SectionPreview({ sectionKey, name }: SectionPreviewProps) {
  const Component = sectionComponentMap[sectionKey];

  if (!Component) {
    return (
      <div className="h-20 bg-slate-50 flex items-center justify-center">
        <p className="text-xs text-slate-400 italic">{name} — no preview</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white w-full" style={{ height: "160px" }}>
      <Suspense fallback={<PreviewSkeleton />}>
        <div
          style={{
            transform: "scale(0.45)",
            transformOrigin: "top left",
            width: "222.22%",
            height: "355px",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <Component />
        </div>
      </Suspense>
    </div>
  );
}
