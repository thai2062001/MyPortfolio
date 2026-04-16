"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";
import { SortableItem } from "./SortableItem";
import type { PageSection, PageType } from "@/core/types/sections";

interface PageSectionsListProps {
  sections: PageSection[];
  pageType: PageType;
  otherPageType: PageType;
  isLoading: boolean;
  onReorder: (sections: PageSection[]) => void;
  onMove: (sectionId: string, toPage: PageType) => void;
  onToggleVisibility: (sectionId: string, isVisible: boolean) => void;
}

export function PageSectionsList({
  sections,
  pageType,
  otherPageType,
  isLoading,
  onReorder,
  onMove,
  onToggleVisibility,
}: PageSectionsListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (isLoading) {
      setActiveId(null);
      return;
    }

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      // Check if dragged section is fixed
      const draggedSection = sections[oldIndex];
      if (draggedSection.is_fixed) {
        toast({
          title: "Error",
          description: "Cannot move fixed sections",
          variant: "destructive",
        });
        setActiveId(null);
        return;
      }

      const newSections = arrayMove(sections, oldIndex, newIndex).map(
        (section, index) => ({
          ...section,
          order_index: index,
        }),
      );

      onReorder(newSections);
    }

    setActiveId(null);
  };

  if (sections.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
        No sections on this page
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={section.is_visible ? "" : "opacity-50"}
            >
              <SortableItem
                section={section}
                isDragging={activeId === section.id}
                onToggleVisibility={(isVisible) =>
                  onToggleVisibility(section.id, isVisible)
                }
                onMove={(toPage) => onMove(section.id, toPage)}
                otherPageType={otherPageType}
                onMoveUp={() => {
                  if (index > 0) {
                    const newSections = [...sections];
                    [newSections[index], newSections[index - 1]] = [
                      newSections[index - 1],
                      newSections[index],
                    ];
                    const reordered = newSections.map((s, i) => ({
                      ...s,
                      order_index: i,
                    }));
                    onReorder(reordered);
                  }
                }}
                onMoveDown={() => {
                  if (index < sections.length - 1) {
                    const newSections = [...sections];
                    [newSections[index], newSections[index + 1]] = [
                      newSections[index + 1],
                      newSections[index],
                    ];
                    const reordered = newSections.map((s, i) => ({
                      ...s,
                      order_index: i,
                    }));
                    onReorder(reordered);
                  }
                }}
                canMoveUp={index > 0}
                canMoveDown={index < sections.length - 1}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
