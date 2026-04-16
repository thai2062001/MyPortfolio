# Task 9: Projects Bilingual - Deployment Checklist

## Pre-Deployment

### Code Review

- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] All imports correct
- [x] No breaking changes

### Database

- [ ] Backup your Supabase database
- [ ] Review migration script: `database/ADD_JAPANESE_COLUMNS_TO_PROJECTS.sql`
- [ ] Test migration on staging database first

### Testing

- [ ] Test on local environment
- [ ] Test form with new project
- [ ] Test form with existing project
- [ ] Test auto-translate feature
- [ ] Test on mobile devices
- [ ] Test form validation

## Deployment Steps

### Step 1: Database Migration

```
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Open: database/ADD_JAPANESE_COLUMNS_TO_PROJECTS.sql
4. Copy and paste the SQL
5. Execute the migration
6. Verify: Check projects table has new columns
```

### Step 2: Deploy Code

```
1. Commit changes to git
2. Push to main branch
3. Deploy to production
4. Verify deployment successful
```

### Step 3: Verify Deployment

```
1. Go to /admin/projects
2. Click "Add New Project"
3. Verify language tabs appear
4. Verify auto-translate button works
5. Test form submission
6. Verify data saves correctly
```

## Post-Deployment

### Verification

- [ ] Form loads without errors
- [ ] Language tabs work
- [ ] Auto-translate works
- [ ] Form submission saves both languages
- [ ] Edit mode loads bilingual data
- [ ] No console errors

### Monitoring

- [ ] Check error logs
- [ ] Monitor database performance
- [ ] Check user feedback
- [ ] Monitor API usage (MyMemory)

### Documentation

- [ ] Update team documentation
- [ ] Share quick start guide with team
- [ ] Document any custom configurations

## Rollback Plan

If issues occur:

### Quick Rollback

```
1. Revert code deployment
2. Database columns remain (safe to keep)
3. Form will work with English fields only
4. No data loss
```

### Full Rollback

```
1. Revert code deployment
2. Run rollback SQL (if needed):
   ALTER TABLE public.projects DROP COLUMN IF EXISTS title_ja;
   ALTER TABLE public.projects DROP COLUMN IF EXISTS short_description_ja;
   -- ... etc for all _ja columns
3. Restore from backup if needed
```

## Troubleshooting

### Issue: Auto-translate not working

**Solution:**

- Check internet connection
- Verify MyMemory API is accessible
- Check browser console for errors
- Try again (API might be temporarily down)

### Issue: Japanese fields not saving

**Solution:**

- Verify migration was run
- Check Supabase connection
- Check browser console for errors
- Verify database has new columns

### Issue: Form not showing tabs

**Solution:**

- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check JavaScript is enabled
- Check browser console for errors

### Issue: Data loss when switching tabs

**Solution:**

- This shouldn't happen - report as bug
- Check browser console for errors
- Try in different browser
- Clear cache and try again

## Support Resources

- Implementation Guide: `docs/PROJECTS_BILINGUAL_IMPLEMENTATION.md`
- Quick Start: `PROJECTS_BILINGUAL_QUICK_START.md`
- Verification: `TASK_9_COMPLETION_VERIFICATION.md`
- Migration Script: `database/ADD_JAPANESE_COLUMNS_TO_PROJECTS.sql`

## Sign-Off

- [ ] Code reviewed
- [ ] Database backed up
- [ ] Migration tested
- [ ] Deployment successful
- [ ] Verification complete
- [ ] Team notified

## Timeline

- Pre-deployment: 15 minutes
- Database migration: 5 minutes
- Code deployment: 10 minutes
- Verification: 10 minutes
- **Total: ~40 minutes**

## Notes

- Migration is backward compatible
- No data loss expected
- Can be deployed during business hours
- No downtime required
- Rollback is simple if needed

---

**Status**: Ready for deployment ✅
**Risk Level**: Low
**Estimated Time**: 40 minutes
