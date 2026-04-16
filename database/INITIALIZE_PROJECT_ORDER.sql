-- Initialize order_index for projects based on created_at (newest first)
-- This ensures projects are ordered by creation date if order_index is not manually set

UPDATE public.projects
SET order_index = (
  SELECT COUNT(*) - 1
  FROM public.projects p2
  WHERE p2.created_at >= public.projects.created_at
)
WHERE order_index = 0 OR order_index IS NULL;

-- Verify the update
SELECT id, title, order_index, created_at 
FROM public.projects 
ORDER BY order_index ASC;
