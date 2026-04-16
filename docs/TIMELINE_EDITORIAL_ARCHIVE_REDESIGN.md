# Timeline Section - Editorial Archive Redesign ✅

## 🎯 Complete Rebuild from Scratch

The Timeline section has been completely rebuilt from scratch to feature **horizontal alternating editorial compositions** instead of the previous text-above-images stacked layout.

---

## ✨ New Design Direction

### Overall Feel

- ✅ Curated archive
- ✅ Editorial portfolio
- ✅ Storytelling timeline
- ✅ Airy and elegant
- ✅ Asymmetric but balanced
- ✅ Premium whitespace-driven

### NOT

- ❌ Standard timeline card list
- ❌ Blog card layout
- ❌ Stacked content blocks
- ❌ Gallery under text

---

## 🏗️ New Architecture

### Component Structure

```
TimelineSection (container)
├── TimelineRow (horizontal editorial row)
│   ├── TimelineTextBlock (text content)
│   └── TimelineImageComposition (images)
└── (repeats for each milestone)
```

### Key Difference

**BEFORE:** Text above images (vertical stack)
**AFTER:** Text beside images (horizontal alternating)

---

## 📐 Milestone Composition

### Pattern A: Text Left + Images Right

```
┌─────────────────────────────────────────┐
│                                         │
│  Period                                 │
│  Location                               │
│  Tag                                    │
│  Title                                  │
│  Company                                │
│  Description                            │
│                                         │
│                    [Image Composition]  │
│                                         │
└─────────────────────────────────────────┘
```

### Pattern B: Images Left + Text Right

```
┌─────────────────────────────────────────┐
│                                         │
│  [Image Composition]                    │
│                                         │
│                    Period               │
│                    Location             │
│                    Tag                  │
│                    Title                │
│                    Company              │
│                    Description          │
│                                         │
└─────────────────────────────────────────┘
```

### Alternation

- **Even index (0, 2, 4...):** Text left, images right
- **Odd index (1, 3, 5...):** Images left, text right

This creates a designed magazine spread effect.

---

## 📝 Text Block

### Content

- Period (e.g., "2010 — 2014")
- Location (e.g., "Osaka, Japan")
- Tag (optional, e.g., "Study Abroad")
- Title (main heading)
- Company/Subtitle (optional)
- Description (body text)

### Typography

- **Period:** font-display italic, text-gold, text-sm
- **Location:** uppercase, text-muted-foreground, text-xs
- **Tag:** uppercase, bg-gold-light, border, inline-block
- **Title:** font-display, text-3xl md:text-4xl, font-light
- **Company:** uppercase, text-muted-foreground, text-sm
- **Description:** text-muted-foreground, text-sm, leading-relaxed

### Spacing

- Period to tag: mb-4
- Tag to title: mb-4
- Title to company: mb-2
- Company to description: mb-6

---

## 🖼️ Image Composition

### Case 1: Single Image

```
┌──────────────────┐
│                  │
│  Single Image    │
│  (4:5 aspect)    │
│  Strong, dominant│
│                  │
└──────────────────┘
```

- Aspect ratio: 4:5 (portrait, strong)
- Max width: 448px (max-w-md)
- Centered in image column

### Case 2: Two Images

```
┌──────────────────────────┐
│                          │
│  Main Image (65%)        │
│  ┌────────────────────┐  │
│  │ Secondary (35%)    │  │
│  │ Offset, overlapping│  │
│  │ Shadow             │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘
```

- Main: 65% width, full height
- Secondary: 35% width, 65% height, offset bottom-right
- Shadow on secondary for depth
- Height: 384px (h-96)

### Case 3+: Three Images

```
┌──────────────────────────────┐
│                              │
│  Hero (3:4)  │ Support 1     │
│  (60% width) │ (50% width)   │
│  Tall        │               │
│              ├───────────────┤
│              │ Support 2     │
│              │ (50% width)   │
│              │               │
└──────────────────────────────┘
```

- Hero: 60% width, 3:4 aspect (tall, dominant)
- Supporting: 40% width, stacked vertically
- Gap between hero/stack: gap-6 (24px)
- Gap within stack: gap-4 (16px)

---

## 🔄 Responsive Behavior

### Desktop (1024px+)

- Full horizontal alternating layout
- Text and images side-by-side
- Generous spacing (gap-12 md:gap-16 lg:gap-20)
- Strong visual rhythm

### Tablet (768px - 1023px)

- Horizontal layout maintained
- Spacing adjusted (gap-12 md:gap-16)
- Hierarchy preserved
- Images scale to fit

### Mobile (< 768px)

- Stacks vertically (grid-cols-2 becomes single column)
- Text above images
- Images full width
- Maintains visual hierarchy
- Readable on small screens

---

## 🎨 Visual Hierarchy

### Text Block

- Period: Smallest, muted
- Location: Small, muted
- Tag: Accent color, inline
- Title: Largest, dominant
- Company: Small, muted
- Description: Medium, readable

### Image Composition

- Case 1: Single dominant image
- Case 2: Main image dominates (65% vs 35%)
- Case 3: Hero dominates (60% vs 40%)

---

## 📏 Spacing & Layout

### Row Spacing

- Vertical gap: py-20 md:py-24 lg:py-32
- Horizontal gap: gap-12 md:gap-16 lg:gap-20
- Between rows: Large whitespace for editorial feel

### Text Block Spacing

- Period to tag: mb-4
- Tag to title: mb-4
- Title to company: mb-2
- Company to description: mb-6

### Image Composition Spacing

- Case 2: Secondary offset with shadow
- Case 3: gap-6 between hero/stack, gap-4 within stack

---

## 🎬 Animation

### Fade In

- Initial: opacity-0
- Final: opacity-1
- Duration: 0.8s ease
- Trigger: Intersection Observer (threshold: 0.15)

### Timeline Dot

- Appears with fade in
- Subtle, not distracting
- Connects rows with dashed line

---

## 🔍 Component Details

### TimelineSection

- Fetches published phases
- Fetches related images
- Maps images to phases
- Renders TimelineRow for each phase
- Manages loading state

### TimelineRow

- Horizontal editorial composition
- Alternates text/image position
- Manages animation
- Renders timeline dot and line
- Passes props to child components

### TimelineTextBlock

- Renders text content
- Refined typography
- Editorial spacing
- Aligned based on position

### TimelineImageComposition

- Renders images based on count
- Adapts layout for 1/2/3+ images
- Prioritizes is_cover
- Lazy loading
- Responsive sizing

---

## 💾 Data Structure

### Supabase Tables

```
timeline_phases
├── id, period, location
├── title_en/ja, company_en/ja
├── description_en/ja
├── image_url (legacy fallback)
├── tag_en/ja
├── order_index, is_published
└── created_at, updated_at

timeline_phase_images
├── id, phase_id
├── image_url
├── alt_text, caption
├── is_cover, order_index
└── created_at, updated_at
```

### Data Flow

1. Fetch published phases
2. Fetch related images
3. Map images to phases
4. Enrich phase objects
5. Render TimelineRow for each

---

## ✅ Quality Assurance

- ✅ Zero TypeScript errors
- ✅ Zero console warnings
- ✅ Full type safety
- ✅ Responsive on all devices
- ✅ Lazy loading implemented
- ✅ Backward compatible
- ✅ Production ready

---

## 🚀 Deployment

### Ready to Deploy

- ✅ Complete rebuild
- ✅ No errors
- ✅ Fully tested
- ✅ Documented

### Files Changed

1. **`src/components/TimelineSection.tsx`** - Rebuilt from scratch
2. **`src/components/TimelineRow.tsx`** - New component (created)
3. **`src/components/TimelineTextBlock.tsx`** - New component (created)
4. **`src/components/TimelineImageComposition.tsx`** - New component (created)

### Files Deleted

1. **`src/components/TimelinePhase.tsx`** - Old stacked layout
2. **`src/components/TimelinePhaseImageComposition.tsx`** - Old image component

---

## 🎯 Key Improvements

### Layout

- ✅ Horizontal alternating composition
- ✅ Text beside images, not above
- ✅ Magazine spread feel
- ✅ Editorial archive aesthetic

### Visual Hierarchy

- ✅ Clear text hierarchy
- ✅ Image hierarchy by count
- ✅ Intentional spacing
- ✅ Premium whitespace

### Responsiveness

- ✅ Desktop: Full horizontal layout
- ✅ Tablet: Adapted spacing
- ✅ Mobile: Intelligent stacking
- ✅ Maintains hierarchy on all sizes

### Code Quality

- ✅ Reusable components
- ✅ Clean separation of concerns
- ✅ Full TypeScript types
- ✅ No code duplication

---

## 📖 Component API

### TimelineRow

```typescript
interface TimelineRowProps {
  period: string;
  location: string;
  title: string;
  company?: string;
  description: string;
  images?: TimelinePhaseImage[];
  image?: string;
  tag?: string;
  index: number;
  isLast?: boolean;
}
```

### TimelineTextBlock

```typescript
interface TimelineTextBlockProps {
  period: string;
  location: string;
  title: string;
  company?: string;
  description: string;
  tag?: string;
  isReversed: boolean;
}
```

### TimelineImageComposition

```typescript
interface TimelineImageCompositionProps {
  images: TimelinePhaseImage[];
  fallbackImage?: string;
  title: string;
  isReversed: boolean;
}
```

---

## 🎉 Result

The Timeline section now features:

✅ **Horizontal alternating editorial compositions**
✅ **Text beside images, not above**
✅ **Magazine spread aesthetic**
✅ **Curated archive feel**
✅ **Premium whitespace**
✅ **Clear visual hierarchy**
✅ **Responsive on all devices**
✅ **Production-ready code**

---

## 📞 Next Steps

1. ✅ Complete rebuild
2. ✅ All components created
3. ✅ No errors
4. ⏭️ Deploy to staging
5. ⏭️ Final QA
6. ⏭️ Deploy to production

---

**Status:** ✅ COMPLETE & READY FOR DEPLOYMENT

**Date:** March 26, 2026

**Version:** 3.0 (Editorial Archive Redesign - Complete Rebuild)
