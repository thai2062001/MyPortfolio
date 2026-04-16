-- Add bilingual support to hero_sections table
-- Thêm hỗ trợ hai ngôn ngữ cho bảng hero_sections

ALTER TABLE public.hero_sections
ADD COLUMN IF NOT EXISTS badge_ja text,
ADD COLUMN IF NOT EXISTS title_line_1_ja text,
ADD COLUMN IF NOT EXISTS title_line_2_ja text,
ADD COLUMN IF NOT EXISTS description_ja text,
ADD COLUMN IF NOT EXISTS primary_button_label_ja text,
ADD COLUMN IF NOT EXISTS secondary_button_label_ja text,
ADD COLUMN IF NOT EXISTS hero_image_alt_ja text;

-- Rename existing columns to _en suffix for clarity
ALTER TABLE public.hero_sections
RENAME COLUMN badge TO badge_en;

ALTER TABLE public.hero_sections
RENAME COLUMN title_line_1 TO title_line_1_en;

ALTER TABLE public.hero_sections
RENAME COLUMN title_line_2 TO title_line_2_en;

ALTER TABLE public.hero_sections
RENAME COLUMN description TO description_en;

ALTER TABLE public.hero_sections
RENAME COLUMN primary_button_label TO primary_button_label_en;

ALTER TABLE public.hero_sections
RENAME COLUMN secondary_button_label TO secondary_button_label_en;

ALTER TABLE public.hero_sections
RENAME COLUMN hero_image_alt TO hero_image_alt_en;

-- Update existing data with Japanese translations
UPDATE public.hero_sections
SET
  badge_ja = 'シニアマーケティングエグゼクティブ',
  title_line_1_ja = 'ファム・ティ',
  title_line_2_ja = 'ハイ・イェン。',
  description_ja = 'ブランド加速のための革新的な戦略。ビジョンを測定可能な成長へ。',
  primary_button_label_ja = '実績を見る',
  secondary_button_label_ja = 'つながる',
  hero_image_alt_ja = 'ヒーロー画像'
WHERE id = 1;
