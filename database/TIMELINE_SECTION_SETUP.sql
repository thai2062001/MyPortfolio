-- =========================================================
-- Timeline Section Settings - Setup & Seed Data
-- Chạy file này sau TIMELINE_SECTION_SETTINGS.sql
-- =========================================================

-- Kiểm tra xem table đã tồn tại chưa
-- Nếu chưa, hãy chạy TIMELINE_SECTION_SETTINGS.sql trước

-- Insert default data nếu chưa có
INSERT INTO public.timeline_section_settings (
  id,
  eyebrow_en,
  title_en,
  description_en,
  eyebrow_ja,
  title_ja,
  description_ja,
  is_published
)
VALUES (
  1,
  'JOURNEY',
  'Career Timeline',
  'A comprehensive overview of my professional journey and key milestones.',
  'ジャーニー',
  'キャリアタイムライン',
  '私のキャリアの全体像と主要なマイルストーンの概要です。',
  true
)
ON CONFLICT (id) DO UPDATE SET
  eyebrow_en = EXCLUDED.eyebrow_en,
  title_en = EXCLUDED.title_en,
  description_en = EXCLUDED.description_en,
  eyebrow_ja = EXCLUDED.eyebrow_ja,
  title_ja = EXCLUDED.title_ja,
  description_ja = EXCLUDED.description_ja,
  is_published = EXCLUDED.is_published;

-- Verify data was inserted
SELECT * FROM public.timeline_section_settings WHERE id = 1;
