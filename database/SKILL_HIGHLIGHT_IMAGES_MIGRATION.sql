-- Migration: Skill Highlight Images Table
-- This table stores images for each skill highlight

-- The table is already created in the schema
-- No migration needed - just verify the structure

-- Verify the table exists and has correct structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'skill_highlight_images'
ORDER BY ordinal_position;

-- Verify indexes exist
SELECT indexname FROM pg_indexes 
WHERE tablename = 'skill_highlight_images';

-- Verify RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'skill_highlight_images';

