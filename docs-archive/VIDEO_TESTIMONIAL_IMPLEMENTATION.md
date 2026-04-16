# Video Testimonial Feature - Complete Implementation

## Overview

Chức năng upload và hiển thị video testimonial với hỗ trợ:

- ✅ Upload file lên Cloudinary (MP4, WebM, MOV)
- ✅ Nhập URL từ YouTube, Vimeo
- ✅ Direct video links
- ✅ Áp dụng cho cả `testimonials` và `project_testimonials`

## Key Features

### 1. Dual Input Mode

- **Upload File:** Upload video trực tiếp lên Cloudinary
- **External URL:** Nhập link YouTube, Vimeo, hoặc direct video URL

### 2. Smart Video Detection

- Tự động detect YouTube URLs và render iframe
- Tự động detect Vimeo URLs và render iframe
- Fallback to HTML5 video player cho direct URLs

### 3. Admin Interface

- Tab selector để switch giữa upload/URL modes
- Real-time preview cho tất cả video types
- Upload progress indicator
- Remove video functionality

## Supported Video Sources

### YouTube

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

### Vimeo

- `https://vimeo.com/VIDEO_ID`
- `https://vimeo.com/video/VIDEO_ID`

### Direct URLs

- Cloudinary hosted videos
- Any CDN video URL (MP4, WebM, MOV)

## Usage Guide

### Admin - Add Video Testimonial

**Method 1: Upload File**

1. Go to Admin > Testimonials
2. Click "Add New" or Edit
3. In Video section, click "Upload File" tab
4. Select video file (max 100MB)
5. Wait for upload
6. Preview appears automatically

**Method 2: External URL**

1. Go to Admin > Testimonials
2. Click "Add New" or Edit
3. In Video section, click "External URL" tab
4. Paste YouTube/Vimeo/Direct URL
5. Preview appears automatically

### Frontend Display

- Testimonials Section: Video plays in right panel
- Project Detail: Video shows below testimonial quote
- Auto-detects video type and renders appropriately

## Files Modified

1. `src/types/admin.ts` - Added video_url to interfaces
2. `src/lib/cloudinary.ts` - Video upload function
3. `src/pages/admin/Testimonials.tsx` - Dual mode UI + helpers
4. `src/components/admin/ProjectForm.tsx` - Video URL field
5. `src/components/TestimonialsSection.tsx` - Smart video rendering
6. `src/pages/ProjectDetail.tsx` - Smart video rendering

## Testing Checklist

### Upload Mode

- [ ] Upload MP4 file
- [ ] Upload WebM file
- [ ] Upload MOV file
- [ ] File size validation (>100MB)
- [ ] File type validation

### URL Mode

- [ ] YouTube standard URL
- [ ] YouTube short URL
- [ ] YouTube shorts
- [ ] Vimeo URL
- [ ] Direct video URL

### Display

- [ ] YouTube embed in testimonials section
- [ ] Vimeo embed in testimonials section
- [ ] Direct video in testimonials section
- [ ] Video in project detail page
- [ ] Mobile responsive
- [ ] Iframe aspect ratio

## Technical Notes

- Default mode: External URL (easier for most users)
- Upload mode: Available for self-hosted videos
- Video URLs stored in database (not files)
- YouTube/Vimeo handle their own optimization
- Cloudinary optimizes uploaded videos
- Backward compatible with existing testimonials
