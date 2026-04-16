# Timeline Section - Usage Guide

## Quick Start

The Timeline section now automatically loads images from the `timeline_phase_images` table and renders them in editorial compositions based on image count.

### No Code Changes Required

If you're using the existing Timeline component, it will automatically:

1. Fetch published timeline phases
2. Load all related images
3. Render appropriate composition based on image count
4. Fall back to legacy `image_url` if needed

## Admin Dashboard Usage

### Adding Images to a Timeline Phase

1. Go to **Admin Dashboard** → **Timeline Management**
2. Click **Edit** on a timeline phase
3. Scroll to the **Gallery** section
4. Click **Upload Multiple Images**
5. Select multiple images at once
6. Images upload to Cloudinary automatically
7. Hover over images to:
   - **Set Cover** - Mark as primary image (appears first)
   - **Delete** - Remove from gallery

### Image Priority

Images are displayed in this order:

1. Image with `is_cover = true` (primary image)
2. Remaining images sorted by `order_index`

### Best Practices

**For 1 Image:**

- Use a strong, impactful image
- 4:3 aspect ratio recommended
- Will display as main focal point

**For 2 Images:**

- First image: main story image (4:3)
- Second image: supporting detail (3:2)
- Creates visual hierarchy with offset layout

**For 3+ Images:**

- First image: hero/dominant image (4:3)
- Images 2-3: supporting images (3:2 each)
- Creates editorial, magazine-like feel
- Only first 3 images shown in timeline

**Image Specifications:**

- Format: JPG, PNG, WebP
- Min width: 600px
- Aspect ratios: 4:3 or 3:2 recommended
- Cloudinary auto-converts to WebP

## Component API

### TimelinePhaseImageComposition

```typescript
interface TimelinePhaseImageCompositionProps {
  images: TimelinePhaseImage[];
  fallbackImage?: string;
  title: string;
  align: "left" | "right";
}
```

**Usage:**

```tsx
<TimelinePhaseImageComposition
  images={phase.images || []}
  fallbackImage={phase.image_url}
  title={phase.title_en}
  align="left"
/>
```

### TimelinePhase

```typescript
interface TimelinePhaseProps {
  period: string;
  location: string;
  title: string;
  company?: string;
  description: string;
  images?: TimelinePhaseImage[];
  image?: string; // legacy fallback
  index: number;
  isLast?: boolean;
  tag?: string;
}
```

### TimelineSection

Automatically handles all data fetching and rendering. No props needed.

```tsx
<TimelineSection />
```

## Data Flow

```
TimelineSection
├── Fetch timeline_phases (published only)
├── Fetch timeline_phase_images (for all phases)
├── Enrich phases with images
└── Render TimelinePhase components
    └── Each TimelinePhase renders TimelinePhaseImageComposition
        └── Composition chooses layout based on image count
```

## Responsive Behavior

### Desktop (md and above)

- Alternating left/right layout maintained
- Full editorial compositions displayed
- Images at full size

### Tablet (sm to md)

- Timeline stacks vertically
- Images adapt to container width
- Compositions remain readable

### Mobile (below sm)

- Single column layout
- Images scale to screen width
- Touch-friendly spacing

## Styling Customization

### Image Container Classes

```tsx
// Main image container
<div className="overflow-hidden aspect-[4/3] max-w-sm">

// Supporting image container
<div className="overflow-hidden aspect-[3/2] max-w-xs">

// Grid for 3+ images
<div className="grid grid-cols-2 gap-3">
```

### Tailwind Classes Used

- `aspect-[4/3]` - 4:3 aspect ratio
- `aspect-[3/2]` - 3:2 aspect ratio
- `max-w-sm` - Max width 24rem
- `max-w-xs` - Max width 20rem
- `gap-3` - 12px gap between images
- `object-cover` - Image fill behavior

### Customization Example

To change image spacing or sizing:

```tsx
// In TimelinePhaseImageComposition.tsx
// Change gap-3 to gap-4 for more spacing
<div className="grid grid-cols-2 gap-4">

// Change max-w-sm to max-w-md for larger images
<div className={`max-w-md ${containerClass}`}>
```

## Database Queries

### Fetch Timeline with Images

```sql
-- Get published phases with images
SELECT
  tp.*,
  json_agg(
    json_build_object(
      'id', tpi.id,
      'image_url', tpi.image_url,
      'alt_text', tpi.alt_text,
      'caption', tpi.caption,
      'is_cover', tpi.is_cover,
      'order_index', tpi.order_index
    ) ORDER BY tpi.order_index
  ) as images
FROM timeline_phases tp
LEFT JOIN timeline_phase_images tpi ON tp.id = tpi.phase_id
WHERE tp.is_published = true
GROUP BY tp.id
ORDER BY tp.order_index;
```

### Add Image to Phase

```sql
INSERT INTO timeline_phase_images (
  phase_id,
  image_url,
  alt_text,
  caption,
  is_cover,
  order_index
) VALUES (
  'phase-id-here',
  'https://cloudinary.com/...',
  'Image description',
  'Optional caption',
  false,
  0
);
```

### Set Image as Cover

```sql
-- Remove cover from all images of this phase
UPDATE timeline_phase_images
SET is_cover = false
WHERE phase_id = 'phase-id-here';

-- Set specific image as cover
UPDATE timeline_phase_images
SET is_cover = true
WHERE id = 'image-id-here';
```

## Troubleshooting

### Images Not Showing

1. Check if `timeline_phase_images` table exists
2. Verify images have `is_published = true` on parent phase
3. Check Cloudinary URLs are accessible
4. Verify `phase_id` references correct phase

### Wrong Image Order

1. Check `order_index` values in database
2. Verify `is_cover` is set correctly on primary image
3. Images should be sorted by `order_index` ascending

### Composition Not Matching Expected Layout

1. Count images in database for that phase
2. Verify image count matches expected case (1, 2, 3+)
3. Check if fallback `image_url` is being used instead

### Performance Issues

1. Verify images are optimized (Cloudinary handles this)
2. Check lazy loading is working (browser DevTools)
3. Reduce number of phases loaded at once if needed

## Migration from Old Timeline

### If You Have Existing Single Images

No action needed! The system automatically:

1. Detects `image_url` field
2. Uses it as fallback if no gallery images exist
3. Renders as Case A (single image)

### To Migrate to Multi-Image

1. Go to admin dashboard
2. Edit each timeline phase
3. Upload additional images in Gallery section
4. Set primary image as cover
5. Images automatically appear in new composition

## Performance Tips

1. **Image Optimization**
   - Cloudinary auto-converts to WebP
   - Use reasonable image dimensions (600px+ width)
   - Avoid extremely large files

2. **Lazy Loading**
   - All images use `loading="lazy"`
   - Images only load when scrolled into view
   - Reduces initial page load

3. **Database Queries**
   - Single query per table type
   - Efficient filtering by `is_published`
   - Indexed by `order_index`

## Accessibility

- All images have `alt` text from database
- Falls back to title if alt text missing
- Semantic HTML structure maintained
- Proper heading hierarchy preserved
- Color contrast maintained in design

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support
- IE11: Not supported (uses modern CSS)

## Future Enhancements

Potential improvements:

1. Image captions displayed below images
2. Lightbox modal for full-size viewing
3. Image transition animations
4. Video embed support
5. Advanced admin filters
6. Batch image operations
