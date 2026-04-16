"use client";

import React, { useRef, useEffect, useState } from "react";
import { renderSectionsByOrder } from "@/lib/sectionRenderer";
import type { PageSection } from "@/core/types/sections";
import Navbar from "@/themes/radiant/components/Navbar.tsx";
import { Footer } from "@/themes/radiant/components/Footer.tsx";

interface WholePagePreviewProps {
  sections: PageSection[];
  scale?: number;
  autoScale?: boolean;
}

export function WholePagePreview({ sections, scale, autoScale = true }: WholePagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scaledHeight, setScaledHeight] = useState<number | string>("auto");
  const [calculatedScale, setCalculatedScale] = useState(scale || 1);

  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;

    const updateDimensions = () => {
      if (!contentRef.current || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const contentHeight = contentRef.current.offsetHeight;
      
      let finalScale = scale;
      
      // If autoScale is on and no explicit scale is provided (or we want to fit desktop)
      if (autoScale && (!scale || scale < 1)) {
        const targetDesktopWidth = 1280; // Standard desktop width
        // Calculate the scale needed to fit 1280px into the current containerWidth
        finalScale = containerWidth / targetDesktopWidth;
      } else {
        finalScale = scale || 1;
      }

      setCalculatedScale(finalScale);
      setScaledHeight(contentHeight * (finalScale || 1));
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    resizeObserver.observe(contentRef.current);
    
    // Initial update
    const timer = setTimeout(updateDimensions, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [sections, scale, autoScale]);

  if (sections.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-400 text-sm font-serif italic">No sections to preview</p>
      </div>
    );
  }

  // If scale is exactly 1, we assume it's mobile view and don't force width
  const isMobileView = scale === 1;
  const innerWidth = isMobileView ? "100%" : "1280px";

  return (
    <div 
      ref={containerRef}
      className="w-full bg-white relative overflow-hidden transition-all duration-300" 
      style={{ height: scaledHeight }}
    >
      <div 
        ref={contentRef}
        className="origin-top-left absolute top-0 left-0"
        style={{ 
          transform: `scale(${calculatedScale})`, 
          width: innerWidth,
          pointerEvents: "none", 
        }}
      >
        <div className="relative">
          <Navbar />
          <main className="min-h-screen">
            {renderSectionsByOrder(sections)}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
