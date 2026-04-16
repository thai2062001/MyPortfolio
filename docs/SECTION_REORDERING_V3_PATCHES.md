# Section Reordering V3 - Final Polish (Patches Only)

---

## 🔧 PATCH 1: Fix is_fixed Logic (RPC reorder)

### Vấn Đề

- RPC hiện tại cấm reorder nếu có fixed section
- Nhưng rule final là: fixed section vẫn tồn tại, chỉ không được đổi vị trí

### Sửa: reorder_page_sections() function

**Thay thế phần validation này:**

```sql
-- ❌ OLD (Line ~95-100)
-- 10. Check if any section is fixed (cannot reorder)
select bool_or(is_fixed) into v_has_fixed
from public.page_sections
where page_type = p_page_type
  and id in (select (x->>'id')::uuid from jsonb_array_elements(p_sections) x);

if v_has_fixed then
  raise exception 'Invalid: cannot reorder page with fixed sections';
end if;
```

**Bằng:**

```sql
-- ✅ NEW: Check if fixed sections changed position
if exists (
  select 1
  from public.page_sections ps
  where ps.page_type = p_page_type
    and ps.is_fixed = true
    and ps.order_index != (
      select (x->>'order_index')::integer
      from jsonb_array_elements(p_sections) x
      where (x->>'id')::uuid = ps.id
    )
) then
  raise exception 'Invalid: cannot change position of fixed sections';
end if;
```

**Giải thích:**

- Chỉ reject nếu fixed section **đổi vị trí**
- Nếu fixed section giữ nguyên vị trí → OK
- Non-fixed sections có thể reorder tự do

---

## 🔧 PATCH 2: Fix move_section_to_page() - 2-Phase Reindex

### Vấn Đề

- Reindex page cũ dùng UPDATE trực tiếp
- Có nguy cơ đụng `unique (page_type, order_index)` khi có nhiều section

### Sửa: move_section_to_page() function

**Thay thế phần reindex này:**

```sql
-- ❌ OLD (Line ~180-185)
-- Reindex source page (fill gaps)
with reindexed as (
  select id, row_number() over (order by order_index) - 1 as new_order
  from public.page_sections
  where page_type = v_from_page
)
update public.page_sections ps
set order_index = r.new_order
from reindexed r
where ps.id = r.id;
```

**Bằng:**

```sql
-- ✅ NEW: 2-phase reindex to avoid unique constraint conflict
-- Phase 1: Move all to safe zone (offset by 1000)
update public.page_sections
set order_index = order_index + 1000
where page_type = v_from_page;

-- Phase 2: Apply final order
with reindexed as (
  select id, row_number() over (order by order_index) - 1 as new_order
  from public.page_sections
  where page_type = v_from_page
)
update public.page_sections ps
set order_index = r.new_order
from reindexed r
where ps.id = r.id;
```

**Giải thích:**

- Phase 1: Dời tất cả order sang vùng 1000+ (tránh conflict)
- Phase 2: Set order cuối cùng từ row_number()
- Đảm bảo không bao giờ có 2 section cùng order trong quá trình update

---

## 💻 PATCH 3: Fix Frontend Hook - Refresh Cả 2 Page

### Vấn Đề

- Sau move section, chỉ remove local state
- Không refetch page đích → dễ lệch order

### Sửa: useSectionReorder hook

**Thay thế phần handleMove này:**

```typescript
// ❌ OLD (Line ~120-150)
const handleMove = useCallback(
  async (sectionId: string, toPageType: PageType) => {
    try {
      if (pageType === toPageType) {
        throw new Error("Section already on target page");
      }

      setIsLoading(true);

      const result = await moveSection({
        section_id: sectionId,
        to_page_type: toPageType,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to move section");
      }

      // Remove from current page
      setSections((prev) => prev.filter((s) => s.id !== sectionId));

      // Callback to parent to update other page
      options?.onMoveSuccess?.(sectionId, pageType, toPageType);

      toast({
        title: "Success",
        description: result.message || "Section moved successfully",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to move section";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  },
  [pageType, options, toast],
);
```

**Bằng:**

```typescript
// ✅ NEW: Refetch both pages to ensure sync
const handleMove = useCallback(
  async (sectionId: string, toPageType: PageType) => {
    try {
      if (pageType === toPageType) {
        throw new Error("Section already on target page");
      }

      setIsLoading(true);

      const result = await moveSection({
        section_id: sectionId,
        to_page_type: toPageType,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to move section");
      }

      // Refetch both pages to ensure 100% sync
      // Don't rely on local state patch
      await Promise.all([
        fetchSections(), // Refetch current page
        options?.onMoveSuccess?.(sectionId, pageType, toPageType), // Trigger parent to refetch other page
      ]);

      toast({
        title: "Success",
        description: result.message || "Section moved successfully",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to move section";
      setError(message);

      // Refetch on error to ensure consistency
      await fetchSections();

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  },
  [pageType, options, toast, fetchSections],
);
```

**Giải thích:**

- Sau move thành công: refetch current page (để fill gaps)
- Callback trigger parent để refetch other page (để add section)
- Nếu fail: refetch current page để rollback
- Không rely vào local state patch nữa

### Sửa: Page component - Callback handler

**Thay thế phần này:**

```typescript
// ❌ OLD (Line ~30-45)
const homeReorder = useSectionReorder("home", {
  onMoveSuccess: (sectionId, fromPage, toPage) => {
    // When section moves from home to portfolio
    if (toPage === "portfolio") {
      portfolioReorder.fetchSections();
    }
  },
});

const portfolioReorder = useSectionReorder("portfolio", {
  onMoveSuccess: (sectionId, fromPage, toPage) => {
    // When section moves from portfolio to home
    if (toPage === "home") {
      homeReorder.fetchSections();
    }
  },
});
```

**Bằng:**

```typescript
// ✅ NEW: Ensure both pages refetch
const homeReorder = useSectionReorder("home", {
  onMoveSuccess: async (sectionId, fromPage, toPage) => {
    // When section moves from home to portfolio
    if (toPage === "portfolio") {
      await portfolioReorder.fetchSections();
    }
  },
});

const portfolioReorder = useSectionReorder("portfolio", {
  onMoveSuccess: async (sectionId, fromPage, toPage) => {
    // When section moves from portfolio to home
    if (toPage === "home") {
      await homeReorder.fetchSections();
    }
  },
});
```

**Giải thích:**

- Callback bây giờ là async
- Đảm bảo refetch hoàn tất trước khi return
- Cả 2 page luôn sync

---

## 🎨 PATCH 4: Fix DnD Implementation - Disable Drag Đúng Cách

### Vấn Đề

- Dùng `<DndContext disabled={isLoading}>` → sai API
- Không disable drag cho fixed section
- Drag handle vẫn hiển thị cho fixed section

### Sửa: SortableItem component

**Thay thế:**

```typescript
// ❌ OLD
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
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SectionCard
        section={section}
        isDragging={isDragging}
        onToggleVisibility={onToggleVisibility}
        onMove={onMove}
        otherPageType={otherPageType}
      />
    </div>
  );
}
```

**Bằng:**

```typescript
// ✅ NEW: Disable drag for fixed sections
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
    isDragging: isSortableDragging,
  } = useSortable({
    id: section.id,
    disabled: section.is_fixed, // ← Disable drag for fixed
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
      {...(section.is_fixed ? {} : listeners)} // ← Only apply listeners if not fixed
    >
      <SectionCard
        section={section}
        isDragging={isDragging && !section.is_fixed}
        onToggleVisibility={onToggleVisibility}
        onMove={onMove}
        otherPageType={otherPageType}
        isFixed={section.is_fixed}
      />
    </div>
  );
}
```

**Giải thích:**

- `disabled: section.is_fixed` → disable drag ở useSortable level
- `{...(section.is_fixed ? {} : listeners)}` → không apply listeners nếu fixed
- Pass `isFixed` prop để SectionCard biết

### Sửa: SectionCard component

**Thay thế:**

```typescript
// ❌ OLD
interface SectionCardProps {
  section: PageSection;
  isDragging?: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
  onMove: (toPage: PageType) => void;
  otherPageType: PageType;
}

export function SectionCard({
  section,
  isDragging,
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
        ${section.is_fixed ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
      `}
    >
      {/* Drag Handle */}
      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
      ...
    </div>
  );
}
```

**Bằng:**

```typescript
// ✅ NEW: Hide drag handle and disable cursor for fixed sections
interface SectionCardProps {
  section: PageSection;
  isDragging?: boolean;
  isFixed?: boolean; // ← New prop
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
      {/* Drag Handle - Hidden for fixed sections */}
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

        {/* Move Button - Disabled for fixed sections */}
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

**Giải thích:**

- Drag handle ẩn nếu `isFixed`
- Placeholder div để giữ layout
- Move button ẩn nếu `isFixed`
- Opacity nhẹ để visual feedback

### Sửa: PageSectionsList component

**Thay thế:**

```typescript
// ❌ OLD
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={(event) => setActiveId(event.active.id as string)}
  onDragEnd={handleDragEnd}
>
```

**Bằng:**

```typescript
// ✅ NEW: Remove disabled prop, handle in handler instead
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={(event) => setActiveId(event.active.id as string)}
  onDragEnd={handleDragEnd}
>
```

**Và sửa handleDragEnd:**

```typescript
// ❌ OLD
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

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
```

**Bằng:**

```typescript
// ✅ NEW: Check if loading before reorder
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  // Don't reorder if loading
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
      }),
    );

    onReorder(newSections);
  }

  setActiveId(null);
};
```

**Giải thích:**

- Không dùng `disabled` prop trên DndContext
- Check `isLoading` trong handler
- Nếu loading → return early, không reorder

---

## ✅ SUMMARY OF PATCHES

| Patch | File        | Change                              | Impact                                 |
| ----- | ----------- | ----------------------------------- | -------------------------------------- |
| 1     | RPC reorder | Check fixed position, not existence | Fixed sections can stay, just not move |
| 2     | RPC move    | 2-phase reindex                     | No unique constraint conflict          |
| 3     | Hook + Page | Refetch both pages                  | 100% sync after move                   |
| 4     | Components  | Disable drag properly               | No drag for fixed, correct DnD API     |

---

## 🧪 TESTING PATCHES

### Test 1: Fixed Section Reorder

```sql
-- Setup: Home page has Hero (fixed) at position 0
select * from public.page_sections where page_type = 'home' order by order_index;

-- Test: Try to move Hero from 0 to 1
select public.reorder_page_sections(
  'home'::public.page_type_enum,
  '[
    {"id": "uuid-about", "order_index": 0},
    {"id": "uuid-hero", "order_index": 1},  -- Hero moved!
    {"id": "uuid-metrics", "order_index": 2}
  ]'::jsonb
);
-- Should fail: "Invalid: cannot change position of fixed sections"

-- Test: Keep Hero at 0, reorder others
select public.reorder_page_sections(
  'home'::public.page_type_enum,
  '[
    {"id": "uuid-hero", "order_index": 0},  -- Hero stays
    {"id": "uuid-metrics", "order_index": 1},  -- Metrics moved
    {"id": "uuid-about", "order_index": 2}  -- About moved
  ]'::jsonb
);
-- Should succeed
```

### Test 2: Move with Reindex

```sql
-- Setup: Home has [Hero(0), About(1), Metrics(2)]
-- Move Metrics to Portfolio

select public.move_section_to_page(
  (select id from public.page_sections where section_key = 'home_metrics'),
  'portfolio'::public.page_type_enum
);

-- Verify: Home should be [Hero(0), About(1)]
select page_type, section_name, order_index
from public.page_sections
where page_type = 'home'
order by order_index;
```

### Test 3: Frontend Sync

```typescript
// Simulate move in browser console
// 1. Click "Move to Portfolio" on a section
// 2. Check Network tab: should see 2 fetch requests
//    - One for home (refetch)
//    - One for portfolio (refetch)
// 3. Both lists should update correctly
```

### Test 4: Fixed Section UI

```typescript
// In browser:
// 1. Look at Hero section (is_fixed = true)
// 2. Should see:
//    - No drag handle
//    - "Fixed" badge
//    - Slightly faded (opacity-75)
//    - No "Move to Portfolio" button
// 3. Try to drag: should not work
```

---

## 📝 DEPLOYMENT NOTES

1. **Database**: Run SQL patches (Patch 1 & 2)
2. **Frontend**: Update hook + components (Patch 3 & 4)
3. **Test**: Run all 4 test scenarios
4. **Deploy**: Push to production

---

## ✨ FINAL CHECKLIST

- [x] is_fixed logic: fixed sections can't move position, but can exist
- [x] Reindex: 2-phase to avoid unique conflict
- [x] Frontend sync: refetch both pages after move
- [x] DnD: disable drag properly, hide handle for fixed
- [x] No pseudo-code: all code is production-ready
- [x] No breaking changes: only patches, not rewrites

**Ready for production deployment!**
