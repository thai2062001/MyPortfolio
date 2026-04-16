# Social Links Management Setup

## Overview

Quản lý liên kết xã hội linh hoạt với khả năng upload icon tùy chỉnh.

## Steps to Setup

### 1. Create Storage Bucket

Vào Supabase Dashboard → Storage → Create new bucket:

- **Bucket name**: `social-icons`
- **Public bucket**: Yes
- **File size limit**: 5 MB

### 2. Run SQL Migration

Chạy file `CREATE_SOCIAL_LINKS_TABLE.sql` trong Supabase SQL Editor:

```sql
-- Copy toàn bộ nội dung từ CREATE_SOCIAL_LINKS_TABLE.sql
-- Paste vào Supabase SQL Editor
-- Click "Run"
```

### 3. Verify Table Creation

Kiểm tra trong Supabase Dashboard → Tables:

- `social_links` table đã được tạo
- Có 5 default social links (LinkedIn, Twitter, Facebook, GitHub, Email)

## Features

### Admin Panel (PersonalInfo)

- **Add New Social Link**: Click "Add Link" button
- **Edit Display Name**: Tên hiển thị trên footer
- **Edit URL**: Link đến trang xã hội
- **Upload Icon**: Upload icon tùy chỉnh (PNG, JPG, SVG)
- **Publish/Unpublish**: Ẩn/hiện link trên footer
- **Delete**: Xóa link (icon sẽ tự động xóa khỏi storage)

### Frontend (Footer)

- Hiển thị tất cả published social links
- Nếu có icon, hiển thị icon; nếu không, hiển thị default icon
- Click vào link sẽ mở URL trong tab mới

## Database Schema

```sql
CREATE TABLE social_links (
  id UUID PRIMARY KEY,
  platform_name TEXT UNIQUE,        -- e.g., 'linkedin', 'twitter'
  display_name TEXT,                -- e.g., 'LinkedIn'
  url TEXT,                         -- e.g., 'https://linkedin.com/in/...'
  icon_url TEXT,                    -- Public URL của icon
  icon_storage_path TEXT,           -- Storage path để delete
  order_index INTEGER,              -- Thứ tự hiển thị
  is_published BOOLEAN,             -- Ẩn/hiện
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## API Functions

### Get Published Social Links (Frontend)

```typescript
import { getSocialLinks } from "@/lib/supabase-queries";

const links = await getSocialLinks();
// Returns: SocialLink[] (only published)
```

### Get All Social Links (Admin)

```typescript
import { getAllSocialLinks } from "@/lib/supabase-queries";

const links = await getAllSocialLinks();
// Returns: SocialLink[] (all, including unpublished)
```

### Update Social Link

```typescript
import { updateSocialLink } from "@/lib/supabase-queries";

await updateSocialLink(linkId, {
  display_name: "New Name",
  url: "https://...",
  is_published: true,
});
```

### Create Social Link

```typescript
import { createSocialLink } from "@/lib/supabase-queries";

const newLink = await createSocialLink({
  platform_name: "custom_name",
  display_name: "Display Name",
  url: "https://...",
  order_index: 0,
  is_published: true,
});
```

### Delete Social Link

```typescript
import { deleteSocialLink } from "@/lib/supabase-queries";

await deleteSocialLink(linkId);
// Icon sẽ tự động xóa khỏi storage
```

### Upload Icon

```typescript
import { uploadSocialIcon } from "@/lib/supabase-queries";

const { url, path } = await uploadSocialIcon(file);
// url: Public URL để hiển thị
// path: Storage path để delete sau
```

## Default Social Links

Khi tạo table, 5 social links mặc định sẽ được tạo:

1. LinkedIn (order: 0)
2. Twitter (order: 1)
3. Facebook (order: 2)
4. GitHub (order: 3)
5. Email (order: 4)

Bạn có thể edit URL, upload icon, hoặc delete chúng.

## Icon Upload Best Practices

- **Format**: PNG, JPG, SVG (recommended: SVG for scalability)
- **Size**: 24x24px hoặc 32x32px
- **Max file size**: 5 MB
- **Transparent background**: Recommended for PNG/SVG

## Troubleshooting

### Icons not showing in footer

- Kiểm tra `is_published = true` trong database
- Kiểm tra `icon_url` không null
- Kiểm tra storage bucket `social-icons` public

### Can't upload icon

- Kiểm tra storage bucket `social-icons` đã được tạo
- Kiểm tra file size < 5 MB
- Kiểm tra file format (PNG, JPG, SVG)

### Social links not appearing

- Kiểm tra `is_published = true`
- Kiểm tra `url` không empty
- Refresh page (cache issue)
