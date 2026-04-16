# Section Reordering Feature - PHASE 4: Deployment Guide

---

## 📋 Tổng Quan

Hướng dẫn triển khai tính năng Section Reordering lên production.

**Stack**: Next.js + Supabase + dnd-kit

---

## ✅ Pre-Deployment Checklist

Trước khi deploy, đảm bảo tất cả các điều kiện sau được thỏa mãn:

- [ ] **Database**: SQL final đã chạy trên Supabase
  - [ ] Bảng `page_sections` tồn tại
  - [ ] 13 sections đã được seed (8 home + 5 portfolio)
  - [ ] Tất cả RPC functions đã tạo
  - [ ] RLS policies đã cấu hình

- [ ] **Frontend**: Tất cả files PHASE 2 đã tạo
  - [ ] `src/lib/types/sections.ts`
  - [ ] `src/lib/supabase/queries/sections.ts`
  - [ ] `src/hooks/useSectionReorder.ts`
  - [ ] `src/app/admin/sections/components/SectionCard.tsx`
  - [ ] `src/app/admin/sections/components/SortableItem.tsx`
  - [ ] `src/app/admin/sections/components/PageSectionsList.tsx`
  - [ ] `src/app/admin/sections/page.tsx`

- [ ] **Dependencies**: dnd-kit packages đã install
  - [ ] `@dnd-kit/core`
  - [ ] `@dnd-kit/sortable`
  - [ ] `@dnd-kit/utilities`

- [ ] **Testing**: PHASE 3 tests đã pass (hoặc skip)
  - [ ] Drag & drop hoạt động
  - [ ] Move section hoạt động
  - [ ] Fixed section không thể move
  - [ ] Visibility toggle hoạt động
  - [ ] Error handling hoạt động
  - [ ] Concurrent operations không conflict

- [ ] **Build**: Project build thành công
  - [ ] `npm run build` không có error
  - [ ] Không có TypeScript errors
  - [ ] Không có ESLint warnings

- [ ] **Admin Role**: User đã set role = 'admin'
  - [ ] Chạy query: `update public.profiles set role = 'admin' where id = 'your-user-id';`

- [ ] **Backup**: Database đã backup (optional nhưng recommended)

---

## 🚀 Deployment Steps

### Step 1: Verify Build

```bash
# Clean install
rm -rf node_modules
npm install

# Build
npm run build

# Check for errors
echo "Build completed successfully!"
```

**Expected Output**:

```
✓ built in 45.23s
```

### Step 2: Test Build Locally

```bash
# Start production build locally
npm run preview

# Open browser
# http://localhost:4173/admin/sections
```

**Verify**:

- ✅ Page loads without errors
- ✅ Can see Home/Portfolio tabs
- ✅ Sections display correctly
- ✅ Drag & drop works
- ✅ Move button works

### Step 3: Deploy to Vercel (or your hosting)

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts
# - Confirm project
# - Confirm settings
```

#### Option B: Deploy via Git Push

```bash
# Commit changes
git add .
git commit -m "feat: add section reordering feature (PHASE 4 deployment)"

# Push to main branch
git push origin main

# Vercel will auto-deploy (if connected)
```

#### Option C: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments**
4. Click **Deploy** (if manual deploy is enabled)
5. Wait for deployment to complete

### Step 4: Verify Production Deployment

```bash
# Check deployment status
# Go to your production URL: https://your-domain.com/admin/sections

# Verify:
# ✅ Page loads
# ✅ Can see sections
# ✅ Drag & drop works
# ✅ Move section works
# ✅ No console errors
```

**Open DevTools (F12)**:

- Check **Console** tab: No errors
- Check **Network** tab: All requests successful
- Check **Application** tab: Supabase auth working

### Step 5: Monitor Production

```bash
# Check Vercel logs
vercel logs --prod

# Check Supabase logs
# Go to Supabase Dashboard → Logs
# Look for any RPC errors or RLS violations
```

---

## 🔍 Post-Deployment Verification

### Verify Database Connection

```sql
-- Run in Supabase SQL Editor
select count(*) as total_sections
from public.page_sections;
-- Expected: 13
```

### Verify RPC Functions

```sql
-- Check if functions are accessible
select routine_name
from information_schema.routines
where routine_schema = 'public'
and routine_name like '%section%';
-- Expected: 5 functions (reorder, move, toggle_visibility, toggle_published, normalize)
```

### Verify RLS Policies

```sql
-- Check if policies are in place
select policyname, permissive, roles
from pg_policies
where tablename = 'page_sections';
-- Expected: 5 policies (select public, select admin, insert admin, update admin, delete admin)
```

### Test Admin Access

1. Login as admin user
2. Go to `/admin/sections`
3. Verify: Can see all sections
4. Verify: Can drag & drop
5. Verify: Can move sections

### Test Public Access

1. Logout or use incognito
2. Go to `/` (public home page)
3. Verify: Only published + visible sections show
4. Verify: Fixed sections are in correct positions

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" error when accessing `/admin/sections`

**Cause**: User doesn't have admin role

**Fix**:

```sql
-- In Supabase SQL Editor
update public.profiles
set role = 'admin'
where id = 'your-user-id';
```

### Issue: Drag & drop doesn't work in production

**Cause**: dnd-kit not bundled correctly

**Fix**:

```bash
# Rebuild
npm run build

# Redeploy
vercel --prod
```

### Issue: RPC returns "Unauthorized" in production

**Cause**: RLS policy not allowing authenticated users

**Fix**: Check RLS policies in Supabase:

```sql
select * from pg_policies where tablename = 'page_sections';
```

Ensure policies allow authenticated users to execute functions.

### Issue: Sections not loading in production

**Cause**: Supabase connection issue

**Fix**:

1. Check Supabase project is active
2. Check API key is correct in `.env.local`
3. Check RLS policies allow public select

### Issue: Build fails with TypeScript errors

**Cause**: Type mismatch in components

**Fix**:

```bash
# Check types
npm run build

# Fix errors in the reported files
# Redeploy
```

---

## 📊 Deployment Checklist

- [ ] Pre-deployment checklist completed
- [ ] Build successful (`npm run build`)
- [ ] Local preview works (`npm run preview`)
- [ ] Deployed to production
- [ ] Production URL accessible
- [ ] Admin can access `/admin/sections`
- [ ] Drag & drop works in production
- [ ] Move section works in production
- [ ] Public view shows correct sections
- [ ] No console errors
- [ ] Supabase logs show no errors
- [ ] Database verified
- [ ] RPC functions verified
- [ ] RLS policies verified

---

## 🎯 Rollback Plan

If something goes wrong in production:

### Option 1: Rollback via Vercel

```bash
# Go to Vercel Dashboard
# Select your project
# Go to Deployments
# Find previous successful deployment
# Click "Promote to Production"
```

### Option 2: Rollback via Git

```bash
# Find previous commit
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Push
git push origin main

# Vercel will auto-deploy
```

### Option 3: Manual Rollback

```bash
# If needed, remove the feature from production
# Delete or disable the `/admin/sections` route
# Redeploy
```

---

## 📈 Performance Monitoring

### Monitor Vercel Performance

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Analytics**
4. Check:
   - Page load time
   - Core Web Vitals
   - Error rate

### Monitor Supabase Performance

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Logs**
4. Check:
   - RPC execution time
   - Error logs
   - Query performance

### Monitor Frontend Performance

1. Open DevTools (F12)
2. Go to **Performance** tab
3. Record page load
4. Check:
   - Time to Interactive (TTI)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

---

## 🔐 Security Checklist

- [ ] RLS policies are in place
- [ ] Only admin can modify sections
- [ ] Public can only view published sections
- [ ] No sensitive data exposed in frontend
- [ ] API keys not hardcoded
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if applicable)

---

## 📝 Documentation

### Update README

Add to your project README:

```markdown
## Section Reordering Feature

The admin dashboard includes a section reordering feature that allows admins to:

- Drag & drop sections to reorder them
- Move sections between Home and Portfolio pages
- Toggle section visibility
- Manage section publishing status

### Access

- Admin: `/admin/sections`
- Public: Sections appear on home page based on visibility and publishing status

### Database

- Table: `public.page_sections`
- RPC Functions: `reorder_page_sections`, `move_section_to_page`, `toggle_section_visibility`, `toggle_section_published`

### Documentation

- Implementation: `SECTION_REORDERING_IMPLEMENTATION_GUIDE.md`
- Testing: `SECTION_REORDERING_TESTING_GUIDE.md`
- Deployment: `SECTION_REORDERING_DEPLOYMENT_GUIDE.md`
- SQL: `SECTION_REORDERING_FINAL.sql`
```

---

## ✅ Final Checklist

- [x] PHASE 1: Database setup complete
- [x] PHASE 2: Frontend implementation complete
- [x] PHASE 3: Testing complete (or skipped)
- [x] PHASE 4: Deployment complete

---

## 🎉 Deployment Complete!

Your Section Reordering Feature is now live in production!

### Next Steps

1. **Monitor**: Watch Vercel and Supabase logs for any issues
2. **Gather Feedback**: Get feedback from users
3. **Iterate**: Make improvements based on feedback
4. **Scale**: Add more features as needed

### Support

If you encounter any issues:

1. Check troubleshooting section above
2. Review Supabase logs
3. Check Vercel deployment logs
4. Review browser console for errors

---

## 📚 References

- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-to-prod)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [dnd-kit Documentation](https://docs.dndkit.com/)

---

**Deployment Date**: [Your Date]
**Deployed By**: [Your Name]
**Status**: ✅ LIVE
