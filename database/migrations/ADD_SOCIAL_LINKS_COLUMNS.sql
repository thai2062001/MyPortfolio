-- =========================================================
-- Migration: Cập nhật bảng social_links
-- Thêm các cột còn thiếu so với schema mới nhất
-- Chạy file này trong Supabase SQL Editor
-- =========================================================

-- Bước 1: Thêm các cột mới
ALTER TABLE public.social_links
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS platform_name TEXT,
  ADD COLUMN IF NOT EXISTS icon_url TEXT,
  ADD COLUMN IF NOT EXISTS icon_storage_path TEXT;

-- Bước 2: Migrate dữ liệu cũ từ 'platform' sang 'platform_name'
UPDATE public.social_links
SET platform_name = platform
WHERE platform_name IS NULL;

-- Bước 3: Xóa ràng buộc NOT NULL của cột 'platform' cũ
-- (Frontend mới chỉ gửi platform_name, không gửi platform nữa)
ALTER TABLE public.social_links
  ALTER COLUMN platform DROP NOT NULL;

-- (Tuỳ chọn) Sau khi verify ổn, có thể set NOT NULL cho các cột mới:
-- ALTER TABLE public.social_links ALTER COLUMN platform_name SET NOT NULL;
-- ALTER TABLE public.social_links ALTER COLUMN display_name SET NOT NULL;
