"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionPreview } from "./SectionPreview";
import type { PageSection, PageType } from "@/core/types/sections";

interface PagePreviewProps {
  homeSections: PageSection[];
  portfolioSections: PageSection[];
  isOpen: boolean;
  onClose: () => void;
}

export function PagePreview({
  homeSections,
  portfolioSections,
  isOpen,
  onClose,
}: PagePreviewProps) {
  const [activeTab, setActiveTab] = useState<PageType>("home");

  const currentSections =
    activeTab === "home" ? homeSections : portfolioSections;

  // Filter visible sections and sort by order_index
  const visibleSections = currentSections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal - Center on desktop, full screen on mobile */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
        <div className="bg-white rounded-lg shadow-2xl w-full h-full md:w-1/2 md:h-5/6 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold">Page Preview</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 flex-shrink-0">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as PageType)}
            >
              <TabsList className="bg-transparent border-b-0">
                <TabsTrigger value="home">Home Page</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio Page</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {visibleSections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No visible sections to preview</p>
              </div>
            ) : (
              visibleSections.map((section) => (
                <div key={section.id}>
                  <SectionPreview
                    sectionKey={section.section_key}
                    name={section.section_name}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
