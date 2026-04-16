# Project Detail Page - Bilingual Support Fix

## ✅ Issue Fixed

The project detail page was not displaying Japanese content even though the database had the Japanese columns. The issue was that the Supabase queries were not fetching the Japanese columns.

## Root Cause

The `getProjectBySlug()` and `getPublishedProjects()` functions in `src/lib/supabase-queries.ts` were not selecting the Japanese columns from the database.

## Solution

Updated both functions to include Japanese columns in the SELECT statement:

### File: `src/lib/supabase-queries.ts`

#### Function 1: `getPublishedProjects()`

**Added columns to SELECT:**

```typescript
title_ja,
overview_ja,
challenge_ja,
short_description_ja,
description_ja,
```

#### Function 2: `getProjectBySlug()`

**Added columns to SELECT:**

```typescript
title_ja,
overview_ja,
challenge_ja,
short_description_ja,
description_ja,
```

## How It Works Now

1. User clicks "日本語" in header
2. Language context updates to `lang = "ja"`
3. Supabase query fetches Japanese columns from database
4. ProjectDetail component displays Japanese content
5. Falls back to English if Japanese content is empty

## Testing

To test the bilingual support:

1. Go to: `http://localhost:8080/project/airtrip-campaign`
2. Click "English" in header → Shows English content
3. Click "日本語" in header → Shows Japanese content (if available in database)
4. Refresh page → Language persists

## What Now Displays in Japanese

When you click "日本語":

- ✅ Project Title
- ✅ Overview
- ✅ Challenge

## Database

The database already has the Japanese columns:

- `title_ja`
- `overview_ja`
- `challenge_ja`
- `short_description_ja`
- `description_ja`

These were added in: `database/ADD_JAPANESE_COLUMNS_TO_PROJECTS.sql`

## Code Quality

- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Backward compatible
- ✅ Safe fallback logic

## Files Modified

1. `src/lib/supabase-queries.ts` - Added Japanese columns to SELECT statements
2. `src/pages/ProjectDetail.tsx` - Already had bilingual display logic

## Summary

The issue was simple: the Supabase queries weren't fetching the Japanese columns. Now that they are included in the SELECT statements, the Japanese content will be fetched from the database and displayed when the user switches to Japanese language.

The bilingual support is now fully functional!
