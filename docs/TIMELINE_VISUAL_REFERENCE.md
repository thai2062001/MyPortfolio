# Timeline Section - Visual Reference Guide

## Layout Compositions

### Case A: Single Image (1 Image)

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│          Main Image (4:3)               │
│          600x450px minimum              │
│                                         │
│                                         │
└─────────────────────────────────────────┘

CSS Classes:
- Container: overflow-hidden aspect-[4/3] max-w-sm
- Image: w-full h-full object-cover
- Alignment: ml-auto (right) or default (left)

Use Case:
- Strong, impactful single moment
- Iconic image that tells the story
- Minimal visual clutter
```

### Case B: Two Images (2 Images)

```
┌─────────────────────────────────────────┐
│                                         │
│          Main Image (4:3)               │
│          600x450px minimum              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    Supporting Image (3:2)               │
│    480x320px minimum                    │
│                                         │
└─────────────────────────────────────────┘

CSS Classes:
- Container: space-y-4 max-w-sm
- Main: overflow-hidden aspect-[4/3]
- Supporting: overflow-hidden aspect-[3/2] max-w-xs
- Gap: 16px (space-y-4)

Use Case:
- Main story image + supporting detail
- Before/after comparison
- Context + close-up
- Creates visual hierarchy
```

### Case C: Three+ Images (3+ Images)

```
┌─────────────────────────────────────────┐
│                                         │
│          Hero Image (4:3)               │
│          600x450px minimum              │
│                                         │
├────────────────┬────────────────────────┤
│                │                        │
│ Support (3:2)  │  Support (3:2)         │
│ 240x160px      │  240x160px             │
│                │                        │
└────────────────┴────────────────────────┘

CSS Classes:
- Container: max-w-sm
- Hero: overflow-hidden aspect-[4/3] mb-4
- Grid: grid grid-cols-2 gap-3
- Support: overflow-hidden aspect-[3/2]
- Gap: 12px (gap-3)

Use Case:
- Rich editorial storytelling
- Multiple perspectives
- Magazine-like layout
- Professional composition
```

## Responsive Behavior

### Desktop (1024px+)

```
Timeline Layout:
├─ Even phases (0, 2, 4...)
│  └─ Left: Content + Images (text-right)
│  └─ Center: Timeline dot
│  └─ Right: Empty
│
└─ Odd phases (1, 3, 5...)
   └─ Left: Empty
   └─ Center: Timeline dot
   └─ Right: Content + Images (text-left)

Image Sizes:
- Main: 600x450px (4:3)
- Supporting: 480x320px (3:2)
- Grid items: 240x160px (3:2)

Spacing:
- Gap between phases: 80px (md:mb-20)
- Gap between images: 16px (space-y-4) or 12px (gap-3)
```

### Tablet (768px - 1023px)

```
Timeline Layout:
├─ All phases stack vertically
├─ Content on right side
├─ Timeline dot in center
└─ Images below content

Image Sizes:
- Main: 500x375px (4:3)
- Supporting: 400x267px (3:2)
- Grid items: 200x133px (3:2)

Spacing:
- Gap between phases: 60px (md:mb-20)
- Reduced padding
```

### Mobile (< 768px)

```
Timeline Layout:
├─ All phases stack vertically
├─ Content on right side
├─ Timeline dot in center
└─ Images below content

Image Sizes:
- Main: 100% width (max 600px)
- Supporting: 100% width (max 480px)
- Grid items: 50% width each

Spacing:
- Gap between phases: 40px (mb-16)
- Reduced padding
- Touch-friendly spacing
```

## Color & Typography

### Text Elements

```
Period:
- Font: font-display italic
- Color: text-gold
- Size: text-lg
- Tracking: tracking-wide

Location:
- Font: uppercase
- Color: text-muted-foreground
- Size: text-xs
- Tracking: tracking-widest

Title:
- Font: font-display
- Size: text-3xl
- Weight: font-light
- Color: text-foreground
- Line height: leading-tight

Company:
- Font: uppercase
- Color: text-muted-foreground
- Size: text-sm
- Tracking: tracking-widest

Description:
- Font: default
- Color: text-muted-foreground
- Size: text-sm
- Line height: leading-relaxed
- Max width: max-w-sm

Tag:
- Font: uppercase
- Size: text-[10px]
- Tracking: tracking-[0.2em]
- Background: bg-gold-light
- Border: border border-border
- Padding: px-3 py-1
```

### Timeline Elements

```
Timeline Dot:
- Size: w-2.5 h-2.5 (mobile) or w-3 h-3 (desktop)
- Color: bg-sage
- Shape: rounded-full
- Z-index: z-10

Timeline Line:
- Width: w-px (1px)
- Style: border-l border-dashed
- Color: border-timeline
- Extends between dots

End Marker:
- Dot: w-2 h-2 rounded-full bg-muted-foreground
- Line: w-px h-12 border-l border-dashed border-timeline
- Text: text-[10px] uppercase tracking-[0.25em] text-muted-foreground
```

## Image Aspect Ratios

### 4:3 Ratio (Main Images)

```
Width: 600px → Height: 450px
Width: 500px → Height: 375px
Width: 400px → Height: 300px
Width: 300px → Height: 225px

CSS: aspect-[4/3]
```

### 3:2 Ratio (Supporting Images)

```
Width: 480px → Height: 320px
Width: 400px → Height: 267px
Width: 300px → Height: 200px
Width: 240px → Height: 160px

CSS: aspect-[3/2]
```

## Spacing System

### Vertical Spacing

```
Between phases: 80px (md:mb-20) / 60px (mb-16)
Between images: 16px (space-y-4)
Between grid items: 12px (gap-3)
Image to text: 20px (mb-5)
Text sections: 16px (mb-4)
```

### Horizontal Spacing

```
Timeline gap: 16px (md:gap-8) / 16px (gap-4)
Container padding: 24px (px-6)
Max width: 56rem (max-w-4xl)
Image max width: 24rem (max-w-sm)
Supporting max width: 20rem (max-w-xs)
```

## Animation & Transitions

### Fade In Animation

```
Initial State:
- opacity: 0
- transform: translateY(16px)

Final State:
- opacity: 1
- transform: translateY(0)

Duration: 0.7s
Easing: ease
Trigger: Intersection Observer (threshold: 0.15)
```

### Hero Section Animation

```
Initial State:
- opacity: 0
- transform: translateY(16px)

Final State:
- opacity: 1
- transform: translateY(0)

Duration: 1s
Easing: ease
Delay: 100ms
```

### Image Lazy Loading

```
Attribute: loading="lazy"
Behavior: Images load when scrolled into view
Performance: Reduces initial page load
```

## Hover States

### Image Hover (Admin Gallery)

```
Normal State:
- opacity: 1
- background: transparent

Hover State:
- overlay: bg-black/50
- opacity: 100
- buttons: visible
- transition: opacity 0.3s

Buttons:
- Set Cover: bg-sage text-white
- Delete: bg-red-600 text-white
```

## Responsive Breakpoints

```
Mobile: < 768px (sm)
├─ Single column layout
├─ Images full width
├─ Reduced spacing
└─ Touch-friendly

Tablet: 768px - 1023px (md)
├─ Alternating layout starts
├─ Images adapt to width
├─ Medium spacing
└─ Hybrid layout

Desktop: 1024px+ (lg)
├─ Full alternating layout
├─ Full image sizes
├─ Full spacing
└─ Optimal experience
```

## Accessibility Features

### Color Contrast

```
Text on background: 4.5:1 (WCAG AA)
Text on images: Maintained with overlays
Links: Underlined or color + underline
Focus indicators: Visible (2px outline)
```

### Text Alternatives

```
All images: alt text from database
Fallback: Uses title if alt text missing
Semantic: Proper heading hierarchy
Labels: All form inputs labeled
```

### Keyboard Navigation

```
Tab order: Logical flow
Focus visible: Yes
Skip links: Available
Keyboard accessible: All interactive elements
```

## Dark Mode Support

```
Background: bg-background
Text: text-foreground
Muted text: text-muted-foreground
Borders: border-border
Accents: text-gold, bg-gold-light
Timeline: border-timeline
```

## Print Styles

```
Images: Visible at full size
Timeline: Simplified (no animations)
Colors: Optimized for print
Spacing: Adjusted for paper
Page breaks: Handled gracefully
```

## Performance Optimizations

### Image Optimization

```
Format: WebP (Cloudinary)
Lazy loading: Yes
Responsive images: Yes
Compression: Automatic
Caching: Browser + CDN
```

### CSS Optimization

```
Utility classes: Tailwind
Minified: Yes
Unused CSS: Removed
Critical CSS: Inlined
```

### JavaScript Optimization

```
Intersection Observer: Used
Lazy loading: Implemented
Debouncing: Applied
Memoization: Used where needed
```

## Browser Support

```
Chrome/Edge: Full support
Firefox: Full support
Safari: Full support
Mobile browsers: Full support
IE11: Not supported
```

## Testing Checklist

### Visual Testing

- [ ] 1 image layout renders correctly
- [ ] 2 image layout renders correctly
- [ ] 3+ image layout renders correctly
- [ ] Images display at correct sizes
- [ ] Spacing is consistent
- [ ] Colors are correct
- [ ] Typography is correct

### Responsive Testing

- [ ] Desktop layout correct
- [ ] Tablet layout correct
- [ ] Mobile layout correct
- [ ] Images scale properly
- [ ] Text is readable
- [ ] No horizontal scroll

### Animation Testing

- [ ] Fade in animation works
- [ ] Intersection observer triggers
- [ ] Animations are smooth
- [ ] No jank or stuttering
- [ ] Performance is good

### Accessibility Testing

- [ ] Alt text present
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Screen reader compatible

---

This visual reference guide provides detailed specifications for implementing and maintaining the Timeline section design.
