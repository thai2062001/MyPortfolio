# Proficiencies Section - Admin Management Guide

## Overview

Hướng dẫn quản lý section PROFICIENCIES từ admin panel, bao gồm Strategic Skills, Technical Arsenal, icons, và descriptions.

## Database Schema Updates

### 1. Expertise Sections Table

Thêm cột mới:

- `strategic_description` (text, nullable)
  - Dòng text mô tả Strategic Skills block
  - Ví dụ: "Merging conceptual architecture with operational excellence to drive measurable outcomes."
  - Có thể chỉnh sửa từ admin panel

### 2. Expertise Tool Items Table

Thêm cột mới:

- `icon_url` (text, nullable)
  - Cloudinary URL của icon
  - Ví dụ: "https://res.cloudinary.com/dpdzbuiml/image/upload/v1234567890/google-ads.svg"
  - Admin upload → Cloudinary → lưu URL vào đây

## Admin Panel Management

### Strategic Skills Management

**URL:** `/admin/strategic-skills`

**Quản lý:**

- Thêm/sửa/xóa Strategic Skills
- Reorder skills
- Publish/unpublish

**Fields:**

- `skill_name` - Tên skill (ví dụ: "Strategic Planning")
- `icon_name` - Lucide icon name (ví dụ: "compass", "users", "target")
- `description` - Subtitle (ví dụ: "VISIONARY ROADMAPS")
- `is_published` - Hiển thị/ẩn

### Tool Items Management

**URL:** `/admin/tool-items`

**Quản lý:**

- Thêm/sửa/xóa tools
- Reorder tools
- Publish/unpublish
- Upload icons

**Fields:**

- `tool_name` - Tên tool (ví dụ: "Google Ads")
- `description` - Category/subtitle (ví dụ: "Performance marketing and campaign execution.")
- `tool_url` - URL của tool (optional)
- `icon_url` - Cloudinary URL của icon (NEW)
- `is_published` - Hiển thị/ẩn

### Expertise Section Header

**URL:** `/admin/expertise-management` (hoặc tương tự)

**Quản lý:**

- `eyebrow` - Nhãn nhỏ (ví dụ: "PROFICIENCIES")
- `title` - Heading lớn (ví dụ: "The Curated Gallery of Mastery.")
- `strategic_title` - Tiêu đề cột trái (ví dụ: "Strategic Skills")
- `strategic_description` - Mô tả Strategic Skills (NEW)
  - Ví dụ: "Merging conceptual architecture with operational excellence to drive measurable outcomes."
- `strategic_helper_text` - Helper text (legacy, có thể để trống)
- `tools_title` - Tiêu đề cột phải (ví dụ: "Technical Arsenal")
- `tools_helper_text` - Helper text (ví dụ: "Hover over a tool to see how it drives results ↓")

## Icon Management

### Workflow

1. Admin upload icon file (PNG, SVG, JPG)
2. File được upload lên Cloudinary
3. Cloudinary trả về URL
4. URL được lưu vào `icon_url` trong Supabase
5. Frontend fetch URL từ Supabase và hiển thị

### Cloudinary URL Format

```
https://res.cloudinary.com/[account]/image/upload/v[version]/[path]/[filename]
```

**Ví dụ:**

```
https://res.cloudinary.com/dpdzbuiml/image/upload/v1234567890/tool-icons/google-ads.svg
https://res.cloudinary.com/dpdzbuiml/image/upload/v1234567890/tool-icons/ga4.png
```

### Cách thêm Icon

1. Vào `/admin/tool-items`
2. Edit tool
3. Click "Upload Icon" button
4. Chọn file từ máy
5. File tự động upload lên Cloudinary
6. URL tự động lưu vào `icon_url`
7. Save

## Frontend Display Logic

### Strategic Description

```typescript
// Priority order:
1. expertise.strategic_description (NEW - từ Supabase)
2. expertise.strategic_helper_text (legacy fallback)
3. Default: "Merging conceptual architecture with operational excellence to drive measurable outcomes."
```

### Tool Icons

```typescript
// Priority order:
1. tool.icon_url (Cloudinary URL từ Supabase)
2. Emoji mapping (fallback)
3. Default: "⚙️"
```

## SQL Migration

Chạy script `PROFICIENCIES_SCHEMA_UPDATE.sql` để thêm cột mới:

```sql
-- Thêm strategic_description vào expertise_sections
ALTER TABLE public.expertise_sections
ADD COLUMN IF NOT EXISTS strategic_description text;

-- Thêm icon_url vào expertise_tool_items
ALTER TABLE public.expertise_tool_items
ADD COLUMN IF NOT EXISTS icon_url text;
```

## Workflow Example

### 1. Thêm Strategic Skill

1. Vào `/admin/strategic-skills`
2. Click "Add Skill"
3. Nhập:
   - Skill Name: "Strategic Planning"
   - Icon Name: "compass"
   - Description: "VISIONARY ROADMAPS"
4. Click "Add Skill"

### 2. Thêm Tool với Icon

1. Vào `/admin/tool-items`
2. Click "Add Tool"
3. Nhập:
   - Tool Name: "Google Ads"
   - Description: "Performance marketing and campaign execution."
   - Tool URL: "https://ads.google.com"
4. Click "Upload Icon"
5. Chọn file icon
6. Chờ upload xong (Cloudinary)
7. URL tự động điền vào `icon_url`
8. Click "Add Tool"

### 3. Chỉnh sửa Strategic Description

1. Vào `/admin/expertise-management`
2. Tìm field "Strategic Description"
3. Nhập: "Merging conceptual architecture with operational excellence to drive measurable outcomes."
4. Click "Save"

## Best Practices

### Icons

- ✅ Dùng SVG cho vector icons (scalable, nhẹ)
- ✅ Dùng PNG/JPG cho raster icons
- ✅ Kích thước: 100x100px hoặc lớn hơn
- ✅ Transparent background (PNG)
- ❌ Không upload file quá lớn (>500KB)
- ❌ Không dùng animated GIF (performance)

### Descriptions

- ✅ Ngắn gọn, dễ hiểu
- ✅ Uppercase cho subtitle
- ✅ Consistent formatting
- ❌ Không dùng HTML tags

### Ordering

- ✅ Reorder bằng up/down buttons
- ✅ Consistent order trên frontend
- ❌ Không xóa rồi thêm lại (mất order)

## Troubleshooting

### Icon không hiển thị

- Kiểm tra `icon_url` có đúng Cloudinary URL không
- Kiểm tra URL có accessible không (test trong browser)
- Fallback sẽ dùng emoji mapping

### Icon upload thất bại

- Kiểm tra file size (<500KB)
- Kiểm tra file format (SVG, PNG, JPG)
- Kiểm tra Cloudinary credentials

### Description không cập nhật

- Kiểm tra `is_published = true`
- Clear browser cache
- Refresh page

### Tool không hiển thị

- Kiểm tra `is_published = true`
- Kiểm tra `order_index` có hợp lệ không
- Max 6 tools hiển thị (2x3 grid)

## Notes

- Tất cả cột mới đều optional (nullable)
- Backward compatible với dữ liệu cũ
- Frontend tự handle fallback nếu thiếu dữ liệu
- Có thể chỉnh sửa bất cứ lúc nào, frontend sẽ cập nhật tự động
- Icon upload sử dụng Cloudinary API (cần config)
