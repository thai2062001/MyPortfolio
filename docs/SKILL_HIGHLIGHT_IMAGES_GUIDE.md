# Skill Highlight Images Feature Guide

## Overview

Tính năng này cho phép admin upload nhiều ảnh cho từng highlight trong skill detail. Mỗi ảnh có thể được gắn vào một highlight cụ thể, giúp tổ chức ảnh một cách rõ ràng và trực quan.

## Architecture

### Database Schema

**Bảng: `skill_highlight_images`**

- `id` (UUID): Primary key
- `skill_id` (UUID): Foreign key to skills table - dùng để query tất cả ảnh của một skill
- `highlight_id` (UUID): Foreign key to skill_highlights table - xác định ảnh thuộc highlight nào
- `image_url` (TEXT): URL ảnh trên Cloudinary
- `alt_text` (TEXT): Alt text cho ảnh
- `caption` (TEXT): Caption/mô tả ảnh
- `is_cover` (BOOLEAN): Đánh dấu ảnh cover của highlight
- `order_index` (INTEGER): Thứ tự sắp xếp ảnh
- `created_at`, `updated_at` (TIMESTAMPTZ): Timestamps

### Relationships

```
skills (1) ──── (many) skill_highlights
                           │
                           ├──── (many) skill_highlight_images
                           │
                           └──── (many) skill_applications, skill_tools, skill_steps
```

## Components

### 1. SkillHighlightImageGallery Component

**File:** `src/components/admin/SkillHighlightImageGallery.tsx`

**Props:**

```typescript
interface SkillHighlightImageGalleryProps {
  skillId: string; // ID của skill
  highlights: SkillHighlight[]; // Danh sách highlights của skill
  onImagesChange?: (images: SkillHighlightImage[]) => void; // Callback khi ảnh thay đổi
}
```

**Features:**

- Upload nhiều ảnh cùng lúc
- Tự động convert sang WebP
- Gắn ảnh vào highlight cụ thể
- Hiển thị badge/tag highlight cho mỗi ảnh
- Chọn cover image cho mỗi highlight
- Edit alt text và caption
- Delete ảnh
- Reorder ảnh

**Upload Flow:**

1. User upload ảnh → lưu vào Cloudinary
2. Ảnh được lưu vào DB với `highlight_id` trống (unassigned)
3. User chọn highlight → update `highlight_id`
4. Ảnh hiển thị badge highlight tương ứng

### 2. SkillsAdmin Page Updates

**File:** `src/pages/admin/SkillsAdmin.tsx`

**New Features:**

- Quản lý highlights trực tiếp trong form Add/Edit Skill
- Thêm/sửa/xóa highlights
- Hiển thị danh sách highlights
- Tích hợp SkillHighlightImageGallery

**Highlights Management:**

```typescript
// Add highlight
handleAddHighlight(); // Thêm highlight mới

// Edit highlight
handleEditHighlight(highlight); // Sửa highlight

// Delete highlight
handleDeleteHighlight(id); // Xóa highlight
```

## Usage Flow

### Add Skill with Highlights and Images

1. Click "Add Skill" button
2. Fill in skill details (name, slug, category, etc.)
3. Upload icon và cover image
4. Scroll down to "Skill Highlights" section
5. Add highlights:
   - Enter highlight title
   - Enter description (optional)
   - Click "Add Highlight"
6. Upload highlight images:
   - Click upload area
   - Select multiple images
   - Images convert to WebP automatically
7. Assign images to highlights:
   - Click edit (✏️) on each image
   - Select highlight from dropdown
   - Edit alt text/caption if needed
   - Click Save
8. Set cover image (optional):
   - Click star icon on image
   - Only one image per highlight can be cover
9. Click "Save" to save skill with all highlights and images

### Edit Skill with Highlights and Images

1. Click Edit on skill in table
2. Form loads with existing data
3. Highlights section shows existing highlights
4. Highlight images section shows existing images with their assigned highlights
5. Can add/edit/delete highlights
6. Can add/edit/delete highlight images
7. Click "Save" to update

## Database Queries

### Get all highlight images for a skill

```typescript
const { data } = await supabase
  .from("skill_highlight_images")
  .select("*")
  .eq("skill_id", skillId)
  .order("order_index", { ascending: true });
```

### Get images for a specific highlight

```typescript
const { data } = await supabase
  .from("skill_highlight_images")
  .select("*")
  .eq("highlight_id", highlightId)
  .order("order_index", { ascending: true });
```

### Get cover image for a highlight

```typescript
const { data } = await supabase
  .from("skill_highlight_images")
  .select("*")
  .eq("highlight_id", highlightId)
  .eq("is_cover", true)
  .single();
```

## API Functions

**File:** `src/lib/supabase-skill-queries.ts`

```typescript
// Get all highlight images for a skill
getSkillHighlightImages(skillId: string): Promise<SkillHighlightImage[]>

// Get images for a specific highlight
getHighlightImages(highlightId: string): Promise<SkillHighlightImage[]>

// Get cover image for a highlight
getHighlightCoverImage(highlightId: string): Promise<SkillHighlightImage | null>
```

## Image Upload Configuration

- **Format:** WebP (auto-converted)
- **Max Size:** 5MB per file
- **Cloudinary Folder:** `portfolio/skills/highlights`
- **Upload Preset:** `portfolio_icons`
- **Multiple Files:** Supported

## UI/UX Details

### Highlight Image Card

Each image displays:

- Thumbnail (20x20px)
- Alt text
- Caption (if exists)
- Highlight badge (blue) or "Unassigned" (gray)
- Cover badge (yellow) if is_cover = true
- Action buttons: Edit (✏️), Set Cover (⭐), Delete (✕)

### Highlight Assignment

- Dropdown to select highlight
- Badge shows current assignment
- Can change assignment anytime
- Unassigned images show gray badge

### Cover Image

- Only one image per highlight can be cover
- Star icon to set as cover
- Only available after highlight is assigned
- Automatically removes cover from other images in same highlight

## Migration

If upgrading from old schema without `skill_id` column:

1. Run migration script: `database/SKILL_HIGHLIGHT_IMAGES_MIGRATION.sql`
2. This will:
   - Add `skill_id` column
   - Populate from highlight relationships
   - Create necessary indexes

## Best Practices

1. **Organize Images:** Group related images by highlight
2. **Use Alt Text:** Always add descriptive alt text for accessibility
3. **Set Cover:** Choose representative image as cover for each highlight
4. **Order Images:** Arrange images in logical order using order_index
5. **File Size:** Keep images under 5MB for faster upload
6. **Naming:** Use descriptive names before upload for easier management

## Troubleshooting

### Images not showing after upload

- Check Cloudinary upload preset is correct
- Verify `skill_id` is populated in database
- Check RLS policies allow access

### Can't assign highlight

- Ensure highlight is created first
- Refresh page if highlights not loading
- Check highlight_id is not null in database

### Cover image not updating

- Ensure image is assigned to highlight first
- Only one cover per highlight allowed
- Check is_cover flag in database

## Future Enhancements

- Drag-and-drop reordering
- Bulk upload with highlight assignment
- Image cropping/editing
- Gallery preview
- Image optimization settings
- Batch operations
