# Skill Icon Upload Feature

## Overview

Added SVG icon upload functionality to the Skills Management admin page. Users can now upload SVG icons directly to Cloudinary instead of manually entering URLs.

## Changes Made

### File: `src/pages/admin/SkillsAdmin.tsx`

#### Imports Added

```typescript
import { useRef } from "react";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
```

#### State & Refs Added

```typescript
const iconUploadRef = useRef<{ reset: () => void }>(null);
```

#### Form Update

Replaced the manual Icon URL input field with CloudinaryUpload component:

**Before:**

```typescript
<Input
  value={formData.icon_url}
  onChange={(e) =>
    setFormData({ ...formData, icon_url: e.target.value })
  }
  placeholder="https://example.com/icon.svg"
/>
```

**After:**

```typescript
<CloudinaryUpload
  ref={iconUploadRef}
  label="Skill Icon (SVG)"
  currentUrl={formData.icon_url}
  onUploadSuccess={(url) =>
    setFormData({ ...formData, icon_url: url })
  }
/>
```

#### Reset Form Update

Updated `resetForm()` to reset the icon upload component:

```typescript
const resetForm = () => {
  // ... other resets
  iconUploadRef.current?.reset();
  // ... rest of resets
};
```

## How It Works

### Upload Process

1. User clicks on the upload area or drags an SVG file
2. File is validated:
   - Must be SVG format (`image/svg+xml`)
   - Max size: 500KB
3. File is uploaded to Cloudinary using the `portfolio_icons` preset
4. Cloudinary returns the secure URL
5. URL is automatically saved to the form data
6. URL is stored in the database when the skill is saved

### Features

- ✅ SVG file validation
- ✅ File size validation (max 500KB)
- ✅ Visual preview of uploaded icon
- ✅ Remove/replace icon option
- ✅ Link to thesvg.org for downloading free SVG icons
- ✅ Automatic Cloudinary upload
- ✅ URL automatically saved to database

## Usage

### Creating a Skill with Icon

1. Go to Admin > Skills Management
2. Click "Add Skill"
3. Fill in skill details
4. In the "Skill Icon (SVG)" section:
   - Click the upload area
   - Select an SVG file from your computer
   - Or drag and drop an SVG file
5. Wait for upload to complete
6. Icon preview will appear
7. Click Save to save the skill with the icon

### Editing a Skill Icon

1. Go to Admin > Skills Management
2. Click Edit on a skill
3. In the "Skill Icon (SVG)" section:
   - Current icon will be displayed
   - Click the X button to remove it
   - Upload a new icon if needed
4. Click Save

### Downloading Free SVG Icons

- Click "Download SVG from thesvg.org" button
- Browse and download free SVG icons
- Upload them to your skills

## Cloudinary Configuration

### Required Setup

- Cloudinary account with `portfolio_icons` upload preset
- Preset should allow SVG uploads
- Unsigned upload enabled for frontend uploads

### Environment Variables

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Database

The `icon_url` field in the `skills` table stores the Cloudinary URL:

```sql
icon_url TEXT
```

## File Size & Format

- **Format**: SVG only
- **Max Size**: 500KB
- **Recommended**: Keep icons simple and optimized

## Error Handling

- Invalid file type: "Only SVG files are allowed"
- File too large: "File size must be less than 500KB"
- Upload failed: "Failed to upload icon"

## Benefits

1. **No Manual URL Entry**: Users don't need to find and copy URLs
2. **Automatic Storage**: URLs are automatically saved to database
3. **Visual Feedback**: Users see preview of uploaded icon
4. **Easy Management**: Can replace icons anytime
5. **Optimized**: Cloudinary handles optimization and delivery

## Testing Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Navigate to Admin > Skills Management
- [ ] Create a new skill
- [ ] Upload an SVG icon
- [ ] Verify icon preview appears
- [ ] Save the skill
- [ ] Verify icon URL is saved in database
- [ ] Edit the skill and verify icon is displayed
- [ ] Replace the icon with a different one
- [ ] Remove the icon
- [ ] Verify all changes are saved correctly

## Notes

- Icons are stored in Cloudinary, not in the database
- Only the URL is stored in the database
- Cloudinary handles image optimization and delivery
- SVG format ensures scalability without quality loss
