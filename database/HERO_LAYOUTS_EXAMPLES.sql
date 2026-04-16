-- Hero Layouts Examples
-- This file shows how to add new layouts to the system

-- View all active layouts
SELECT * FROM public.hero_layouts WHERE is_active = true ORDER BY order_index;

-- View current hero section layout
SELECT 
  selected_layout_key,
  layout_config,
  (SELECT layout_name FROM public.hero_layouts WHERE layout_key = hero_sections.selected_layout_key) as layout_name
FROM public.hero_sections
WHERE id = 1;

-- =========================================================
-- Example: Add a new "Sidebar" layout
-- =========================================================
INSERT INTO public.hero_layouts (
  layout_key,
  layout_name,
  description,
  preview_image_url,
  default_config,
  supported_fields,
  order_index,
  is_active
)
VALUES (
  'sidebar-image-left',
  'Sidebar Layout',
  'Image on left sidebar, content on right',
  '',
  '{
    "sidebarWidth": "30%",
    "imagePosition": "left",
    "textAlign": "left",
    "backgroundColor": "white"
  }',
  '{"sidebarWidth": "string", "imagePosition": "string", "textAlign": "string", "backgroundColor": "string"}',
  5,
  true
)
ON CONFLICT (layout_key) DO NOTHING;

-- =========================================================
-- Example: Add a new "Gradient Overlay" layout
-- =========================================================
INSERT INTO public.hero_layouts (
  layout_key,
  layout_name,
  description,
  preview_image_url,
  default_config,
  supported_fields,
  order_index,
  is_active
)
VALUES (
  'gradient-overlay',
  'Gradient Overlay',
  'Background image with gradient overlay',
  '',
  '{
    "gradientColor": "rgba(0,0,0,0.5)",
    "gradientAngle": "135deg",
    "textAlign": "center",
    "contentPosition": "center"
  }',
  '{"gradientColor": "string", "gradientAngle": "string", "textAlign": "string", "contentPosition": "string"}',
  6,
  true
)
ON CONFLICT (layout_key) DO NOTHING;

-- =========================================================
-- Example: Add a new "Asymmetric" layout
-- =========================================================
INSERT INTO public.hero_layouts (
  layout_key,
  layout_name,
  description,
  preview_image_url,
  default_config,
  supported_fields,
  order_index,
  is_active
)
VALUES (
  'asymmetric-split',
  'Asymmetric Split',
  'Unequal split with text taking 60%, image 40%',
  '',
  '{
    "textWidth": "60%",
    "imageWidth": "40%",
    "textAlign": "left",
    "verticalAlign": "center",
    "gap": "2rem"
  }',
  '{"textWidth": "string", "imageWidth": "string", "textAlign": "string", "verticalAlign": "string", "gap": "string"}',
  7,
  true
)
ON CONFLICT (layout_key) DO NOTHING;

-- =========================================================
-- Example: Add a new "Minimal Text Only" layout
-- =========================================================
INSERT INTO public.hero_layouts (
  layout_key,
  layout_name,
  description,
  preview_image_url,
  default_config,
  supported_fields,
  order_index,
  is_active
)
VALUES (
  'text-only-minimal',
  'Text Only Minimal',
  'Pure text layout, no image',
  '',
  '{
    "textAlign": "center",
    "maxWidth": "lg",
    "showImage": false,
    "backgroundColor": "transparent",
    "padding": "large"
  }',
  '{"textAlign": "string", "maxWidth": "string", "showImage": "boolean", "backgroundColor": "string", "padding": "string"}',
  8,
  true
)
ON CONFLICT (layout_key) DO NOTHING;

-- =========================================================
-- Example: Disable a layout
-- =========================================================
UPDATE public.hero_layouts
SET is_active = false
WHERE layout_key = 'centered-minimal';

-- =========================================================
-- Example: Update layout order
-- =========================================================
UPDATE public.hero_layouts
SET order_index = 1
WHERE layout_key = 'split-left-image-right';

UPDATE public.hero_layouts
SET order_index = 2
WHERE layout_key = 'centered-minimal';

UPDATE public.hero_layouts
SET order_index = 3
WHERE layout_key = 'full-background';

UPDATE public.hero_layouts
SET order_index = 4
WHERE layout_key = 'card-overlay';

-- =========================================================
-- Example: Switch hero to a different layout
-- =========================================================
UPDATE public.hero_sections
SET 
  selected_layout_key = 'centered-minimal',
  layout_config = '{
    "textAlign": "center",
    "maxWidth": "md",
    "showImage": false
  }'
WHERE id = 1;

-- =========================================================
-- Example: Update layout config for current layout
-- =========================================================
UPDATE public.hero_sections
SET layout_config = '{
  "overlay": true,
  "overlayOpacity": 0.6,
  "textAlign": "left"
}'
WHERE id = 1 AND selected_layout_key = 'full-background';

-- =========================================================
-- Example: Get layout with its current config
-- =========================================================
SELECT 
  hl.layout_key,
  hl.layout_name,
  hl.description,
  hl.default_config,
  hs.layout_config as current_config,
  hs.selected_layout_key
FROM public.hero_layouts hl
LEFT JOIN public.hero_sections hs ON hl.layout_key = hs.selected_layout_key
WHERE hl.is_active = true
ORDER BY hl.order_index;

-- =========================================================
-- Example: Reset layout to defaults
-- =========================================================
UPDATE public.hero_sections
SET layout_config = (
  SELECT default_config 
  FROM public.hero_layouts 
  WHERE layout_key = hero_sections.selected_layout_key
)
WHERE id = 1;

-- =========================================================
-- Example: Audit layout changes
-- =========================================================
SELECT 
  id,
  selected_layout_key,
  layout_config,
  updated_at
FROM public.hero_sections
WHERE id = 1;

-- =========================================================
-- Example: List all available layouts with stats
-- =========================================================
SELECT 
  layout_key,
  layout_name,
  description,
  is_active,
  order_index,
  jsonb_object_keys(default_config) as config_keys
FROM public.hero_layouts
ORDER BY order_index;
