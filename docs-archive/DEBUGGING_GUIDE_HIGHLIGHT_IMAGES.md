# Debugging Guide: Skill Highlight Images Persistence Issue

## Problem Statement

Images upload successfully to Cloudinary, but when fetching from Supabase, query returns 0 results. However, Supabase shows images ARE in the database.

## Root Cause Analysis

The issue is likely one of these:

1. **Query Timing Issue** - Images inserted but not immediately visible due to replication lag
2. **RLS Policy Blocking** - Row-level security policies preventing read access
3. **onImagesChange Not Called** - Parent state not updated after insert
4. **Component Not Re-fetching** - Component doesn't trigger fetch after insert
5. **Duplicate onImagesChange Calls** - State being called twice causing race condition

## Enhanced Logging Added

### Component Logging (SkillHighlightImageGallery.tsx)

**Upload Flow:**

```
🎨 SkillHighlightImageGallery rendered
🔄 useEffect 1 triggered
🔄 useEffect 2 triggered
⏱️ Timeout fired
🔍 Fetching images for skill
📌 Highlight IDs
✅ Query result
📸 Images found
```

**Assign Highlight Flow:**

```
📌 handleAssignHighlight called
🔄 Inserting temp image to DB
✅ Image inserted to DB
📤 Calling onImagesChange with updated images
```

**Update Metadata Flow:**

```
📝 handleUpdateMetadata called
🔄 Inserting temp image to DB
✅ Image inserted to DB
📤 Calling onImagesChange with updated images
```

### Parent Component Logging (SkillsAdmin.tsx)

**Fetch Flow:**

```
🔍 Fetching highlight images for skill
📌 Highlights found
🔗 Highlight IDs
✅ Images query result
```

**Save Flow:**

```
💾 handleSubmit called
💾 saveHighlightImages called
🔍 Filtered images to save
✅ Highlight images saved successfully
```

## How to Debug

### Step 1: Open Browser Console

1. Go to http://localhost:8080/admin/skills-management
2. Open DevTools (F12)
3. Go to Console tab
4. Filter by "🎨" or "💾" to see relevant logs

### Step 2: Test Upload Flow

1. Click "Add Skill" or "Edit Skill"
2. Create/select highlights
3. Upload images
4. **Check console for:**
   - `🎨 SkillHighlightImageGallery rendered` - Component mounted
   - `🔄 useEffect 1 triggered` - Dependencies changed
   - `🔍 Fetching images for skill` - Fetch started
   - `✅ Query result` - Query completed

### Step 3: Test Assign Highlight

1. Click edit (✏️) on an uploaded image
2. Select a highlight from dropdown
3. Click "Save"
4. **Check console for:**
   - `📌 handleAssignHighlight called` - Handler triggered
   - `🔄 Inserting temp image to DB` - Insert started
   - `✅ Image inserted to DB` - Insert successful
   - `📤 Calling onImagesChange with updated images` - Parent notified

### Step 4: Test Save Skill

1. Fill in skill form
2. Click "Save"
3. **Check console for:**
   - `💾 handleSubmit called` - Submit started
   - `💾 saveHighlightImages called` - Save function called
   - `🔍 Filtered images to save` - Shows how many images filtered
   - `✅ Highlight images saved successfully` - Save completed

### Step 5: Verify in Supabase

1. Go to Supabase dashboard
2. Open `skill_highlight_images` table
3. Check if images appear with correct `highlight_id`
4. Verify `image_url` is not empty

### Step 6: Test Reload

1. Edit the skill again
2. **Check console for:**
   - `🔍 Fetching images for skill` - Fetch triggered
   - `📌 Highlights found` - Highlights loaded
   - `✅ Images query result` - Images loaded
   - `📸 Images found: X` - Shows count

## Expected Console Output

### Successful Upload + Assign + Save Flow

```
🎨 SkillHighlightImageGallery rendered: {skillId: "abc123", highlightsCount: 2, imagesCount: 0, refreshTrigger: 0}
🔄 useEffect 1 triggered: {skillId: "abc123", highlightsCount: 2, refreshTrigger: 0}
🔍 Fetching images for skill: abc123
📌 Highlight IDs: ["h1", "h2"]
✅ Query result: {data: Array(0), error: null}
📸 Images found: 0

[User uploads image]

🎨 SkillHighlightImageGallery rendered: {skillId: "abc123", highlightsCount: 2, imagesCount: 1, refreshTrigger: 0}

[User assigns highlight]

📌 handleAssignHighlight called: {imageId: "temp-1234567890-0", highlightId: "h1", isTemp: true}
🔄 Inserting temp image to DB...
✅ Image inserted to DB: {id: "real-uuid", highlight_id: "h1", image_url: "...", ...}
📤 Calling onImagesChange with updated images

[User saves skill]

💾 handleSubmit called: {editingId: "abc123", highlightImagesCount: 1}
🔄 Updating existing skill...
✅ Skill updated
💾 Saving highlight images...
💾 saveHighlightImages called: {skillId: "abc123", totalImages: 1}
🔍 Filtered images to save: {total: 1, toSave: 0, filtered: []}
⚠️ No valid images to save after filtering

[User edits skill again]

🔄 useEffect 1 triggered: {skillId: "abc123", highlightsCount: 2, refreshTrigger: 1}
🔍 Fetching images for skill: abc123
📌 Highlight IDs: ["h1", "h2"]
✅ Query result: {data: Array(1), error: null}
📸 Images found: 1
```

## Common Issues and Solutions

### Issue 1: "No valid images to save after filtering"

**Cause:** Images are already in DB (inserted when assigned), so they're not being saved again.

**Solution:** This is CORRECT behavior. Images inserted when highlight assigned, not on skill save.

### Issue 2: "Query result: {data: Array(0), error: null}"

**Cause:** Images not being fetched from DB.

**Possible Solutions:**

1. Check if highlights are loaded (should see `📌 Highlights found: X`)
2. Check if highlight IDs are correct
3. Check RLS policies on `skill_highlight_images` table
4. Check if images actually exist in Supabase

### Issue 3: "Image inserted to DB" but then "No valid images to save"

**Cause:** Images inserted when assigned (temp → real), so they're already in DB.

**Solution:** This is CORRECT. The `saveHighlightImages` function filters out:

- Temp images (id starts with "temp-")
- Unassigned images (no highlight_id)

Only NEW temp images that haven't been assigned yet would be saved.

### Issue 4: Images disappear after reload

**Cause:** `refreshTrigger` not incrementing on edit.

**Solution:** Check that `handleEdit` calls `setRefreshTrigger((prev) => prev + 1)`

## Data Flow Verification

### Expected Flow for New Skill

```
1. User creates skill
   ↓
2. User creates highlights (saved to DB with real IDs)
   ↓
3. User uploads images
   → Images in local state (temp IDs)
   → highlight_id = ""
   ↓
4. User assigns images to highlights
   → INSERT to DB with real highlight_id
   → Replace temp with real from DB
   → Call onImagesChange
   ↓
5. User clicks Save
   → Save skill
   → saveHighlightImages filters (no temp images left)
   → No new inserts needed (already in DB)
   ↓
6. Images now persisted in DB
```

### Expected Flow for Edit Skill

```
1. User clicks Edit
   → setRefreshTrigger incremented
   → fetchHighlights called
   → fetchHighlightImages called
   ↓
2. Component receives refreshTrigger change
   → useEffect triggered
   → fetchImages called
   → Images loaded from DB
   ↓
3. User can:
   → Upload new images (temp IDs)
   → Assign new images (INSERT to DB)
   → Edit existing images (UPDATE in DB)
   ↓
4. User clicks Save
   → Update skill
   → saveHighlightImages saves new images
```

## Testing Checklist

- [ ] Upload image → see in local state
- [ ] Assign highlight → see INSERT in console
- [ ] Image appears with highlight badge
- [ ] Save skill → see in Supabase
- [ ] Edit skill → images load from DB
- [ ] Can add more images to same skill
- [ ] Can assign images to different highlights
- [ ] Cover image works correctly
- [ ] Delete image works
- [ ] Edit metadata works

## Next Steps if Still Not Working

1. **Check RLS Policies:**

   ```sql
   SELECT * FROM pg_policies
   WHERE tablename = 'skill_highlight_images';
   ```

2. **Check Table Structure:**

   ```sql
   \d skill_highlight_images
   ```

3. **Verify Foreign Key:**

   ```sql
   SELECT * FROM skill_highlight_images
   WHERE highlight_id IS NULL;
   ```

4. **Check Supabase Logs:**
   - Go to Supabase dashboard
   - Check "Logs" section for any errors

5. **Test Direct Insert:**
   ```sql
   INSERT INTO skill_highlight_images
   (highlight_id, image_url, alt_text, caption, is_cover, order_index)
   VALUES ('real-uuid', 'https://...', '', '', false, 0);
   ```

---

**Last Updated:** April 1, 2026  
**Status:** Enhanced Logging Added  
**Version:** 1.0.5
