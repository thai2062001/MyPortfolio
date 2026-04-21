"use client";

import {
  GripVertical,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageSection, PageType } from "@/core/types/sections";

interface SectionCardProps {
  section: PageSection;
  isDragging?: boolean;
  isFixed?: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
  onMove: (toPage: PageType) => void;
  otherPageType: PageType;
  dragListeners?: any;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function SectionCard({
  section,
  isDragging,
  isFixed,
  onToggleVisibility,
  onMove,
  otherPageType,
  dragListeners,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SectionCardProps) {
  return (
    <div
      className={`
        flex items-center gap-2 md:gap-3 p-2 md:p-4 bg-white border rounded-lg
        transition-all duration-200
        ${isDragging ? "opacity-50 shadow-lg scale-105" : "hover:shadow-md"}
        ${isFixed ? "bg-blue-50 border-blue-200 opacity-75" : "border-gray-200"}
        ${section.has_data === false ? "opacity-60 grayscale-[0.5]" : ""}
        ${!section.is_visible ? "bg-gray-50 border-dashed" : ""}
      `}
    >
      {/* Drag Handle - Hidden if fixed */}
      {!isFixed && (
        <GripVertical
          className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 hidden md:block"
          {...dragListeners}
        />
      )}

      {/* Placeholder for fixed sections */}
      {isFixed && <div className="w-5 h-5 flex-shrink-0 hidden md:block" />}

      {/* Section Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
            {section.section_name}
          </h3>
          {isFixed && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded whitespace-nowrap">
              Fixed
            </span>
          )}
          {section.has_data === false && (
            <span className="inline-block px-2 py-1 text-xs bg-amber-50 text-amber-600 border border-amber-100 rounded whitespace-nowrap font-medium">
              Empty
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-gray-500 truncate">
          {section.section_key}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        {/* Mobile Up/Down Buttons */}
        {!isFixed && (
          <div className="flex gap-1 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              disabled={!canMoveUp}
              title="Move up"
              className="h-7 w-7 md:h-8 md:w-8 p-0"
            >
              <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              disabled={!canMoveDown}
              title="Move down"
              className="h-7 w-7 md:h-8 md:w-8 p-0"
            >
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        )}

        {/* Visibility Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(!section.is_visible);
          }}
          title={section.is_visible ? "Hide section" : "Show section"}
          className="h-7 w-7 md:h-8 md:w-8 p-0"
        >
          {section.is_visible ? (
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
          ) : (
            <EyeOff className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          )}
        </Button>

        {/* Move Button */}
        {!isFixed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMove(otherPageType);
            }}
            title={`Move to ${otherPageType}`}
            className="h-7 w-7 md:h-8 md:w-8 p-0"
          >
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
