-- =========================================================
-- Proficiencies Section Schema Update
-- Thêm cột mới để quản lý icon (Cloudinary URL) và description text
-- =========================================================

-- 1) Thêm cột strategic_description vào expertise_sections
-- Để quản lý dòng text "Merging conceptual architecture with operational excellence..."
ALTER TABLE public.expertise_sections
ADD COLUMN IF NOT EXISTS strategic_description text;

-- Update giá trị mặc định
UPDATE public.expertise_sections
SET strategic_description = 'Merging conceptual architecture with operational excellence to drive measurable outcomes.'
WHERE id = 1 AND strategic_description IS NULL;

-- 2) Thêm cột icon_url vào expertise_tool_items
-- Để lưu Cloudinary URL của icon
ALTER TABLE public.expertise_tool_items
ADD COLUMN IF NOT EXISTS icon_url text;

-- =========================================================
-- Cập nhật RLS policies (nếu cần)
-- =========================================================

-- Không cần thay đổi policy vì chỉ thêm cột, logic vẫn giữ nguyên

-- =========================================================
-- Seed data (optional)
-- Cập nhật tool items với icon URLs từ Cloudinary
-- =========================================================

-- Ví dụ (uncomment để dùng):
-- UPDATE public.expertise_tool_items SET icon_url = 'https://res.cloudinary.com/[account]/image/upload/v[version]/google-ads.svg' WHERE tool_name = 'GOOGLE ADS';
-- UPDATE public.expertise_tool_items SET icon_url = 'https://res.cloudinary.com/[account]/image/upload/v[version]/ga4.svg' WHERE tool_name = 'GA4';

-- Hoặc để trống, frontend sẽ dùng emoji fallback

-- =========================================================
-- Notes
-- =========================================================
-- - strategic_description: Dòng text mô tả Strategic Skills block
-- - icon_url: Cloudinary URL của icon (ví dụ: https://res.cloudinary.com/dpdzbuiml/image/upload/v1234567890/tool-icon.svg)
-- - Nếu icon_url trống, frontend sẽ dùng emoji mapping
-- - Cột optional (nullable) để backward compatible
-- - Admin upload icon → Cloudinary → lưu URL vào icon_url
