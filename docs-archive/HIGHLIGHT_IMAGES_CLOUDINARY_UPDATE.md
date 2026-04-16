# Highlight Images Management - Cloudinary Upload Update

## Overview

Updated highlight images management to use Cloudinary file upload with automatic WebP conversion instead of manual URL input.

## Changes Made

### 1. New Component: HighlightImageUpload.tsx

**Location:** `src/components/admin/HighlightImageUpload.tsx`

**Features:**

- File upload with drag-and-drop support
- Automatic WebP conversion (quality 0.8)
- Cloudinary integration with `portfolio_icons` preset
- Folder: `portfolio/skill-highlights`
- Max file size: 5MB
- Supported formats: All image types (auto-converted to WebP)

**Form Fields:**

- Image upload (required) - Click to select or drag-drop
- Alt text (optional)
- Caption (optional)
- Cover image checkbox

**Workflow:**

1. User selects image file
2. Component converts to WebP
3. Uploads to Cloudinary
4. Returns URL to parent component
5. Parent saves to database

### 2. SkillDetailsAdmin.tsx Updates

**Changes:**

- Removed manual image URL input form
- Replaced with `HighlightImageUpload` component
- Simplified `handleSaveHighlightImage()` to receive image data from component
- Removed `imageFormData` state (no longer needed)

**Modal Structure:**

```
Highlight Images Modal
├── Add New Image Section
│   └── HighlightImageUpload Component
│       ├── File upload
│       ├── Alt text input
│       ├── Caption textarea
│       ├── Cover image checkbox
│       └── Add/Cancel buttons
└── Images Gallery
    ├── Image preview grid
    ├── Alt text display
    ├── Cover badge
    └── Delete button
```

## Database Schema

Uses existing `skill_highlight_images` table:

```sql
CREATE TABLE skill_highlight_images (
  id UUID PRIMARY KEY,
  highlight_id UUID NOT NULL (FK to skill_highlights),
  image_url TEXT NOT NULL,  -- Cloudinary WebP URL
  alt_text TEXT,
  caption TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

## Image Processing Flow

```
User selects image
    ↓
Component validates (type, size)
    ↓
Convert to WebP (canvas API)
    ↓
Upload to Cloudinary
    ├── Preset: portfolio_icons
    ├── Folder: portfolio/skill-highlights
    └── Returns: secure_url
    ↓
Component returns image data
    ↓
Parent saves to database
    ↓
Gallery refreshes
```

## User Flow

### Adding Images to Highlights

1. Go to `/admin/skill-details`
2. Select a skill from the left sidebar
3. Find the highlight you want to add images to
4. Click the green upload icon on the highlight card
5. In the modal:
   - **Upload Image**: Click upload area or drag-drop image
   - **Wait**: Component converts to WebP and uploads
   - **Add Details**:
     - Alt text (optional)
     - Caption (optional)
     - Check "Set as cover image" if needed
   - **Click "Add Image"**: Saves to database
6. View all images in the gallery below
7. Delete images as needed

### Image Specifications

- **Input Formats**: JPG, PNG, GIF, WebP, etc.
- **Output Format**: WebP (quality 0.8)
- **Max Size**: 5MB
- **Storage**: Cloudinary CDN
- **Folder**: `portfolio/skill-highlights`

## Benefits

1. **No Manual URLs**: Users just upload files
2. **Automatic Optimization**: WebP conversion reduces file size
3. **Reliable Hosting**: Cloudinary CDN
4. **Better UX**: Drag-and-drop support
5. **Consistent Format**: All images stored as WebP

## Technical Details

### WebP Conversion

- Uses HTML5 Canvas API
- Quality: 0.8 (good balance between quality and size)
- Automatic fallback if conversion fails

### Cloudinary Integration

- Preset: `portfolio_icons` (must exist in Cloudinary)
- Folder: `portfolio/skill-highlights`
- Returns: `secure_url` (HTTPS)

### Error Handling

- File type validation
- File size validation (5MB max)
- Upload error handling
- User-friendly error messages

## Testing Checklist

- [ ] Can click upload icon on highlight
- [ ] Image modal opens correctly
- [ ] Can select image file
- [ ] Can drag-drop image
- [ ] Image preview shows after upload
- [ ] Can add alt text
- [ ] Can add caption
- [ ] Can set cover image
- [ ] Can click "Add Image" button
- [ ] Image appears in gallery
- [ ] Can delete images
- [ ] Images persist after page reload
- [ ] Images are in WebP format
- [ ] Cloudinary URLs are correct
- [ ] Error messages show for invalid files
- [ ] Error messages show for oversized files

## Files Modified

1. `src/pages/admin/SkillDetailsAdmin.tsx` - Updated modal and handlers
2. `src/components/admin/HighlightImageUpload.tsx` - New component

## Files Created

1. `src/components/admin/HighlightImageUpload.tsx` - Image upload component

## Environment Variables Required

- `VITE_CLOUDINARY_CLOUD_NAME` - Already configured

## Cloudinary Setup Required

- Preset: `portfolio_icons` must exist
- Folder: `portfolio/skill-highlights` (auto-created)
