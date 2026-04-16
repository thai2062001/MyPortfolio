# Skill Management System Setup

## Overview

Hệ thống quản lý Skill mới với 2 trang admin:

- **Skill Settings**: Quản lý các skill (thêm, xóa, sửa)
- **Skill Categories**: Quản lý các category của skill (thêm, xóa, sửa)

## Database Changes

### 1. Create Skill Categories Table

Chạy SQL sau trên Supabase:

```sql
-- =========================================================
-- Skill Categories Table
-- Quản lý các category của Skills
-- =========================================================

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null unique,
  name_ja text not null unique,
  slug text not null unique,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_skill_categories_updated_at on public.skill_categories;
create trigger trg_skill_categories_updated_at
before update on public.skill_categories
for each row
execute function public.set_updated_at();

alter table public.skill_categories enable row level security;

drop policy if exists "Public can view published skill categories" on public.skill_categories;
create policy "Public can view published skill categories"
on public.skill_categories
for select
using (is_published = true);

drop policy if exists "Authenticated can manage skill categories" on public.skill_categories;
create policy "Authenticated can manage skill categories"
on public.skill_categories
for all
to authenticated
using (true)
with check (true);

create index if not exists idx_skill_categories_order on public.skill_categories(order_index);
create index if not exists idx_skill_categories_published on public.skill_categories(is_published);

-- =========================================================
-- Update Skills table to reference skill_categories
-- =========================================================

alter table public.skills
add column if not exists category_id uuid references public.skill_categories(id) on delete set null;

-- Seed default categories
insert into public.skill_categories (name_en, name_ja, slug, order_index, is_published)
values
  ('Data Management', 'データ管理', 'data-management', 0, true),
  ('Automation Tools', '自動化ツール', 'automation-tools', 1, true),
  ('Languages', '言語', 'languages', 2, true)
on conflict (slug) do nothing;
```

## Frontend Changes

### 2. New Admin Pages

- `src/pages/admin/SkillSettings.tsx` - Quản lý skill
- `src/pages/admin/SkillCategories.tsx` - Quản lý category

### 3. Updated Files

- `src/components/admin/AdminLayout.tsx` - Thêm menu "Skills" với 2 submenu
- `src/App.tsx` - Thêm routes cho 2 trang mới

## Menu Structure

Admin Panel > Skills
├── Skill Settings (Quản lý skill)
└── Skill Categories (Quản lý category)

## Features

### Skill Settings

- ✅ Thêm skill mới
- ✅ Sửa skill
- ✅ Xóa skill
- ✅ Publish/Unpublish skill
- ✅ Lọc theo category
- ✅ Sắp xếp theo order_index
- ✅ Hiển thị tiêu đề tiếng Anh + tiếng Nhật

### Skill Categories

- ✅ Thêm category mới
- ✅ Sửa category
- ✅ Xóa category
- ✅ Publish/Unpublish category
- ✅ Sắp xếp theo order_index
- ✅ Auto-generate slug từ tên tiếng Anh
- ✅ Hiển thị tiêu đề tiếng Anh + tiếng Nhật

## Bilingual Support

Tất cả các trường đều có tiêu đề tiếng Anh + tiếng Nhật:

- `name_en` / `name_ja` (Category)
- `skill_name` (Skill - hiển thị cùng category name)

## How to Use

1. **Chạy SQL** trên Supabase để tạo bảng `skill_categories`
2. **Truy cập Admin Panel** > Skills
3. **Quản lý Categories** trước (tạo các category cần thiết)
4. **Quản lý Skills** (thêm skill vào các category)

## Notes

- Khi xóa category, các skill liên quan sẽ có `category_id = NULL`
- Slug được auto-generate từ tên tiếng Anh, có thể chỉnh sửa thủ công
- Các category mặc định đã được seed: Data Management, Automation Tools, Languages
