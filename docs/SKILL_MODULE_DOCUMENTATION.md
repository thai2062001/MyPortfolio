# Skill Module Documentation

## Overview

The Skill Module is a comprehensive system for managing and displaying professional skills with rich relational data. It's built similar to the Project Detail system but tailored for skills with multiple dimensions.

## Architecture

### Database Schema

The skill module uses 6 interconnected tables:

1. **skill_categories** - Organize skills by category
2. **skills** - Main skill records with detailed information
3. **skill_highlights** - Key highlights/benefits of each skill
4. **skill_applications** - Real-world applications and use cases
5. **skill_tools** - Tools and technologies used
6. **skill_steps** - Learning path or implementation steps

### File Structure

```
src/
├── lib/
│   └── supabase-skill-queries.ts    # All Supabase queries
├── types/
│   └── skills.ts                     # TypeScript interfaces
└── pages/
    ├── Skills.tsx                    # Category list page
    ├── SkillCategory.tsx             # Skills in category
    └── SkillDetail.tsx               # Full skill detail page
```

## Pages

### 1. Skills Page (`/skills`)

- Lists all skill categories
- Shows category name, description, and icon
- Links to category detail pages
- Responsive grid layout

### 2. Skill Category Page (`/skills/:slug`)

- Shows all skills in a category
- Displays skill cards with:
  - Cover image
  - Skill name
  - Short description
  - Difficulty level badge
  - Estimated time
- Links to individual skill detail pages

### 3. Skill Detail Page (`/skills/:categorySlug/:skillSlug`)

- Comprehensive skill information including:
  - Hero image
  - Overview
  - Key points (bullet list)
  - Application description
  - Use cases
  - Highlights (grid cards)
  - Applications (bordered list)
  - Tools & Technologies (with icons and links)
  - Learning Path (numbered steps)

## Data Structure

### Skill Object

```typescript
interface Skill {
  id: string;
  slug: string;
  category_id: string;
  skill_name: string;
  short_description?: string;
  description?: string;
  overview?: string;
  application?: string;
  use_cases?: string;
  icon_url?: string;
  cover_image_url?: string;
  difficulty_level?: string; // e.g., "Beginner", "Intermediate", "Advanced"
  experience_level?: string; // e.g., "Beginner to Intermediate"
  estimated_time?: string; // e.g., "4-6 weeks"
  tool_stack?: string[];
  key_points?: string[];
  related_skill_ids?: string[];
  seo_title?: string;
  seo_description?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
```

### Related Objects

- **SkillHighlight** - Title + Description
- **SkillApplication** - Title + Description
- **SkillTool** - Tool name + Description + Icon URL + Tool URL
- **SkillStep** - Step title + Step description

## API Queries

### Available Functions

```typescript
// Categories
getSkillCategories(); // Get all published categories
getSkillCategoryBySlug(slug); // Get single category

// Skills
getSkillsByCategory(categoryId); // Get skills in category
getSkillBySlug(slug); // Get single skill
getSkillById(id); // Get skill by ID

// Related Data
getSkillHighlights(skillId); // Get highlights for skill
getSkillApplications(skillId); // Get applications for skill
getSkillTools(skillId); // Get tools for skill
getSkillSteps(skillId); // Get steps for skill

// Complete Data
getCompleteSkillDetail(skillId); // Get all related data at once
```

## Routing

Add these routes to your router:

```typescript
<Route path="/skills" element={<Skills />} />
<Route path="/skills/:slug" element={<SkillCategory />} />
<Route path="/skills/:categorySlug/:skillSlug" element={<SkillDetail />} />
```

## Setup Instructions

### 1. Database Setup

Run the SQL schema from `SUPABASE_SCHEMA_CONSOLIDATED.sql` to create all tables.

### 2. Seed Demo Data

Run `SEED_SKILLS_DEMO.sql` to populate with example skills:

- Digital Marketing
- Brand Strategy
- Content Creation
- Analytics & Data

### 3. Import Components

All components are already created:

- `src/lib/supabase-skill-queries.ts`
- `src/types/skills.ts`
- `src/pages/Skills.tsx`
- `src/pages/SkillCategory.tsx`
- `src/pages/SkillDetail.tsx`

### 4. Update Router

Update `src/App.tsx` to include the skill routes (already done).

## Features

### Visual Design

- Consistent with existing portfolio design
- Responsive grid layouts
- Smooth animations with Framer Motion
- Tailwind CSS styling
- Sage color scheme for accents

### User Experience

- Breadcrumb navigation
- Related skills CTA
- Difficulty level badges
- Time estimates
- Icon support for tools
- External links for tools

### Data Management

- Multi-language support ready (structure in place)
- SEO fields (title, description)
- Related skills tracking
- Flexible tool stack array
- Key points array for quick reference

## Customization

### Adding New Skills

1. Create skill category (if needed)
2. Add skill record with all fields
3. Add highlights (2-3 per skill)
4. Add applications (2-3 per skill)
5. Add tools (3-5 per skill)
6. Add steps (3-5 per skill)

### Styling

- Modify Tailwind classes in component files
- Update color scheme by changing `text-sage` to other colors
- Adjust spacing with `py-`, `px-`, `gap-` utilities

### Adding Fields

To add new fields to skills:

1. Update `Skill` interface in `src/types/skills.ts`
2. Add column to database if needed
3. Update queries in `src/lib/supabase-skill-queries.ts`
4. Update components to display new fields

## Performance Considerations

- Queries use indexes on `category_id`, `order_index`, and `is_published`
- Related data fetched in parallel with `Promise.all()`
- Images should be optimized before upload
- Consider pagination for large skill lists

## Security

- Row-level security (RLS) policies in place
- Public can only view published skills
- Authenticated users can manage all skills
- All queries use parameterized statements

## Future Enhancements

- Multi-language support (add `_en`, `_ja` fields)
- Skill prerequisites/dependencies
- User progress tracking
- Skill assessments/quizzes
- Skill recommendations
- Related projects linking
- Skill difficulty progression

## Troubleshooting

### Skills not showing

- Check `is_published = true` in database
- Verify category is published
- Check browser console for errors

### Images not loading

- Verify image URLs are correct
- Check Supabase storage permissions
- Ensure images are publicly accessible

### Queries failing

- Check Supabase connection
- Verify RLS policies allow access
- Check for typos in slug parameters

## Support

For issues or questions, refer to:

- Supabase documentation: https://supabase.com/docs
- React Router docs: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
