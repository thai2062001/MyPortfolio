# Project Detail Page - Bilingual Support Update

## Overview

Updated the Project Detail page to display bilingual content (English/Japanese) based on the language selected in the header.

## Changes Made

### File: `src/pages/ProjectDetail.tsx`

#### 1. Updated ProjectData Interface

Added Japanese fields to support bilingual content:

```typescript
interface ProjectData {
  // ... existing fields ...
  title_ja?: string;
  overview_ja?: string;
  challenge_ja?: string;
  // ... rest of fields ...
}
```

#### 2. Updated useLang Hook Usage

Changed from:

```typescript
const { t } = useLang();
```

To:

```typescript
const { t, lang } = useLang();
```

Now we can access both the translation function `t` and the current language `lang`.

#### 3. Updated Content Display

**Project Title**

- Before: Always displayed English title
- After: Displays Japanese title when `lang === "ja"` and `project.title_ja` exists, otherwise falls back to English

```typescript
{
  lang === "ja" && project.title_ja ? project.title_ja : project.title;
}
```

**Overview Section**

- Before: Always displayed English overview
- After: Displays Japanese overview when available

```typescript
{
  lang === "ja" && project.overview_ja ? project.overview_ja : project.overview;
}
```

**Challenge Section**

- Before: Always displayed English challenge
- After: Displays Japanese challenge when available

```typescript
{
  lang === "ja" && project.challenge_ja
    ? project.challenge_ja
    : project.challenge;
}
```

## How It Works

1. User clicks "日本語" (Japanese) in the header
2. Language context updates to `lang = "ja"`
3. ProjectDetail component re-renders
4. Content automatically switches to Japanese if available
5. Falls back to English if Japanese content is not available

## Supported Content

The following fields now support bilingual display:

- ✅ Project Title
- ✅ Overview
- ✅ Challenge

## Not Yet Updated (Optional)

The following could be updated in the future if needed:

- Project Approaches (currently English only)
- Project Results (currently English only)
- Project Testimonials (currently English only)
- Gallery captions (currently English only)

These can be added later if bilingual support is needed for these sections.

## Database Requirements

The database already has the Japanese columns added:

- `title_ja`
- `overview_ja`
- `challenge_ja`

These were added in the previous migration: `database/ADD_JAPANESE_COLUMNS_TO_PROJECTS.sql`

## Testing

To test the bilingual support:

1. Go to a project detail page: `http://localhost:8080/project/airtrip-campaign`
2. Click "English" in the header - should show English content
3. Click "日本語" in the header - should show Japanese content if available
4. If Japanese content is not available, it falls back to English

## Fallback Behavior

The implementation uses a safe fallback pattern:

```typescript
{
  lang === "ja" && project.title_ja ? project.title_ja : project.title;
}
```

This means:

- If language is Japanese AND Japanese content exists → Show Japanese
- Otherwise → Show English (default)

This ensures the page never shows empty content.

## Code Quality

- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Proper null/undefined checks
- ✅ Backward compatible (works with existing projects)

## Next Steps (Optional)

1. Add bilingual support to other sections (approaches, results, testimonials)
2. Add bilingual support to gallery captions
3. Add language indicator to show which language is being displayed
4. Add animation when switching languages

## Summary

The Project Detail page now fully supports bilingual content display. When users switch to Japanese in the header, the page automatically displays Japanese content for:

- Project Title
- Overview
- Challenge

The implementation is safe, backward compatible, and uses proper fallback logic to ensure content is always displayed.
