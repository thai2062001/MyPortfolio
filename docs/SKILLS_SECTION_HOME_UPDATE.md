# Skills Section Home Page Update

## Overview

Replaced the hardcoded "Services" section on the home page with a dynamic "Skills" section that pulls data from the database.

## Changes Made

### 1. New Component: `src/components/SkillsSection.tsx`

Created a new component that:

- Fetches skill categories from database
- Gets skills from the first category
- Displays the first 3 skills
- Shows skill icon (SVG from Cloudinary)
- Shows skill name and description
- Includes loading state with skeleton UI
- Responsive grid layout (3 columns on desktop)

### 2. Updated: `src/lib/sectionRenderer.tsx`

- Replaced `ServicesSection` import with `SkillsSection`
- Updated `home_services` mapping to use `SkillsSection` instead of `ServicesSection`

## How It Works

### Data Flow

```
Database (skills table)
    ↓
getSkillsByCategory() query
    ↓
SkillsSection component
    ↓
Display first 3 skills with icons
```

### Component Features

- **Dynamic Data**: Pulls from database instead of hardcoded values
- **Icon Display**: Shows SVG icons uploaded to Cloudinary
- **Multi-language**: Supports English and Japanese
- **Loading State**: Shows skeleton UI while loading
- **Responsive**: Grid layout adapts to screen size
- **Animations**: Smooth fade-in animations on scroll

## Data Structure

### Skills Displayed

The component displays:

1. **Skill Icon** - SVG from Cloudinary (icon_url field)
2. **Skill Name** - skill_name field
3. **Description** - Uses overview, short_description, or application field

### Example Data

```
Skill 1:
- Name: SEO Optimization
- Icon: https://cloudinary.com/...icon.svg
- Description: SEO is the practice of optimizing...

Skill 2:
- Name: Social Media Strategy
- Icon: https://cloudinary.com/...icon.svg
- Description: Social media strategy involves...

Skill 3:
- Name: Brand Positioning
- Icon: https://cloudinary.com/...icon.svg
- Description: Brand positioning is about...
```

## Database Requirements

### Skills Table

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY,
  skill_name TEXT NOT NULL,
  icon_url TEXT,
  overview TEXT,
  short_description TEXT,
  application TEXT,
  category_id UUID,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  ...
);
```

### Skill Categories Table

```sql
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  ...
);
```

## Configuration

### Seed Data

The component uses the first published skill category and displays its first 3 published skills.

To ensure proper display:

1. Create at least one skill category
2. Create at least 3 skills in that category
3. Set `is_published = true` for both categories and skills
4. Upload SVG icons for skills (optional but recommended)

### Example Seed Data

```sql
-- Insert category
INSERT INTO skill_categories (name_en, name_ja, slug, is_published, order_index)
VALUES ('Digital Marketing', 'デジタルマーケティング', 'digital-marketing', true, 1);

-- Insert skills
INSERT INTO skills (skill_name, icon_url, overview, category_id, is_published, order_index)
VALUES
  ('SEO Optimization', 'https://...icon1.svg', 'SEO is the practice...', category_id, true, 1),
  ('Social Media Strategy', 'https://...icon2.svg', 'Social media strategy...', category_id, true, 2),
  ('Brand Positioning', 'https://...icon3.svg', 'Brand positioning is...', category_id, true, 3);
```

## Styling

### Colors

- Icon background: `bg-sage-light` (light sage color)
- Icon color: `text-sage` (sage color)
- Text: Uses default heading and muted-foreground colors

### Layout

- **Desktop**: 3-column grid with 10px gap
- **Mobile**: Single column
- **Card**: Rounded corners, border, hover shadow effect

## Performance

### Optimization

- Loads only first 3 skills (minimal data transfer)
- Uses published flag to filter data
- Caches component state
- Smooth animations with Framer Motion

### Loading State

- Shows skeleton UI while fetching
- Prevents layout shift
- Smooth transition to content

## Fallback Behavior

### No Skills Available

If no skills are found:

- Component returns `null`
- Section is not displayed
- No error shown to user

### Loading Error

If there's an error fetching skills:

- Error is logged to console
- Component shows loading state
- User sees skeleton UI

## Testing Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Navigate to home page
- [ ] Verify "Skills" section appears instead of "Services"
- [ ] Verify 3 skills are displayed
- [ ] Verify skill icons are visible
- [ ] Verify skill names and descriptions are correct
- [ ] Test on mobile (single column)
- [ ] Test on desktop (3 columns)
- [ ] Verify animations work smoothly
- [ ] Switch language and verify display
- [ ] Verify hover effects work

## Migration from Services Section

### Old Section

- Hardcoded 3 services
- Static data
- Manual updates required

### New Section

- Dynamic data from database
- Automatic updates
- Admin panel management

## Future Enhancements

Possible improvements:

1. Add "View All Skills" button linking to `/skills`
2. Display skills from multiple categories
3. Add skill difficulty level display
4. Add skill tags or badges
5. Add click-through to skill detail page
6. Add skill statistics (e.g., proficiency level)

## Files Modified

- ✅ Created: `src/components/SkillsSection.tsx`
- ✅ Updated: `src/lib/sectionRenderer.tsx`

## Notes

- The old `ServicesSection.tsx` is still available if needed for reference
- Component uses existing skill queries from `supabase-skill-queries.ts`
- Follows same styling patterns as other sections
- Integrates seamlessly with existing home page layout
