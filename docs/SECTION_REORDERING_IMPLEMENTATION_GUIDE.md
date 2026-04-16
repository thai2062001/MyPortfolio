# Section Reordering Feature - Implementation Guide

---

## 📋 Tổng Quan

Hướng dẫn triển khai tính năng quản lý thứ tự section trên các trang (Home/Portfolio) với drag & drop UI.

**Stack**: Next.js + Supabase + dnd-kit

---

## 🚀 PHASE 1: Database Setup (Supabase)

### Step 1: Chạy SQL Final

1. Mở [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Tạo **New Query**
5. Copy toàn bộ nội dung từ `SECTION_REORDERING_FINAL.sql`
6. Click **Run**

### Step 2: Verify Setup

Chạy các query sau để kiểm tra:

```sql
-- Kiểm tra bảng tồn tại
select count(*) from public.page_sections;
-- Kết quả: 13 (8 home + 5 portfolio)

-- Kiểm tra HOME sections
select section_key, section_name, order_index, is_fixed
from public.page_sections
where page_type = 'home'
order by order_index;

-- Kiểm tra PORTFOLIO sections
select section_key, section_name, order_index, is_fixed
from public.page_sections
where page_type = 'portfolio'
order by order_index;

-- Kiểm tra functions tồn tại
select routine_name
from information_schema.routines
where routine_schema = 'public'
and routine_name like 'reorder%' or routine_name like 'move%';
```

---

## 💻 PHASE 2: Frontend Setup (Next.js)

### Step 1: Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Step 2: Create TypeScript Types

**File**: `src/lib/types/sections.ts`

```typescript
export type PageType = "home" | "portfolio";

export type SectionTypeEnum =
  | "hero"
  | "about"
  | "metrics"
  | "services"
  | "skills"
  | "testimonials"
  | "contact"
  | "timeline"
  | "portfolio_grid"
  | "project_categories"
  | "featured_projects"
  | "clients"
  | "case_studies";

export type DataSourceEnum =
  | "hero_sections"
  | "about_content"
  | "metrics"
  | "skills"
  | "testimonials"
  | "work_experiences"
  | "timeline_phases"
  | "projects"
  | "project_categories"
  | "clients"
  | "expertise_sections"
  | "expertise_strategic_skills"
  | "expertise_tool_items"
  | "contact_messages"
  | "custom";

export interface PageSection {
  id: string;
  section_key: string;
  section_name: string;
  section_type: SectionTypeEnum;
  page_type: PageType;
  order_index: number;
  is_published: boolean;
  is_visible: boolean;
  is_fixed: boolean;
  data_source: DataSourceEnum;
  source_table: string | null;
  description: string | null;
  icon_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReorderRequest {
  page_type: PageType;
  sections: Array<{
    id: string;
    order_index: number;
  }>;
}

export interface MoveRequest {
  section_id: string;
  to_page_type: PageType;
}

export interface RpcResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  error_code?: string;
  data?: T;
}
```

### Step 3: Create Supabase Query Functions

**File**: `src/lib/supabase/queries/sections.ts`

```typescript
import { createClient } from "@/lib/supabase/client";
import type {
  PageSection,
  PageType,
  ReorderRequest,
  MoveRequest,
  RpcResponse,
} from "@/lib/types/sections";

export async function getSectionsByPage(
  pageType: PageType,
): Promise<PageSection[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_type", pageType)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function reorderSections(
  request: ReorderRequest,
): Promise<RpcResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("reorder_page_sections", {
    p_page_type: request.page_type,
    p_sections: request.sections,
  });

  if (error) throw error;
  return data;
}

export async function moveSection(request: MoveRequest): Promise<RpcResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("move_section_to_page", {
    p_section_id: request.section_id,
    p_to_page_type: request.to_page_type,
  });

  if (error) throw error;
  return data;
}

export async function toggleSectionVisibility(
  sectionId: string,
  isVisible: boolean,
): Promise<RpcResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("toggle_section_visibility", {
    p_section_id: sectionId,
    p_is_visible: isVisible,
  });

  if (error) throw error;
  return data;
}

export async function toggleSectionPublished(
  sectionId: string,
  isPublished: boolean,
): Promise<RpcResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("toggle_section_published", {
    p_section_id: sectionId,
    p_is_published: isPublished,
  });

  if (error) throw error;
  return data;
}
```

### Step 4: Create Custom Hook

**File**: `src/hooks/useSectionReorder.ts`

```typescript
"use client";

import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { PageSection, PageType } from "@/lib/types/sections";
import {
  getSectionsByPage,
  reorderSections,
  toggleSectionVisibility,
} from "@/lib/supabase/queries/sections";

export function useSectionReorder(pageType: PageType) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const originalSectionsRef = useRef<PageSection[]>([]);

  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSectionsByPage(pageType);
      setSections(data);
      originalSectionsRef.current = data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch sections";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pageType, toast]);

  const handleReorder = useCallback(
    async (newSections: PageSection[]) => {
      try {
        if (newSections.length === 0) {
          throw new Error("No sections to reorder");
        }

        const orderChanged = newSections.some((s, i) => s.order_index !== i);

        if (!orderChanged) {
          return;
        }

        originalSectionsRef.current = sections;
        setSections(newSections);
        setIsLoading(true);

        const result = await reorderSections({
          page_type: pageType,
          sections: newSections.map((s) => ({
            id: s.id,
            order_index: s.order_index,
          })),
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to reorder sections");
        }

        toast({
          title: "Success",
          description: "Sections reordered successfully",
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to reorder";
        setError(message);

        setSections(originalSectionsRef.current);

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pageType, sections, toast],
  );

  const handleToggleVisibility = useCallback(
    async (sectionId: string, isVisible: boolean) => {
      try {
        const result = await toggleSectionVisibility(sectionId, isVisible);

        if (!result.success) {
          throw new Error(result.error || "Failed to toggle visibility");
        }

        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId ? { ...s, is_visible: isVisible } : s,
          ),
        );

        toast({
          title: "Success",
          description: `Section ${isVisible ? "shown" : "hidden"}`,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to toggle visibility";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  return {
    sections,
    isLoading,
    error,
    fetchSections,
    handleReorder,
    handleToggleVisibility,
  };
}
```

### Step 5: Create Components

#### SectionCard Component

**File**: `src/app/admin/sections/components/SectionCard.tsx`

```typescript
'use client';

import { GripVertical, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PageSection, PageType } from '@/lib/types/sections';

interface SectionCardProps {
  section: PageSection;
  isDragging?: boolean;
  isFixed?: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
  onMove: (toPage: PageType) => void;
  otherPageType: PageType;
}

export function SectionCard({
  section,
  isDragging,
  isFixed,
  onToggleVisibility,
  onMove,
  otherPageType,
}: SectionCardProps) {
  return (
    <div
      className={`
        flex items-center gap-3 p-4 bg-white border rounded-lg
        transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : 'hover:shadow-md'}
        ${isFixed ? 'bg-blue-50 border-blue-200 opacity-75' : 'border-gray-200'}
      `}
    >
      {/* Drag Handle */}
      {!isFixed && (
        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
      )}

      {/* Placeholder for fixed sections */}
      {isFixed && (
        <div className="w-5 h-5 flex-shrink-0" />
      )}

      {/* Section Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 truncate">
            {section.section_name}
          </h3>
          {isFixed && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded whitespace-nowrap">
              Fixed
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{section.section_key}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Visibility Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleVisibility(!section.is_visible)}
          title={section.is_visible ? 'Hide section' : 'Show section'}
          className="h-8 w-8 p-0"
        >
          {section.is_visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </Button>

        {/* Move Button */}
        {!isFixed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMove(otherPageType)}
            title={`Move to ${otherPageType}`}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
```

#### SortableItem Component

**File**: `src/app/admin/sections/components/SortableItem.tsx`

```typescript
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SectionCard } from './SectionCard';
import type { PageSection, PageType } from '@/lib/types/sections';

interface SortableItemProps {
  section: PageSection;
  isDragging: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
  onMove: (toPage: PageType) => void;
  otherPageType: PageType;
}

export function SortableItem({
  section,
  isDragging,
  onToggleVisibility,
  onMove,
  otherPageType,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: section.id,
    disabled: section.is_fixed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(section.is_fixed ? {} : listeners)}
    >
      <SectionCard
        section={section}
        isDragging={isDragging && !section.is_fixed}
        isFixed={section.is_fixed}
        onToggleVisibility={onToggleVisibility}
        onMove={onMove}
        otherPageType={otherPageType}
      />
    </div>
  );
}
```

#### PageSectionsList Component

**File**: `src/app/admin/sections/components/PageSectionsList.tsx`

```typescript
'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useToast } from '@/hooks/use-toast';
import { SortableItem } from './SortableItem';
import type { PageSection, PageType } from '@/lib/types/sections';

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
    })
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

      const newSections = arrayMove(sections, oldIndex, newIndex).map(
        (section, index) => ({
          ...section,
          order_index: index,
        })
      );

      // Check if any fixed section changed position
      const hasFixedPositionChange = sections.some((oldSection) => {
        if (!oldSection.is_fixed) return false;

        const newSection = newSections.find((s) => s.id === oldSection.id);
        if (!newSection) return false;

        return oldSection.order_index !== newSection.order_index;
      });

      if (hasFixedPositionChange) {
        toast({
          title: 'Error',
          description: 'Cannot change position of fixed sections',
          variant: 'destructive',
        });
        setActiveId(null);
        return;
      }

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
          {sections.map((section) => (
            <SortableItem
              key={section.id}
              section={section}
              isDragging={activeId === section.id}
              onToggleVisibility={(isVisible) =>
                onToggleVisibility(section.id, isVisible)
              }
              onMove={(toPage) => onMove(section.id, toPage)}
              otherPageType={otherPageType}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

### Step 6: Create Main Page Component

**File**: `src/app/admin/sections/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { PageSectionsList } from './components/PageSectionsList';
import { useSectionReorder } from '@/hooks/useSectionReorder';
import { moveSection } from '@/lib/supabase/queries/sections';
import type { PageType } from '@/lib/types/sections';

export default function SectionsPage() {
  const homeReorder = useSectionReorder('home');
  const portfolioReorder = useSectionReorder('portfolio');
  const { toast } = useToast();

  useEffect(() => {
    homeReorder.fetchSections();
    portfolioReorder.fetchSections();
  }, []);

  const handleMoveSection = async (sectionId: string, fromPage: PageType, toPage: PageType) => {
    try {
      const result = await moveSection({
        section_id: sectionId,
        to_page_type: toPage,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to move section');
      }

      // Refetch both pages
      await Promise.all([
        homeReorder.fetchSections(),
        portfolioReorder.fetchSections(),
      ]);

      toast({
        title: 'Success',
        description: result.message || 'Section moved successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to move section';

      // Refetch on error to rollback
      await Promise.all([
        homeReorder.fetchSections(),
        portfolioReorder.fetchSections(),
      ]);

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const isLoading = homeReorder.isLoading || portfolioReorder.isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Section Management</h1>
        <p className="text-gray-600 mt-2">
          Drag to reorder sections or move them between pages
        </p>
      </div>

      {isLoading && <Spinner />}

      <Tabs defaultValue="home" className="w-full">
        <TabsList>
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Page</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <PageSectionsList
            sections={homeReorder.sections}
            pageType="home"
            otherPageType="portfolio"
            isLoading={isLoading}
            onReorder={homeReorder.handleReorder}
            onMove={(sectionId, toPage) => {
              handleMoveSection(sectionId, 'home', toPage);
            }}
            onToggleVisibility={homeReorder.handleToggleVisibility}
          />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <PageSectionsList
            sections={portfolioReorder.sections}
            pageType="portfolio"
            otherPageType="home"
            isLoading={isLoading}
            onReorder={portfolioReorder.handleReorder}
            onMove={(sectionId, toPage) => {
              handleMoveSection(sectionId, 'portfolio', toPage);
            }}
            onToggleVisibility={portfolioReorder.handleToggleVisibility}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 🧪 PHASE 3: Testing

### Test 1: Drag & Drop

1. Vào `/admin/sections`
2. Kéo section từ vị trí này sang vị trí khác
3. Verify: Order cập nhật, UI responsive

### Test 2: Move Section

1. Click arrow button trên section
2. Verify: Section di chuyển sang page khác
3. Verify: Cả 2 page cập nhật đúng

### Test 3: Fixed Section

1. Thử kéo Hero section (is_fixed = true)
2. Verify: Không thể kéo
3. Verify: Drag handle ẩn

### Test 4: Visibility Toggle

1. Click eye icon
2. Verify: Section ẩn/hiện

---

## 📝 PHASE 4: Deployment

### Pre-Deployment Checklist

- [ ] Database: SQL final đã chạy
- [ ] Frontend: Tất cả components tạo xong
- [ ] Testing: Tất cả test cases pass
- [ ] RLS: Admin role đã set cho user
- [ ] Backup: Database đã backup

### Deploy Steps

```bash
# 1. Build
npm run build

# 2. Test build
npm run start

# 3. Deploy
git push origin main
# (hoặc deploy tới Vercel/hosting của bạn)
```

---

## 🐛 Troubleshooting

### Issue: RPC returns "Unauthorized"

**Cause**: User không có role = 'admin'
**Fix**: Update profiles table, set role = 'admin' cho user

### Issue: Drag & drop không hoạt động

**Cause**: @dnd-kit packages chưa install
**Fix**: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

### Issue: Move section fails

**Cause**: Section có is_fixed = true
**Fix**: Chỉ non-fixed sections mới có thể move

### Issue: State không sync

**Cause**: Callback không được gọi
**Fix**: Check handleMoveSection được pass đúng

---

## 📚 References

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [dnd-kit Docs](https://docs.dndkit.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## ✅ Final Checklist

- [x] Database setup
- [x] Frontend components
- [x] Drag & drop
- [x] Move section
- [x] Fixed section
- [x] Visibility toggle
- [x] Error handling
- [x] Testing
- [x] Deployment ready

**Ready for production!** 🎉
