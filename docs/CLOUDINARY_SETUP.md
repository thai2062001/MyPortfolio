# Cloudinary Setup Guide

## Overview

Hướng dẫn setup Cloudinary để upload SVG icon cho Tool Items.

## 1. Tạo Cloudinary Account

1. Vào https://cloudinary.com
2. Click "Sign Up"
3. Tạo account (email, password)
4. Verify email
5. Login vào dashboard

## 2. Lấy Cloudinary Credentials

1. Vào Cloudinary Dashboard
2. Tìm "Cloud Name" (ví dụ: `dpdzbuiml`)
3. Copy Cloud Name

## 3. Tạo Upload Preset

1. Vào Settings → Upload
2. Scroll xuống "Upload presets"
3. Click "Add upload preset"
4. Nhập:
   - Name: `portfolio_icons`
   - Unsigned: ON (để frontend có thể upload)
   - Folder: `tool-icons` (optional, để organize)
5. Click "Save"

## 4. Setup Environment Variables

### .env.local

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Ví dụ:**

```
VITE_CLOUDINARY_CLOUD_NAME=dpdzbuiml
```

### Restart dev server

```bash
npm run dev
# hoặc
yarn dev
```

## 5. Test Upload

1. Vào `/admin/tool-items`
2. Click "Add Tool"
3. Nhập tool info
4. Trong "Tool Icon" section:
   - Click "Download SVG from thesvg.org" để mở thesvg.org (popup)
   - Tải icon SVG từ thesvg.org
   - Click "Click to upload SVG" để upload file
5. Chờ upload xong
6. Icon URL sẽ tự điền vào form
7. Click "Add Tool"

## 6. Verify Upload

1. Vào Cloudinary Dashboard
2. Vào Media Library
3. Kiểm tra file đã upload trong `tool-icons` folder

## Troubleshooting

### Upload không hoạt động

- Kiểm tra `VITE_CLOUDINARY_CLOUD_NAME` đúng không
- Kiểm tra upload preset `portfolio_icons` đã tạo chưa
- Kiểm tra preset có `Unsigned: ON` không
- Restart dev server

### File quá lớn

- Max 500KB
- Optimize SVG trước khi upload
- Dùng tool như SVGO để compress

### File type không hỗ trợ

- Chỉ hỗ trợ: SVG
- Không hỗ trợ: PNG, JPG, GIF, BMP

## Best Practices

### Icon Format

- ✅ SVG (vector, scalable, nhẹ)
- ✅ Transparent background
- ✅ Simple design
- ❌ PNG, JPG (raster, không scalable)
- ❌ GIF (animated, performance)

### Icon Size

- Recommended: 100x100px hoặc lớn hơn
- Max file size: 500KB
- Transparent background

### Naming

- Dùng lowercase
- Dùng hyphen: `google-ads.svg`
- Descriptive name

## Security Notes

- Upload preset là `Unsigned` (public)
- Chỉ cho phép upload SVG files
- Có file size limit (500KB)
- Có folder restriction (`tool-icons`)

## Cloudinary URL Format

Upload thành công sẽ trả về URL:

```
https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[filename]
```

**Ví dụ:**

```
https://res.cloudinary.com/dpdzbuiml/image/upload/v1234567890/tool-icons/google-ads.svg
```

URL này sẽ được lưu vào `icon_url` trong Supabase.

## References

- thesvg.org: https://thesvg.org (download SVG icons)
- Cloudinary Docs: https://cloudinary.com/documentation
- Upload API: https://cloudinary.com/documentation/image_upload_api_reference
- React Integration: https://cloudinary.com/documentation/react_integration
