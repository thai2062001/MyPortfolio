"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionCard } from "./SectionCard";
import type { PageSection, PageType } from "@/core/types/sections";

interface SortableItemProps {
  section: PageSection;
  isDragging: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
  onMove: (toPage: PageType) => void;
  otherPageType: PageType;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function SortableItem({
  section,
  isDragging,
  onToggleVisibility,
  onMove,
  otherPageType,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SortableItemProps) {
  const isFixedSection = section.section_key === "home_hero" || section.section_key === "portfolio_grid";
  
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: section.id,
      disabled: isFixedSection || section.is_fixed,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <SectionCard
        section={section}
        isDragging={isDragging && !isFixedSection}
        isFixed={isFixedSection || section.is_fixed}
        onToggleVisibility={onToggleVisibility}
        onMove={onMove}
        otherPageType={otherPageType}
        dragListeners={section.is_fixed ? {} : listeners}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
    </div>
  );
}
