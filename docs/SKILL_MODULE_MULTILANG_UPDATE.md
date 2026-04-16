# Skill Module Multi-Language Support Update

## Overview

Updated the Skill Module to support multi-language categories with `name_en` (English) and `name_ja` (Japanese) fields instead of a single `name` field.

## Changes Made

### 1. Database Schema Updates

**File**: `SUPABASE_SCHEMA_CONSOLIDATED.sql`

- Updated `skill_categories` table to include:
  - `name_en TEXT NOT NULL UNIQUE` - English category name
  - `name_ja TEXT NOT NULL UNIQUE` - Japanese category name
  - Removed single `name` field

### 2. TypeScript Types

**File**: `src/types/skills.ts`

- Updated `SkillCategory` interface:
  - Changed `name: string` to `name_en: string` and `name_ja: string`
  - Maintains all other fields (id, slug, order_index, is_published, etc.)

### 3. Seed Data

**File**: `SEED_SKILLS_DEMO.sql`

- Updated skill categories seed data to include both English and Japanese names:
  - Digital Marketing / デジタルマーケティング
  - Brand Strategy / ブランド戦略
  - Content Creation / コンテンツ作成
  - Analytics & Data / アナリティクス＆データ

### 4. Admin Pages

#### SkillCategoriesAdmin.tsx

- Updated form to have separate fields for English and Japanese names
- Form validation now requires both `name_en` and `name_ja`
- Table displays language-specific names based on current language context
- Edit functionality properly handles both language fields

#### SkillsAdmin.tsx

- Category select dropdown now displays language-specific names
- Uses `lang === "en" ? cat.name_en : cat.name_ja` for display
- Filter dropdown also shows language-specific category names
- `getCategoryName()` function simplified to use language context
- Test data updated to use new schema

## How It Works

### Language Display Logic

```typescript
// In admin pages
const getCategoryName = (categoryId: string) => {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return "Unknown";
  return lang === "en" ? category.name_en : category.name_ja;
};
```

### Form Handling

When creating/editing categories:

- English name field: `name_en`
- Japanese name field: `name_ja`
- Both are required for form submission

## Testing Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R) to clear cache
- [ ] Navigate to Admin > Skill Categories
- [ ] Create a new category with English and Japanese names
- [ ] Verify names display correctly in English mode
- [ ] Switch to Japanese language and verify names display correctly
- [ ] Navigate to Admin > Skills Management
- [ ] Create a new skill and select a category
- [ ] Verify category dropdown shows language-specific names
- [ ] Edit existing skills and verify category selection works
- [ ] Navigate to Admin > Skill Details
- [ ] Verify skill selector works correctly

## Database Migration

To apply these changes to your Supabase database:

1. Run the updated schema from `SUPABASE_SCHEMA_CONSOLIDATED.sql`
2. Run the seed data from `SEED_SKILLS_DEMO.sql` to populate test categories
3. If you have existing categories, migrate them:

   ```sql
   ALTER TABLE public.skill_categories
   ADD COLUMN name_en TEXT,
   ADD COLUMN name_ja TEXT;

   -- Copy existing names to name_en
   UPDATE public.skill_categories
   SET name_en = name, name_ja = name
   WHERE name_en IS NULL;

   -- Add constraints
   ALTER TABLE public.skill_categories
   ALTER COLUMN name_en SET NOT NULL,
   ALTER COLUMN name_ja SET NOT NULL,
   ADD CONSTRAINT unique_name_en UNIQUE (name_en),
   ADD CONSTRAINT unique_name_ja UNIQUE (name_ja);

   -- Drop old name column if no longer needed
   ALTER TABLE public.skill_categories DROP COLUMN name;
   ```

## Files Modified

- `SUPABASE_SCHEMA_CONSOLIDATED.sql` - Schema update
- `SEED_SKILLS_DEMO.sql` - Seed data update
- `src/types/skills.ts` - TypeScript interface update
- `src/pages/admin/SkillCategoriesAdmin.tsx` - Admin page update
- `src/pages/admin/SkillsAdmin.tsx` - Admin page update

## Notes

- All admin pages now properly support language switching
- Category names display in the user's selected language
- The system is ready for full bilingual support across the skill module
