# Skill Module - Admin Panel Guide

## Overview

The admin panel now includes complete management for the new Skill Module with 3 dedicated pages:

1. **Skill Categories** - Manage skill categories
2. **Skills** - Manage individual skills with rich details
3. **Skill Details** - Manage highlights, applications, tools, and steps

## Admin Routes

All admin pages are under `/admin`:

- `/admin/skill-categories` - Manage categories
- `/admin/skills-management` - Manage skills
- `/admin/skill-details` - Manage skill details

## Navigation

In the admin panel sidebar, look for the **Skills** section with 4 options:

1. **Skill Settings** - General skill settings
2. **Skill Categories** - Category management
3. **Skills** - Skill management
4. **Skill Details** - Details management

## Page 1: Skill Categories

### Purpose

Manage skill categories that organize skills.

### Features

- Add new categories
- Edit existing categories
- Delete categories
- Publish/unpublish categories
- Set display order
- Add category icons and descriptions

### Fields

- **Name** - Category name (required)
- **Slug** - URL-friendly identifier (required)
- **Description** - Category description
- **Icon URL** - Icon image URL
- **Order Index** - Display order
- **Published** - Visibility toggle

### Actions

- **Add Category** - Create new category
- **Edit** - Modify category
- **Delete** - Remove category
- **Publish/Draft** - Toggle visibility

## Page 2: Skills

### Purpose

Manage individual skills with comprehensive details.

### Features

- Add new skills
- Edit existing skills
- Delete skills
- Publish/unpublish skills
- Filter by category
- Set difficulty levels
- Add time estimates

### Fields

- **Skill Name** - Skill name (required)
- **Slug** - URL-friendly identifier (required)
- **Category** - Parent category (required)
- **Short Description** - Brief description
- **Overview** - Detailed overview
- **Application** - How to apply the skill
- **Use Cases** - Real-world use cases
- **Difficulty Level** - Beginner/Intermediate/Advanced
- **Experience Level** - e.g., "Beginner to Intermediate"
- **Estimated Time** - e.g., "4-6 weeks"
- **Icon URL** - Skill icon
- **Cover Image URL** - Hero image
- **Order Index** - Display order
- **Published** - Visibility toggle

### Actions

- **Add Skill** - Create new skill
- **Edit** - Modify skill
- **Delete** - Remove skill
- **Publish/Draft** - Toggle visibility
- **Filter by Category** - View skills in specific category

## Page 3: Skill Details

### Purpose

Manage related data for skills (highlights, applications, tools, steps).

### Features

- Select skill to manage
- 4 tabs for different detail types
- Add/edit/delete items
- Reorder items

### Tabs

#### Highlights Tab

**Purpose:** Key benefits or highlights of the skill

**Fields:**

- Title (required)
- Description

**Example:**

- Title: "Proven Results"
- Description: "Increase organic traffic by 150-300% within 6 months"

#### Applications Tab

**Purpose:** Real-world applications of the skill

**Fields:**

- Title (required)
- Description

**Example:**

- Title: "E-commerce Optimization"
- Description: "Optimize product pages and category pages for search visibility"

#### Tools Tab

**Purpose:** Tools and technologies used

**Fields:**

- Tool Name (required)
- Description
- Icon URL
- Tool URL

**Example:**

- Tool Name: "Google Search Console"
- Description: "Monitor search performance and indexing issues"
- Icon URL: "https://example.com/gsc-icon.png"
- Tool URL: "https://search.google.com/search-console"

#### Steps Tab

**Purpose:** Learning path or implementation steps

**Fields:**

- Step Title (required)
- Step Description

**Example:**

- Step Title: "Keyword Research"
- Step Description: "Identify high-volume, low-competition keywords relevant to your business"

### Workflow

1. **Select Skill** - Choose skill from dropdown
2. **Select Tab** - Choose detail type (Highlights, Applications, Tools, Steps)
3. **Add Item** - Click "Add [Type]" button
4. **Fill Form** - Enter required information
5. **Save** - Click Save button
6. **View/Edit** - Items appear in list below
7. **Edit Item** - Click edit icon to modify
8. **Delete Item** - Click delete icon to remove

## Best Practices

### Skill Categories

- Use descriptive names (e.g., "Digital Marketing", "Brand Strategy")
- Create meaningful slugs (lowercase, hyphens)
- Add icons for visual appeal
- Order by importance or frequency

### Skills

- Use clear, specific skill names
- Write comprehensive overviews
- Include practical applications
- Set realistic time estimates
- Add cover images for visual interest

### Highlights

- Keep titles concise (2-5 words)
- Focus on benefits, not features
- Add 2-3 highlights per skill
- Make them scannable

### Applications

- Provide specific use cases
- Include industry examples
- Add 2-3 applications per skill
- Be practical and actionable

### Tools

- Include popular tools in the space
- Add icons for recognition
- Link to official websites
- Add 3-5 tools per skill

### Steps

- Create logical progression
- Make steps actionable
- Include 3-5 steps per skill
- Build from basics to advanced

## Common Tasks

### Add a New Skill

1. Go to `/admin/skills-management`
2. Click "Add Skill"
3. Fill in required fields (Name, Slug, Category)
4. Add optional details (Overview, Application, etc.)
5. Click "Save"
6. Go to `/admin/skill-details`
7. Select the new skill
8. Add highlights, applications, tools, and steps

### Edit a Skill

1. Go to `/admin/skills-management`
2. Find the skill in the table
3. Click the edit icon
4. Modify fields
5. Click "Save"

### Delete a Skill

1. Go to `/admin/skills-management`
2. Find the skill in the table
3. Click the delete icon
4. Confirm deletion
5. Related data (highlights, applications, etc.) will also be deleted

### Publish/Unpublish a Skill

1. Go to `/admin/skills-management`
2. Find the skill in the table
3. Click the status button (Published/Draft)
4. Status will toggle

### Add Highlights to a Skill

1. Go to `/admin/skill-details`
2. Select skill from dropdown
3. Click "Highlights" tab
4. Click "Add Highlight"
5. Enter title and description
6. Click "Save"

### Reorder Skills

1. Go to `/admin/skills-management`
2. Edit a skill
3. Change "Order Index" value
4. Save
5. Skills will reorder based on index

## Troubleshooting

### Skill not showing on frontend

- Check if skill is published
- Check if category is published
- Verify slug is correct
- Check browser console for errors

### Changes not appearing

- Hard refresh browser (Ctrl+Shift+R)
- Check if item is published
- Verify data was saved (check for success toast)

### Can't delete skill

- Check if you have permission
- Verify skill exists
- Try refreshing page

### Form not submitting

- Check required fields are filled
- Verify data format is correct
- Check browser console for errors

## Tips

- **Bulk Operations:** Use filters to manage skills by category
- **Ordering:** Set order_index to control display order
- **Publishing:** Use draft mode to prepare content before publishing
- **Icons:** Use SVG icons for best quality
- **Images:** Optimize images before uploading (< 500KB)
- **Descriptions:** Use clear, concise language
- **Links:** Always include https:// in URLs

## Keyboard Shortcuts

- **Tab** - Move between form fields
- **Enter** - Submit form
- **Escape** - Close form/dialog

## Performance Tips

- Load skills by category to reduce data
- Archive old skills instead of deleting
- Use descriptive names for easy searching
- Keep descriptions concise

## Security

- Only authenticated users can access admin pages
- All changes are logged in database
- Published status controls public visibility
- RLS policies enforce data access rules

## Support

For issues or questions:

1. Check this guide
2. Review SKILL_MODULE_DOCUMENTATION.md
3. Check browser console for errors
4. Verify database connection

---

**Admin Panel Status:** ✅ Ready to use

All admin pages are fully functional and integrated with the skill module.
