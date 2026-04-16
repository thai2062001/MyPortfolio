# Skill Section Visibility Control Feature

## Overview

Thêm khả năng ẩn/hiện các sections trong skill detail page (Highlights, Applications, Tools, Steps) cho từng skill riêng biệt.

## Database Changes

### Migration SQL

File: `database/ADD_SKILL_SECTION_VISIBILITY.sql`

```sql
ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS show_highlights BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_applications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_tools BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_steps BOOLEAN DEFAULT TRUE;
```

**Columns Added:**

- `show_highlights` - Control Highlights section visibility
- `show_applications` - Control Applications section visibility
- `show_tools` - Control Tools section visibility
- `show_steps` - Control Steps section visibility

**Default:** All set to `TRUE` (show by default)

## Code Changes

### 1. Type Definition (`src/types/skills.ts`)

✅ Updated `Skill` interface:

```typescript
export interface Skill {
  // ... existing fields
  show_highlights?: boolean;
  show_applications?: boolean;
  show_tools?: boolean;
  show_steps?: boolean;
}
```

### 2. Admin Form (`src/pages/admin/SkillsAdmin.tsx`)

✅ Added section visibility controls:

**UI Changes:**

- Added "Show Sections on Detail Page" section
- 4 checkboxes in 2x2 grid:
  - Highlights
  - Applications
  - Tools
  - Steps
- Located below "Published" checkbox

**State Management:**

- Added fields to `formData` state
- Updated `handleEdit()` to load values
- Updated `resetForm()` to reset to defaults (all true)

### 3. Frontend Display (`src/pages/SkillDetail.tsx`)

✅ Updated conditional rendering:

**Before:**

```typescript
{highlights.length > 0 && (
  <section>...</section>
)}
```

**After:**

```typescript
{skill.show_highlights !== false && highlights.length > 0 && (
  <section>...</section>
)}
```

Applied to all 4 sections:

- Highlights
- Applications
- Tools
- Steps

## Usage Guide

### Admin - Control Section Visibility

1. **Navigate to Admin > Skills**
2. **Edit a skill**
3. **Scroll to "Show Sections on Detail Page"**
4. **Uncheck sections you want to hide:**
   - Uncheck "Highlights" → Highlights section won't show
   - Uncheck "Applications" → Applications section won't show
   - Uncheck "Tools" → Tools section won't show
   - Uncheck "Steps" → Steps section won't show
5. **Save skill**

### Frontend Behavior

**Section Display Logic:**

- Section shows IF:
  - `show_[section]` is `true` OR `undefined` (default)
  - AND section has data (length > 0)
- Section hides IF:
  - `show_[section]` is `false`
  - OR section has no data

**Example Scenarios:**

1. **Hide Applications for React skill:**
   - Edit React skill
   - Uncheck "Applications"
   - Save
   - Result: Applications section won't appear on React detail page

2. **Show only Highlights and Tools:**
   - Uncheck "Applications" and "Steps"
   - Keep "Highlights" and "Tools" checked
   - Result: Only Highlights and Tools sections appear

3. **Default behavior (all checked):**
   - All sections show if they have data
   - Backward compatible with existing skills

## Use Cases

### When to Hide Sections

**Hide Applications:**

- Skill is too general (e.g., "Problem Solving")
- Applications are obvious or redundant

**Hide Highlights:**

- Skill is simple and doesn't need detailed highlights
- Overview is sufficient

**Hide Tools:**

- Skill doesn't require specific tools
- Skill is methodology-focused

**Hide Steps:**

- Skill doesn't have a step-by-step process
- Skill is conceptual rather than procedural

## Technical Details

### Default Values

- All flags default to `TRUE`
- Existing skills without these columns will show all sections (backward compatible)
- `!== false` check ensures `undefined` is treated as `true`

### Database Impact

- 4 new boolean columns in `skills` table
- Minimal storage impact
- No migration needed for existing data (defaults handle it)

### Performance

- No additional queries needed
- Flags loaded with skill data
- Simple boolean checks in render logic

## Testing Checklist

- [ ] Run migration SQL
- [ ] Create new skill with all sections visible
- [ ] Create new skill with some sections hidden
- [ ] Edit existing skill and hide sections
- [ ] Verify hidden sections don't appear on detail page
- [ ] Verify visible sections still appear
- [ ] Test with skills that have no data in certain sections
- [ ] Verify backward compatibility (existing skills show all sections)

## Files Modified

1. ✅ `database/ADD_SKILL_SECTION_VISIBILITY.sql` - Migration
2. ✅ `src/types/skills.ts` - Type definition
3. ✅ `src/pages/admin/SkillsAdmin.tsx` - Admin UI
4. ✅ `src/pages/SkillDetail.tsx` - Frontend display

## Notes

- Backward compatible: Existing skills show all sections by default
- Flexible: Each skill can have different section visibility
- Simple: Just checkboxes in admin, no complex logic
- Efficient: No additional database queries needed
- User-friendly: Clear labels and intuitive UI
