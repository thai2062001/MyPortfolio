# Skill Module Multi-Language - Quick Start

## What Changed?

The skill categories and items now support **Trilingual names** (English, Japanese, and Vietnamese) to cater to a global audience.

## For Admin Users

### Creating a Category

1. Go to Admin > Skill Categories
2. Click "Add Category"
3. Fill in:
   - **English Name**: e.g., "Digital Marketing"
   - **Japanese Name**: e.g., "デジタルマーケティング"
   - **Vietnamese Name**: e.g., "Tiếp thị kỹ thuật số"
   - **Slug**: e.g., "digital-marketing"
   - **Order Index**: Position in list
   - **Published**: Toggle to publish
4. Click Save

### Creating a Skill

1. Go to Admin > Skills Management
2. Click "Add Skill"
3. Select a category from the dropdown (displays in current language).
4. Fill in skill details for all three languages.
5. Click Save

### Language Switching

- The admin panel automatically displays names in your selected language.
- Switch languages using the language toggle in the top navigation.

## Database Schema

### skill_categories Table

```sql
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,      -- English name
  name_ja TEXT NOT NULL UNIQUE,      -- Japanese name
  name_vi TEXT,                      -- Vietnamese name (Optional)
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## Example Data

| slug              | name_en           | name_ja                | name_vi                |
| ----------------- | ----------------- | ---------------------- | ---------------------- |
| digital-marketing | Digital Marketing | デジタルマーケティング | Tiếp thị kỹ thuật số   |
| brand-strategy    | Brand Strategy    | ブランド戦略           | Chiến lược thương hiệu |
| analytics         | Analytics & Data  | アナリティクス＆データ | Phân tích & Dữ liệu    |

## Troubleshooting

### Categories not showing in dropdown?

1. Hard refresh browser: `Ctrl+Shift+R`
2. Check that categories are published
3. Verify both `name_en` and `name_ja` are filled in

### Wrong language displaying?

1. Check your language setting in the top navigation
2. Hard refresh the page
3. Verify the category has both English and Japanese names

### Form won't submit?

- Make sure both English and Japanese names are filled in
- Slug must be unique
- All required fields must have values

## Next Steps

After updating:

1. Create test categories with both language names
2. Create test skills and assign them to categories
3. Test language switching to verify names display correctly
4. Publish categories and skills when ready
