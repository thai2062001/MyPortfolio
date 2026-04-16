# Skill Images Management Guide

## Overview

Skill Images Management cho phép bạn quản lý ảnh cho từng skill, bao gồm:

- Upload ảnh bìa (cover image) cho skill
- Quản lý gallery ảnh cho skill
- Tự động chuyển đổi ảnh sang WebP
- Lưu trữ ảnh trên Cloudinary

## Features

### 1. Cover Image Upload

- Upload ảnh bìa cho skill
- Tự động chuyển đổi sang WebP
- Lưu URL vào database

### 2. Skill Images Gallery

- Upload nhiều ảnh cho skill
- Thêm alt text và caption cho mỗi ảnh
- Đặt ảnh làm cover image
- Xóa ảnh
- Sắp xếp ảnh theo thứ tự

## How to Use

### Adding a Skill with Cover Image

1. Vào trang **Admin > Skills Management**
2. Click **Add Skill** button
3. Điền thông tin skill (Skill Name, Slug, Category, etc.)
4. Ở phần **Cover Image**, click để upload ảnh
5. Ảnh sẽ tự động chuyển đổi sang WebP
6. Click **Save** để lưu skill

### Managing Skill Images Gallery

1. Vào trang **Admin > Skills Management**
2. Click **Edit** trên skill cần quản lý
3. Scroll xuống phần **Skill Images Gallery**
4. Click vào upload area để thêm ảnh
5. Sau khi upload, bạn có thể:
   - **Edit**: Thêm alt text và caption
   - **Set as Cover**: Đặt ảnh làm cover image (chỉ 1 ảnh có thể là cover)
   - **Delete**: Xóa ảnh

### Image Specifications

- **Format**: Tất cả định dạng ảnh (JPG, PNG, WebP, etc.)
- **Max Size**: 5MB
- **Conversion**: Tự động chuyển đổi sang WebP
- **Storage**: Lưu trên Cloudinary

### Database Schema

```sql
CREATE TABLE skill_images (
  id UUID PRIMARY KEY,
  skill_id UUID NOT NULL (references skills),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## Technical Details

### Image Conversion Process

1. User chọn ảnh
2. Ảnh được load vào canvas
3. Canvas render ảnh sang WebP format (quality: 0.8)
4. WebP blob được upload lên Cloudinary
5. URL được lưu vào database

### Cloudinary Configuration

- **Upload Preset**: `portfolio_images`
- **Cloud Name**: Từ environment variable `VITE_CLOUDINARY_CLOUD_NAME`

### RLS Policies

- **Public**: Có thể xem ảnh của skill đã publish
- **Authenticated**: Có thể quản lý tất cả ảnh

## Troubleshooting

### Upload Failed

- Kiểm tra kích thước file (max 5MB)
- Kiểm tra định dạng ảnh
- Kiểm tra Cloudinary configuration

### Image Not Showing

- Kiểm tra URL có hợp lệ không
- Kiểm tra Cloudinary account có active không
- Kiểm tra RLS policies

## Best Practices

1. **Alt Text**: Luôn thêm alt text mô tả ảnh (SEO & Accessibility)
2. **Caption**: Thêm caption nếu cần giải thích thêm
3. **Cover Image**: Chọn ảnh đẹp nhất làm cover
4. **File Size**: Dùng ảnh có kích thước hợp lý (không quá lớn)
5. **Format**: Để hệ thống tự động chuyển đổi sang WebP

## Related Files

- `src/components/admin/SkillImageGallery.tsx` - Gallery component
- `src/components/admin/CoverImageUpload.tsx` - Cover image upload component
- `src/pages/admin/SkillsAdmin.tsx` - Skills management page
- `src/lib/supabase-skill-queries.ts` - Database queries
