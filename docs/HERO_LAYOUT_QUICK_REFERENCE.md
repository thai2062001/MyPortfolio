# Hero Layout System - Quick Reference

## File Structure

```
src/
├── components/
│   ├── HeroSection.tsx (UPDATED - dynamic rendering)
│   └── hero-layouts/ (NEW)
│       ├── HeroSplitLayout.tsx
│       ├── HeroCenteredLayout.tsx
│       ├── HeroBackgroundLayout.tsx
│       ├── HeroCardOverlayLayout.tsx
│       └── index.ts (layout registry)
├── pages/admin/
│   └── HeroManagement.tsx (UPDATED - 3-part UI)
├── types/
│   └── admin.ts (UPDATED - new types)
└── lib/
    └── supabase-queries.ts (UPDATED - new queries)
```

## Component Props

All layout components accept:

```typescript
{
  content: HeroSectionWithLayout,    // Hero data with layout fields
  config: Record<string, any>,       // Layout configuration
  langSuffix: string                 // "_en" or "_ja"
}
```

## Layout Registry

```typescript
// Get layout component
const Component = getHeroLayout(layoutKey);

// Available keys:
// - "split-left-image-right" (default)
// - "centered-minimal"
// - "full-background"
// - "card-overlay"
```

## Database Queries

```typescript
// Fetch all active layouts
const layouts = await getHeroLayouts();

// Get specific layout
const layout = await getHeroLayoutByKey("split-left-image-right");

// Update layout selection and config
await updateHeroLayoutConfig(config, layoutKey);

// Get hero section (includes layout fields)
const hero = await getHeroSection();
```

## Admin UI Sections

### Part 1: Hero Content

- Badge, titles, description
- Button labels and URLs
- Image upload
- Language tabs (EN/JA)

### Part 2: Layout Selector

- Grid of layout cards
- Click to select
- Shows: preview, name, description
- Highlights current selection

### Part 3: Layout Settings

- Dynamic form from `default_config`
- Boolean → checkbox
- Number → range slider
- String → text input

## Frontend Rendering

```typescript
// In HeroSection.tsx
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

## Adding a New Layout

### 1. Create Component

```typescript
// src/components/hero-layouts/HeroNewLayout.tsx
export const HeroNewLayout = ({ content, config, langSuffix }) => {
  // Implementation
};
```

### 2. Register

```typescript
// src/components/hero-layouts/index.ts
export const heroLayoutMap = {
  // ...
  "new-layout-key": HeroNewLayout,
};
```

### 3. Add to Database

```sql
INSERT INTO public.hero_layouts (
  layout_key, layout_name, description, default_config, order_index
) VALUES (
  'new-layout-key', 'New Layout', 'Description', '{}', 5
);
```

## Configuration Examples

### Boolean Config

```json
{ "overlay": true }
```

Renders as checkbox in admin

### Number Config

```json
{ "overlayOpacity": 0.4 }
```

Renders as range slider (0-1)

### String Config

```json
{ "textAlign": "center" }
```

Renders as text input

## Common Patterns

### Conditional Rendering

```typescript
if (config.showImage && content.hero_image_url) {
  // Show image
}
```

### Dynamic Classes

```typescript
const textAlignClass =
  config.textAlign === "center" ? "text-center" : "text-left";
```

### Config with Defaults

```typescript
const overlay = config.overlay !== false; // Default true
const opacity = config.overlayOpacity || 0.4; // Default 0.4
```

## Types

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

## Debugging

### Check Current Layout

```typescript
console.log("Layout Key:", hero.selected_layout_key);
console.log("Config:", hero.layout_config);
```

### Verify Component Exists

```typescript
const Component = getHeroLayout(layoutKey);
console.log("Component:", Component.name);
```

### Check Database

```sql
SELECT layout_key, layout_name, is_active
FROM public.hero_layouts
ORDER BY order_index;
```

## Performance Tips

1. **Lazy load images** - Use `loading="lazy"` on img tags
2. **Memoize components** - Use `React.memo()` for layout components
3. **Optimize animations** - Use `will-change` CSS sparingly
4. **Cache layouts** - Layouts are static, cache in memory

## Accessibility

- Use semantic HTML (`<section>`, `<h1>`, etc.)
- Maintain color contrast (WCAG AA minimum)
- Include alt text for images
- Use proper heading hierarchy
- Support keyboard navigation

## Testing

```typescript
// Test layout selection
const layout = layouts.find(l => l.layout_key === "centered-minimal");
expect(layout).toBeDefined();

// Test config update
const newConfig = { textAlign: "center" };
await updateHeroLayoutConfig(newConfig, "centered-minimal");

// Test rendering
const { getByText } = render(<HeroSection />);
expect(getByText(/badge/i)).toBeInTheDocument();
```

## Troubleshooting

| Issue                | Solution                           |
| -------------------- | ---------------------------------- |
| Layout not rendering | Check `selected_layout_key` in DB  |
| Config not applying  | Verify config keys match component |
| Admin UI not loading | Check `getHeroLayouts()` query     |
| Type errors          | Ensure types imported correctly    |
| Styling issues       | Check Tailwind classes applied     |

## Resources

- Full Guide: `HERO_LAYOUT_SYSTEM_GUIDE.md`
- Implementation: `HERO_LAYOUT_IMPLEMENTATION_SUMMARY.md`
- SQL Examples: `HERO_LAYOUTS_EXAMPLES.sql`
- Components: `src/components/hero-layouts/`
