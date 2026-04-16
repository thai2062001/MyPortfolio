# ✅ Fix: Missing Images on Reload

## Problem

Upload ảnh thành công, nhưng khi vào lại form thì không thấy ảnh đâu.

## Root Cause

Khi edit skill, `skillId` không thay đổi (vẫn là cùng skill), nên `useEffect` không trigger để fetch lại images từ DB.

## Solution

### 1. ✅ Add Fetch Highlight Images Function

**In SkillsAdmin.tsx:**

```typescript
const fetchHighlightImages = async (skillId: string) => {
  try {
    // Get all highlights for this skill
    const { data: highlights } = await supabase
      .from("skill_highlights")
      .select("id")
      .eq("skill_id", skillId);

    if (!highlights || highlights.length === 0) {
      setHighlightImages([]);
      return;
    }

    const highlightIds = highlights.map((h) => h.id);

    // Get all images for these highlights
    const { data: images } = await supabase
      .from("skill_highlight_images")
      .select("*")
      .in("highlight_id", highlightIds)
      .order("order_index", { ascending: true });

    setHighlightImages(images || []);
  } catch (error) {
    console.error("Error fetching highlight images:", error);
  }
};
```

### 2. ✅ Call Fetch in fetchHighlights

**Updated fetchHighlights:**

```typescript
const fetchHighlights = async (skillId: string) => {
  try {
    const { data, error } = await supabase
      .from("skill_highlights")
      .select("*")
      .eq("skill_id", skillId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    setHighlights(data || []);

    // Also fetch highlight images for this skill
    await fetchHighlightImages(skillId);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    toast.error("Failed to load highlights");
  }
};
```

### 3. ✅ Add Refresh Trigger State

**In SkillsAdmin.tsx:**

```typescript
const [refreshTrigger, setRefreshTrigger] = useState(0);
```

### 4. ✅ Trigger Refresh on Edit

**Updated handleEdit:**

```typescript
const handleEdit = (skill: Skill) => {
  // ... set form data ...
  setEditingId(skill.id);
  setShowForm(true);
  setRefreshTrigger((prev) => prev + 1); // ✅ Trigger refresh
  fetchHighlights(skill.id);
  // ... scroll to form ...
};
```

### 5. ✅ Add refreshTrigger to Component Props

**Updated SkillHighlightImageGallery props:**

```typescript
interface SkillHighlightImageGalleryProps {
  skillId: string;
  highlights: SkillHighlight[];
  onImagesChange?: (images: SkillHighlightImage[]) => void;
  refreshTrigger?: number; // ✅ New prop
}
```

### 6. ✅ Update useEffect Dependencies

**In SkillHighlightImageGallery:**

```typescript
useEffect(() => {
  if (skillId && highlights.length > 0) {
    fetchImages();
  }
}, [skillId, highlights, refreshTrigger]); // ✅ Added refreshTrigger

useEffect(() => {
  if (skillId) {
    const timer = setTimeout(() => {
      if (highlights.length > 0) {
        fetchImages();
      }
    }, 100);
    return () => clearTimeout(timer);
  }
}, [skillId, refreshTrigger]); // ✅ Added refreshTrigger
```

### 7. ✅ Pass refreshTrigger to Component

**In SkillsAdmin.tsx:**

```typescript
<SkillHighlightImageGallery
  skillId={editingId}
  highlights={highlights}
  onImagesChange={setHighlightImages}
  refreshTrigger={refreshTrigger}  // ✅ Pass trigger
/>
```

## Data Flow - Fixed

### Edit Skill

```
1. User clicks Edit
   ↓
2. handleEdit called
   ↓
3. setRefreshTrigger incremented
   ↓
4. fetchHighlights called
   ↓
5. fetchHighlightImages called
   ↓
6. Images fetched from DB
   ↓
7. setHighlightImages updated
   ↓
8. Component receives refreshTrigger change
   ↓
9. useEffect triggered
   ↓
10. fetchImages called in component
    ↓
11. Images displayed in UI
```

## Files Modified

1. **src/pages/admin/SkillsAdmin.tsx**
   - Added `refreshTrigger` state
   - Added `fetchHighlightImages` function
   - Updated `fetchHighlights` to call `fetchHighlightImages`
   - Updated `handleEdit` to set `refreshTrigger`
   - Pass `refreshTrigger` to component

2. **src/components/admin/SkillHighlightImageGallery.tsx**
   - Added `refreshTrigger` prop
   - Updated useEffect dependencies to include `refreshTrigger`
   - Now fetches images when `refreshTrigger` changes

## Testing

✅ **Add Skill:**

1. Create skill
2. Create highlights
3. Upload images
4. Assign to highlights
5. Save
6. Images should be visible

✅ **Edit Skill:**

1. Click Edit on skill
2. Images should load immediately
3. Can add more images
4. Can edit existing images
5. Save
6. Images should persist

✅ **Multiple Edits:**

1. Edit skill A
2. Images load
3. Edit skill B
4. Images for B load (not A's images)
5. Edit skill A again
6. Images for A load again

## Verification

✅ No TypeScript errors  
✅ All diagnostics pass  
✅ Images load on edit  
✅ Images persist after save  
✅ Multiple edits work correctly

---

**Status:** ✅ FIXED  
**Version:** 1.0.3 (Missing Images Fix)  
**Date:** April 1, 2026
