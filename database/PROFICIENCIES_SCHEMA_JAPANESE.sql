-- =========================================================
-- Proficiencies Section Schema Update - Japanese Support
-- Thêm các cột tiếng Nhật cho expertise_sections
-- =========================================================

-- 1) Thêm các cột tiếng Nhật vào expertise_sections
ALTER TABLE public.expertise_sections
ADD COLUMN IF NOT EXISTS eyebrow_ja text,
ADD COLUMN IF NOT EXISTS title_ja text,
ADD COLUMN IF NOT EXISTS strategic_title_ja text,
ADD COLUMN IF NOT EXISTS strategic_description_ja text,
ADD COLUMN IF NOT EXISTS strategic_helper_text_ja text,
ADD COLUMN IF NOT EXISTS tools_title_ja text,
ADD COLUMN IF NOT EXISTS tools_helper_text_ja text;

-- 2) Thêm các cột tiếng Nhật vào expertise_strategic_skills
ALTER TABLE public.expertise_strategic_skills
ADD COLUMN IF NOT EXISTS skill_name_ja text,
ADD COLUMN IF NOT EXISTS description_ja text;

-- 3) Thêm các cột tiếng Nhật vào expertise_tool_items
ALTER TABLE public.expertise_tool_items
ADD COLUMN IF NOT EXISTS tool_name_ja text,
ADD COLUMN IF NOT EXISTS description_ja text;

-- =========================================================
-- Update giá trị mặc định (Japanese translations)
-- =========================================================

-- Update expertise_sections với giá trị tiếng Nhật
UPDATE public.expertise_sections
SET 
  eyebrow_ja = 'プロフィシエンシー',
  title_ja = '専門知識とツール',
  strategic_title_ja = '戦略的スキル',
  strategic_description_ja = '概念的アーキテクチャと運用上の卓越性を融合させ、測定可能な成果を生み出します。',
  strategic_helper_text_ja = '',
  tools_title_ja = '技術ツール',
  tools_helper_text_ja = 'ツールにマウスを置くと、それがどのように結果をもたらすかが表示されます ↓'
WHERE id = 1;

-- =========================================================
-- Notes
-- =========================================================
-- - eyebrow_ja: 小見出し（例：プロフィシエンシー）
-- - title_ja: メインタイトル（例：専門知識とツール）
-- - strategic_title_ja: 戦略的スキルのタイトル
-- - strategic_description_ja: 戦略的スキルの説明文
-- - tools_title_ja: 技術ツールのタイトル
-- - tools_helper_text_ja: ツールセクションのヘルパーテキスト
-- - skill_name_ja: スキル名（日本語）
-- - description_ja: スキルの説明（日本語）
-- - tool_name_ja: ツール名（日本語）
-- - description_ja: ツールの説明（日本語）
