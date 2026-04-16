# Skill Highlight Images - Deployment Guide

## Pre-Deployment Checklist

- [ ] Database migration applied
- [ ] New components created
- [ ] Types updated
- [ ] Query functions added
- [ ] SkillsAdmin page updated
- [ ] Tests passed
- [ ] Cloudinary preset configured
- [ ] Environment variables set

## Step-by-Step Deployment

### 1. Database Migration

**Option A: Using Supabase Dashboard**

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy content from `database/SKILL_HIGHLIGHT_IMAGES_MIGRATION.sql`
4. Run query
5. Verify migration success

**Option B: Using Supabase CLI**

```bash
supabase db push
```

### 2. Verify Schema

After migration, verify the table structure:

```sql
-- Check table structure
\d public.skill_highlight_images

-- Check indexes
SELECT indexname FROM pg_indexes
WHERE tablename = 'skill_highlight_images';

-- Check data
SELECT COUNT(*) FROM public.skill_highlight_images;
```

### 3. Code Deployment

1. **New Files Created:**
   - `src/components/admin/SkillHighlightImageGallery.tsx`
   - `database/SKILL_HIGHLIGHT_IMAGES_MIGRATION.sql`
   - `docs/SKILL_HIGHLIGHT_IMAGES_GUIDE.md`
   - `docs/SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md`

2. **Files Modified:**
   - `src/pages/admin/SkillsAdmin.tsx` - Added highlight management
   - `src/types/skills.ts` - Added SkillHighlightImage interface
   - `src/lib/supabase-skill-queries.ts` - Added query functions
   - `SUPABASE_SCHEMA_CONSOLIDATED.sql` - Updated schema

3. **Deploy:**

   ```bash
   # Build
   npm run build

   # Test locally
   npm run dev

   # Deploy to production
   npm run deploy
   ```

### 4. Cloudinary Configuration

Ensure upload preset `portfolio_icons` exists and is configured:

1. Go to Cloudinary Dashboard
2. Settings → Upload
3. Verify preset `portfolio_icons` exists
4. Folder: `portfolio/skills/highlights`
5. Format: Allow WebP
6. Quality: 80%

### 5. Environment Variables

Verify `.env.local` has:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 6. Testing

#### Manual Testing

1. **Add Skill with Highlights:**
   - Go to Admin → Skills
   - Click "Add Skill"
   - Fill basic info
   - Add 2-3 highlights
   - Upload 5-6 images
   - Assign images to highlights
   - Set cover images
   - Save and verify

2. **Edit Skill:**
   - Edit existing skill
   - Verify highlights load
   - Verify images load with correct highlight assignments
   - Add new highlight
   - Upload new images
   - Save and verify

3. **Image Operations:**
   - Edit alt text/caption
   - Change highlight assignment
   - Set/unset cover image
   - Delete image
   - Verify all operations work

4. **Database Verification:**
   ```sql
   -- Check skill_highlight_images data
   SELECT
     shi.id,
     shi.skill_id,
     shi.highlight_id,
     sh.title,
     shi.is_cover,
     shi.order_index
   FROM public.skill_highlight_images shi
   JOIN public.skill_highlights sh ON sh.id = shi.highlight_id
   ORDER BY shi.skill_id, shi.highlight_id, shi.order_index;
   ```

#### Automated Testing (if applicable)

```bash
npm run test
```

### 7. Rollback Plan

If issues occur:

1. **Revert Code:**

   ```bash
   git revert <commit-hash>
   npm run build
   npm run deploy
   ```

2. **Revert Database:**

   ```sql
   -- Drop new column if needed
   ALTER TABLE public.skill_highlight_images
   DROP COLUMN IF EXISTS skill_id;

   -- Or restore from backup
   ```

## Post-Deployment

### 1. Monitoring

- Check error logs for upload failures
- Monitor Cloudinary upload quota
- Check database query performance
- Monitor user feedback

### 2. Performance Optimization

If needed:

- Add caching for highlight images
- Optimize image queries
- Consider pagination for large galleries

### 3. Documentation

- Update admin guide with new feature
- Create user tutorial
- Document any customizations

## Troubleshooting

### Migration Failed

**Error: Column already exists**

- Safe to ignore, column already added
- Verify with: `SELECT skill_id FROM public.skill_highlight_images LIMIT 1;`

**Error: Foreign key constraint**

- Ensure skill_highlights table exists
- Ensure skills table exists
- Check data integrity

### Upload Not Working

**Error: 401 Unauthorized**

- Check Cloudinary API key
- Verify upload preset exists
- Check CORS settings

**Error: File too large**

- Max 5MB per file
- Check file size before upload
- Compress images if needed

### Images Not Showing

**Error: 404 Not Found**

- Check Cloudinary URL format
- Verify image uploaded successfully
- Check Cloudinary folder structure

**Error: RLS Policy Denied**

- Check user authentication
- Verify RLS policies
- Check user role permissions

### Database Issues

**Error: Duplicate key**

- Check for duplicate skill_id values
- Verify unique constraints
- Check indexes

**Error: Foreign key violation**

- Ensure highlight exists before assigning
- Check cascade delete settings
- Verify referential integrity

## Rollout Strategy

### Phase 1: Internal Testing (1-2 days)

- Test all features
- Verify database
- Check performance

### Phase 2: Beta Release (3-5 days)

- Deploy to staging
- Limited user testing
- Gather feedback

### Phase 3: Full Release

- Deploy to production
- Monitor closely
- Support users

## Success Criteria

- ✅ All highlights load correctly
- ✅ Images upload successfully
- ✅ Images assign to highlights correctly
- ✅ Cover images work as expected
- ✅ Edit/delete operations work
- ✅ Database queries perform well
- ✅ No errors in console
- ✅ User feedback positive

## Support

For issues or questions:

1. Check troubleshooting section
2. Review logs
3. Check database state
4. Contact development team

## Version History

- **v1.0.0** (2026-04-01): Initial release
  - Upload multiple images per highlight
  - Assign images to highlights
  - Cover image selection
  - Edit metadata
  - Delete images
