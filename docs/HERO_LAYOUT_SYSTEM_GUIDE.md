# Hero Layout System Implementation Guide

## Overview

This guide documents the complete hero layout system that allows admins to choose different UI layouts for the hero section and customize their behavior dynamically.

## Architecture

### Database Schema

**hero_layouts table:**

- `layout_key` (unique): Identifier for the layout (e.g., "split-left-image-right")
- `layout_name`: Display name (e.g., "Split Layout")
- `description`: Brief description
- `preview_image_url`: Preview image for admin UI
- `default_config` (jsonb): Default configuration values
- `supported_fields` (jsonb): Fields supported by this layout
- `order_index`: Display order
- `is_active`: Whether layout is available

**hero_sections table (updated):**

- `selected_layout_key`: Currently selected layout
- `layout_config` (jsonb): Current layout configuration

### Pre-seeded Layouts

1. **split-left-image-right** (Default)
   - Text on left, image on right
   - Config: `textAlign`, `imagePosition`, `height`

2. **centered-minimal**
   - Centered text, minimal design
   - Config: `textAlign`, `maxWidth`, `showImage`

3. **full-background**
   - Full background image with overlay
   - Config: `overlay`, `overlayOpacity`, `textAlign`

4. **card-overlay**
   - Background image with card overlay
   - Config: `card`, `cardShadow`, `textAlign`

## Admin UI (3 Parts)

### Part 1: Hero Content

Edit hero section content (existing functionality):

- Badge, titles, description
- Button labels and URLs
- Hero image upload

### Part 2: Layout Selector

Visual grid of available layouts:

- Click to select layout
- Shows preview image, name, description
- Highlights currently selected layout
- Updates `selected_layout_key`

### Part 3: Layout Settings

Dynamic form based on selected layout:

- Renders form fields from `default_config`
- Supports boolean (checkbox), number (range), string (input)
- Updates `layout_config` in real-time
- Changes persist on save

## Frontend Components

### Layout Components

Located in `src/components/hero-layouts/`:

1. **HeroSplitLayout.tsx**
   - Two-column grid layout
   - Configurable text/image positioning
   - Supports fullscreen height

2. **HeroCenteredLayout.tsx**
   - Centered content
   - Optional image below text
   - Configurable max-width

3. **HeroBackgroundLayout.tsx**
   - Full background image
   - Overlay with opacity control
   - Text overlay on image

4. **HeroCardOverlayLayout.tsx**
   - Background image with card
   - White card with content
   - Optional shadow effect

### Layout Mapping

`src/components/hero-layouts/index.ts` exports:

- `heroLayoutMap`: Maps layout keys to components
- `getHeroLayout()`: Returns component for given layout key
- Fallback to `HeroSplitLayout` if layout not found

### Dynamic Rendering

`src/components/HeroSection.tsx`:

```typescript
const layoutKey = hero.selected_layout_key || "split-left-image-right";
const layoutConfig = hero.layout_config || {};
const HeroLayoutComponent = getHeroLayout(layoutKey);

return (
  <HeroLayoutComponent
    content={hero}
    config={layoutConfig}
    langSuffix={langSuffix}
  />
);
```

## API Queries

New functions in `src/lib/supabase-queries.ts`:

```typescript
// Fetch all active layouts
getHeroLayouts(): Promise<HeroLayout[]>

// Get specific layout by key
getHeroLayoutByKey(layoutKey: string): Promise<HeroLayout | null>

// Update layout config and selected layout
updateHeroLayoutConfig(config, layoutKey): Promise<HeroSection>
```

## Types

`src/types/admin.ts`:

```typescript
interface HeroLayout {
  id: string;
  layout_key: string;
  layout_name: string;
  description: string;
  preview_image_url: string;
  default_config: Record<string, any>;
  supported_fields: Record<string, any>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HeroSectionWithLayout extends HeroSection {
  selected_layout_key?: string;
  layout_config?: Record<string, any>;
}
```

## Usage Flow

### Admin Workflow

1. Navigate to Hero Management page
2. Edit hero content (Part 1) - same as before
3. Select layout (Part 2) - click layout card
4. Configure layout (Part 3) - adjust settings
5. Click Save - persists all changes

### Frontend Workflow

1. Fetch hero section data
2. Get `selected_layout_key` and `layout_config`
3. Resolve layout component from map
4. Render component with content and config
5. Component applies config to styling/layout

## Adding New Layouts

### Step 1: Create Layout Component

Create `src/components/hero-layouts/HeroNewLayout.tsx`:

```typescript
import type { HeroSectionWithLayout } from "@/types/admin";

interface HeroNewLayoutProps {
  content: HeroSectionWithLayout;
  config: Record<string, any>;
  langSuffix: string;
}

export const HeroNewLayout = ({
  content,
  config,
  langSuffix,
}: HeroNewLayoutProps) => {
  // Your layout implementation
  return <section>...</section>;
};
```

### Step 2: Register in Layout Map

Update `src/components/hero-layouts/index.ts`:

```typescript
import { HeroNewLayout } from "./HeroNewLayout";

export const heroLayoutMap: Record<string, HeroLayoutComponent> = {
  // ... existing layouts
  "new-layout-key": HeroNewLayout,
};
```

### Step 3: Add to Database

Insert into `hero_layouts` table:

```sql
INSERT INTO public.hero_layouts (
  layout_key,
  layout_name,
  description,
  default_config,
  order_index
)
VALUES (
  'new-layout-key',
  'New Layout Name',
  'Description',
  '{"setting1": "value1", "setting2": true}',
  5
);
```

## Configuration Examples

### Split Layout Config

```json
{
  "textAlign": "left",
  "imagePosition": "right",
  "height": "fullscreen"
}
```

### Centered Layout Config

```json
{
  "textAlign": "center",
  "maxWidth": "md",
  "showImage": false
}
```

### Full Background Config

```json
{
  "overlay": true,
  "overlayOpacity": 0.4,
  "textAlign": "center"
}
```

### Card Overlay Config

```json
{
  "card": true,
  "cardShadow": true,
  "textAlign": "left"
}
```

## Best Practices

1. **Keep configs simple** - Use basic types (string, number, boolean)
2. **Provide defaults** - Always set sensible defaults in `default_config`
3. **Responsive design** - Ensure layouts work on mobile/tablet/desktop
4. **Accessibility** - Maintain proper contrast, semantic HTML, alt text
5. **Performance** - Lazy load images, optimize animations
6. **Consistency** - Use existing design tokens (colors, spacing, fonts)

## Troubleshooting

### Layout not rendering

- Check `selected_layout_key` is set in database
- Verify layout component is registered in `heroLayoutMap`
- Check browser console for errors

### Config not applying

- Ensure `layout_config` is valid JSON
- Verify config keys match component expectations
- Check component is reading config correctly

### Admin UI not loading layouts

- Verify `getHeroLayouts()` query works
- Check `is_active = true` for layouts
- Ensure RLS policies allow authenticated access

## Future Enhancements

- [ ] Layout preview in admin before save
- [ ] Smooth transitions when switching layouts
- [ ] Mobile-specific layout variants
- [ ] Layout-specific animation options
- [ ] A/B testing different layouts
- [ ] Layout analytics/performance tracking
