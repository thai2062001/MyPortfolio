-- =========================================================
-- Project Images Management
-- Supabase SQL for managing project gallery images
-- IMPORTANT: Replace placeholders with actual UUIDs from your database
-- =========================================================

-- =========================================================
-- 1) View all projects with their IDs (to get project_id)
-- =========================================================
SELECT id, title, slug FROM projects ORDER BY created_at DESC;

-- =========================================================
-- 2) View all images for a specific project
-- Replace 'don-quijote-campaign' with actual project slug
-- =========================================================
SELECT 
  pi.id,
  pi.project_id,
  pi.image_url,
  pi.alt_text,
  pi.caption,
  pi.is_cover,
  pi.order_index,
  pi.created_at
FROM project_images pi
JOIN projects p ON pi.project_id = p.id
WHERE p.slug = 'don-quijote-campaign'
ORDER BY pi.order_index ASC;

-- =========================================================
-- 3) Count images per project
-- =========================================================
SELECT 
  p.id,
  p.title,
  p.slug,
  COUNT(pi.id) as image_count
FROM projects p
LEFT JOIN project_images pi ON p.id = pi.project_id
GROUP BY p.id, p.title, p.slug
ORDER BY image_count DESC;

-- =========================================================
-- 4) Find projects without cover images
-- =========================================================
SELECT DISTINCT p.id, p.title, p.slug
FROM projects p
WHERE NOT EXISTS (
  SELECT 1 FROM project_images pi 
  WHERE pi.project_id = p.id AND pi.is_cover = true
);

-- =========================================================
-- 5) Update image order (reorder gallery)
-- Get image IDs from query #2, then update order_index
-- =========================================================
-- Example: Set first image order to 0
-- UPDATE project_images
-- SET order_index = 0
-- WHERE id = (SELECT id FROM project_images WHERE project_id = (SELECT id FROM projects WHERE slug = 'don-quijote-campaign') LIMIT 1);

-- =========================================================
-- 6) Set an image as cover image
-- First, unset all cover images for this project
-- =========================================================
-- UPDATE project_images
-- SET is_cover = false
-- WHERE project_id = (SELECT id FROM projects WHERE slug = 'don-quijote-campaign');

-- Then set the new cover image (get image id from query #2)
-- UPDATE project_images
-- SET is_cover = true
-- WHERE id = 'PASTE_IMAGE_ID_HERE';

-- =========================================================
-- 7) Update image metadata (alt text, caption)
-- =========================================================
-- UPDATE project_images
-- SET 
--   alt_text = 'New alt text',
--   caption = 'New caption'
-- WHERE id = 'PASTE_IMAGE_ID_HERE';

-- =========================================================
-- 8) Delete a single image
-- =========================================================
-- DELETE FROM project_images
-- WHERE id = 'PASTE_IMAGE_ID_HERE';

-- =========================================================
-- 9) Delete all images for a project
-- =========================================================
-- DELETE FROM project_images
-- WHERE project_id = (SELECT id FROM projects WHERE slug = 'don-quijote-campaign');
