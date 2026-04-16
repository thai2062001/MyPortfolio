# Timeline Editorial Image Compositions - Visual Guide

## Overview

The Timeline section now features premium editorial, asymmetric image compositions that create visual storytelling and portfolio-style layouts. Each composition adapts based on the timeline side (left/right) for optimal visual balance.

---

## Case 1: Single Image

### Visual Layout

```
┌─────────────────────────────┐
│                             │
│                             │
│      Dominant Image         │
│      (5:4 aspect ratio)     │
│      Clean & Elegant        │
│                             │
│                             │
└─────────────────────────────┘
```

### Characteristics

- Single strong, dominant image
- 5:4 aspect ratio (landscape, generous)
- Maximum width: 32rem (512px)
- Clean presentation
- No extra framing
- Elegant simplicity

### CSS Structure

```tsx
<div className="w-full max-w-lg">
  <div className="overflow-hidden aspect-[5/4] bg-gray-100">
    <img src={image} />
  </div>
</div>
```

### Use Case

- Iconic moment that stands alone
- Strong visual impact
- Minimal context needed
- Premium, curated feel

---

## Case 2: Two Images - Asymmetric Offset

### Visual Layout - LEFT SIDE (isReversed=false)

```
┌─────────────────────────────────────────┐
│                                         │
│  Large Main Image                       │
│  (60% width, full height)               │
│                                         │
│                                         │
│                    ┌──────────────────┐ │
│                    │ Small Supporting │ │
│                    │ (40% width)      │ │
│                    │ Offset bottom    │ │
│                    │ right with shadow│ │
│                    └──────────────────┘ │
└─────────────────────────────────────────┘
```

### Visual Layout - RIGHT SIDE (isReversed=true)

```
┌─────────────────────────────────────────┐
│                                         │
│                       Large Main Image  │
│                       (60% width,       │
│                       full height)      │
│                                         │
│ ┌──────────────────┐                    │
│ │ Small Supporting │                    │
│ │ (40% width)      │                    │
│ │ Offset bottom    │                    │
│ │ left with shadow │                    │
│ └──────────────────┘                    │
└─────────────────────────────────────────┘
```

### Characteristics

- **Main image:** 60% width, full height (5:4 aspect)
- **Supporting image:** 40% width, 40% height (square)
- **Offset:** Bottom corner (opposite side from main)
- **Shadow:** Subtle shadow on supporting image
- **Gap:** 24px (gap-6)
- **Height:** 384px (h-96)
- **Visual weight:** Strongly favors main image
- **Asymmetry:** Creates editorial tension

### CSS Structure

```tsx
// LEFT SIDE
<div className="relative h-96">
  {/* Large main image - left side */}
  <div className="absolute left-0 top-0 w-3/5 h-full overflow-hidden">
    <img src={mainImage} />
  </div>
  {/* Small supporting - bottom right, offset */}
  <div className="absolute right-0 bottom-0 w-2/5 h-2/5 overflow-hidden shadow-lg">
    <img src={supportingImage} />
  </div>
</div>

// RIGHT SIDE (isReversed=true)
<div className="relative h-96">
  {/* Large main image - right side */}
  <div className="absolute right-0 top-0 w-3/5 h-full overflow-hidden">
    <img src={mainImage} />
  </div>
  {/* Small supporting - bottom left, offset */}
  <div className="absolute left-0 bottom-0 w-2/5 h-2/5 overflow-hidden shadow-lg">
    <img src={supportingImage} />
  </div>
</div>
```

### Design Principles

- **Asymmetry:** Creates visual interest and movement
- **Offset:** Supporting image doesn't align with main
- **Shadow:** Adds depth and separation
- **Negative space:** Breathing room around composition
- **Visual hierarchy:** Main image dominates (60% vs 40%)
- **Editorial feel:** Like magazine spread or portfolio layout

### Use Case

- Main story image + supporting detail
- Before/after with emphasis on main
- Context + close-up
- Creates narrative flow

---

## Case 3+: Three Images - Editorial Magazine Spread

### Visual Layout - LEFT SIDE (isReversed=false)

```
┌──────────────────────────────────────────────┐
│                                              │
│  Hero Image (3:4)    Supporting 1 (square)   │
│  (60% width)         (40% width)             │
│  Tall & dominant     ┌──────────────┐        │
│                      │              │        │
│                      │              │        │
│                      └──────────────┘        │
│                      ┌──────────────┐        │
│                      │ Supporting 2 │        │
│                      │ (square)     │        │
│                      │              │        │
│                      └──────────────┘        │
│                                              │
└──────────────────────────────────────────────┘
```

### Visual Layout - RIGHT SIDE (isReversed=true)

```
┌──────────────────────────────────────────────┐
│                                              │
│  Supporting 1 (square)    Hero Image (3:4)   │
│  (40% width)              (60% width)        │
│  ┌──────────────┐         Tall & dominant    │
│  │              │                            │
│  │              │                            │
│  └──────────────┘                            │
│  ┌──────────────┐                            │
│  │ Supporting 2 │                            │
│  │ (square)     │                            │
│  │              │                            │
│  └──────────────┘                            │
│                                              │
└──────────────────────────────────────────────┘
```

### Characteristics

- **Hero image:** 60% width, 3:4 aspect ratio (tall, dominant)
- **Supporting images:** 40% width, stacked vertically
- **Each supporting:** Square aspect ratio (1:1)
- **Gap:** 24px between hero and supporting stack (gap-6)
- **Internal gap:** 16px between supporting images (gap-4)
- **Visual weight:** Hero dominates (60% vs 40%)
- **Asymmetry:** Hero on one side, stack on other
- **Magazine feel:** Like editorial spread or portfolio collage

### CSS Structure

```tsx
// LEFT SIDE
<div className="flex gap-6">
  {/* Hero image on left */}
  <div className="flex-1 overflow-hidden aspect-[3/4] bg-gray-100">
    <img src={heroImage} />
  </div>
  {/* Two supporting images stacked on right */}
  <div className="flex flex-col gap-4 w-2/5 flex-shrink-0">
    <div className="overflow-hidden aspect-square bg-gray-100">
      <img src={supporting1} />
    </div>
    <div className="overflow-hidden aspect-square bg-gray-100">
      <img src={supporting2} />
    </div>
  </div>
</div>

// RIGHT SIDE (isReversed=true)
<div className="flex gap-6">
  {/* Two supporting images stacked on left */}
  <div className="flex flex-col gap-4 w-2/5 flex-shrink-0">
    <div className="overflow-hidden aspect-square bg-gray-100">
      <img src={supporting1} />
    </div>
    <div className="overflow-hidden aspect-square bg-gray-100">
      <img src={supporting2} />
    </div>
  </div>
  {/* Hero image on right */}
  <div className="flex-1 overflow-hidden aspect-[3/4] bg-gray-100">
    <img src={heroImage} />
  </div>
</div>
```

### Design Principles

- **Asymmetry:** Hero on one side, supporting stack on other
- **Hierarchy:** Hero is tall and dominant (3:4 vs 1:1)
- **Rhythm:** Supporting images create vertical rhythm
- **Negative space:** Generous gaps create breathing room
- **Editorial:** Feels like magazine spread or portfolio layout
- **Storytelling:** Multiple perspectives on same moment
- **Curation:** Intentional arrangement, not random

### Use Case

- Rich editorial storytelling
- Multiple perspectives on same event
- Context + details + close-up
- Portfolio showcase
- Magazine-style layout

---

## Responsive Behavior

### Desktop (1024px+)

- Full editorial compositions displayed
- All aspect ratios maintained
- Maximum visual impact
- Generous spacing

### Tablet (768px - 1023px)

- Compositions adapt to screen width
- Aspect ratios maintained
- Spacing slightly reduced
- Still maintains hierarchy

### Mobile (< 768px)

- Simplified to vertical stack
- Main image full width
- Supporting images below (smaller)
- Maintains visual hierarchy
- Readable on small screens

---

## Key Design Differences from Previous Version

### BEFORE (Basic Gallery)

```
┌─────────────────┐
│  Image 1 (4:3)  │
├─────────────────┤
│  Image 2 (3:2)  │
├─────────────────┤
│  Image 3 (3:2)  │
└─────────────────┘
```

- Vertical stack
- Equal visual weight
- Mechanical arrangement
- Gallery-like feel
- Flat composition

### AFTER (Editorial Composition)

```
LEFT SIDE:
┌──────────────────────────┐
│ Hero (3:4)  │ Support 1  │
│             │ (square)   │
│             ├────────────┤
│             │ Support 2  │
│             │ (square)   │
└──────────────────────────┘

RIGHT SIDE:
┌──────────────────────────┐
│ Support 1  │ Hero (3:4)  │
│ (square)   │             │
├────────────┤             │
│ Support 2  │             │
│ (square)   │             │
└──────────────────────────┘
```

- Asymmetric arrangement
- Clear visual hierarchy
- Intentional offset
- Editorial feel
- Depth and movement

---

## Visual Hierarchy

### Case 1: Single Image

```
Visual Weight Distribution:
100% → Main Image
```

### Case 2: Two Images

```
Visual Weight Distribution:
60% → Main Image
40% → Supporting Image (offset)
```

### Case 3+: Three Images

```
Visual Weight Distribution:
60% → Hero Image (tall)
20% → Supporting Image 1
20% → Supporting Image 2
```

---

## Spacing & Dimensions

### Case 1

- Width: max-w-lg (32rem / 512px)
- Aspect: 5:4 (landscape, generous)
- Padding: None (full bleed)

### Case 2

- Width: max-w-2xl (42rem / 672px)
- Height: h-96 (384px)
- Main: 60% width, full height
- Supporting: 40% width, 40% height
- Gap: gap-6 (24px)
- Shadow: shadow-lg on supporting

### Case 3+

- Width: max-w-2xl (42rem / 672px)
- Hero: flex-1 (60%), aspect-[3/4]
- Supporting stack: w-2/5 (40%)
- Each supporting: aspect-square (1:1)
- Gap between hero/stack: gap-6 (24px)
- Gap within stack: gap-4 (16px)

---

## Color & Styling

### Image Containers

- Background: bg-gray-100 (placeholder)
- Object fit: object-cover (fill container)
- Overflow: overflow-hidden (clip edges)

### Supporting Image (Case 2)

- Shadow: shadow-lg (adds depth)
- Creates separation from main image

### All Images

- Lazy loading: loading="lazy"
- Responsive: w-full h-full
- Smooth: No transitions (instant)

---

## Timeline Side Adaptation

### LEFT SIDE (isReversed=false)

- **Case 2:** Main left, supporting bottom-right
- **Case 3:** Hero left, supporting stack right
- **Effect:** Composition balances toward left

### RIGHT SIDE (isReversed=true)

- **Case 2:** Main right, supporting bottom-left
- **Case 3:** Hero right, supporting stack left
- **Effect:** Composition balances toward right

This ensures visual balance with the alternating timeline layout.

---

## Premium Portfolio Feel

### What Creates It

1. **Asymmetry** - Not rigid or mechanical
2. **Hierarchy** - Clear visual dominance
3. **Offset** - Intentional, not aligned
4. **Negative space** - Breathing room
5. **Aspect variety** - Different ratios (5:4, 3:4, 1:1)
6. **Shadow** - Depth and separation
7. **Curation** - Intentional arrangement
8. **Editorial** - Magazine-like layout

### What Avoids

- ❌ Equal visual weight
- ❌ Mechanical stacking
- ❌ Uniform grid
- ❌ Gallery feel
- ❌ Flat composition
- ❌ Cramped spacing
- ❌ Rigid alignment

---

## Implementation Notes

- Images prioritized by `is_cover` flag
- Fallback to `order_index` for remaining images
- Only first 3 images shown in timeline
- Adapts based on `isReversed` prop
- Responsive on all screen sizes
- Lazy loading for performance
- No animations (instant, clean)

---

## Examples in Context

### Timeline Phase with 2 Images

```
Period: 2010 — 2014
Location: Osaka, Japan
Title: Study Abroad Years
Description: Left Vietnam at 22...

[Editorial 2-image composition]
Large main image (left/right depending on side)
Small supporting image offset (opposite corner)
```

### Timeline Phase with 3 Images

```
Period: 2014 — 2018
Location: Tokyo, Japan
Title: Entering the Market
Description: Four years working...

[Editorial 3-image composition]
Hero image (tall, dominant)
Two supporting images stacked (opposite side)
```

---

This editorial approach creates a premium, curated portfolio feel that tells a visual story rather than simply displaying images in a gallery format.
