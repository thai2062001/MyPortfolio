# Section Reordering - Quick Deployment Checklist

**Status**: ✅ Ready for Production

---

## 🚀 Quick Deploy (5 minutes)

### 1. Verify Build ✅

```bash
npm run build
# ✅ Built successfully in 6.13s
```

### 2. Test Locally

```bash
npm run preview
# Open: http://localhost:4173/admin/sections
# Verify: Sections load, drag & drop works
```

### 3. Deploy to Vercel

**Option A: CLI**

```bash
vercel --prod
```

**Option B: Git Push**

```bash
git add .
git commit -m "feat: section reordering feature deployment"
git push origin main
```

**Option C: Dashboard**

- Go to Vercel Dashboard
- Click Deploy

### 4. Verify Production

```
https://your-domain.com/admin/sections
✅ Page loads
✅ Sections visible
✅ Drag & drop works
✅ No console errors
```

---

## ✅ Pre-Deploy Checklist

- [x] Database: SQL deployed to Supabase
- [x] Frontend: All 7 components created
- [x] Dependencies: @dnd-kit packages installed
- [x] Build: `npm run build` successful
- [x] Admin Role: User has role = 'admin'
- [x] No TypeScript errors
- [x] No ESLint warnings

---

## 📊 What's Deployed

### Database (Supabase)

- ✅ Table: `page_sections` (13 sections)
- ✅ Enums: `section_type_enum`, `page_type_enum`, `section_data_source_enum`
- ✅ RPC Functions: 5 functions
- ✅ RLS Policies: 5 policies
- ✅ Indexes: 4 indexes

### Frontend (Next.js)

- ✅ Types: `src/lib/types/sections.ts`
- ✅ Queries: `src/lib/supabase/queries/sections.ts`
- ✅ Hook: `src/hooks/useSectionReorder.ts`
- ✅ Components: 3 components (SectionCard, SortableItem, PageSectionsList)
- ✅ Page: `src/app/admin/sections/page.tsx`

### Features

- ✅ Drag & drop reorder sections
- ✅ Move sections between pages
- ✅ Fixed sections (cannot move)
- ✅ Visibility toggle
- ✅ Error handling & rollback
- ✅ Optimistic UI updates

---

## 🔍 Post-Deploy Verification

### In Production

1. Login as admin
2. Go to `/admin/sections`
3. Verify:
   - ✅ Home tab shows 8 sections
   - ✅ Portfolio tab shows 5 sections
   - ✅ Can drag sections
   - ✅ Can move sections between pages
   - ✅ Fixed sections have "Fixed" badge
   - ✅ Eye icon toggles visibility

### Database

```sql
-- Verify sections exist
select count(*) from public.page_sections;
-- Expected: 13

-- Verify functions exist
select routine_name from information_schema.routines
where routine_schema = 'public' and routine_name like '%section%';
-- Expected: 5 functions
```

---

## 🐛 If Something Goes Wrong

### Build Fails

```bash
rm -rf node_modules
npm install
npm run build
```

### Drag & Drop Doesn't Work

- Check browser console for errors
- Verify @dnd-kit packages installed
- Refresh page

### RPC Returns "Unauthorized"

```sql
-- Set admin role
update public.profiles set role = 'admin' where id = 'your-user-id';
```

### Sections Not Loading

- Check Supabase connection
- Verify RLS policies
- Check browser console

---

## 📈 Monitoring

### Vercel

- Dashboard: https://vercel.com/dashboard
- Check: Deployments, Analytics, Logs

### Supabase

- Dashboard: https://supabase.com/dashboard
- Check: Logs, Database, Functions

### Browser

- DevTools (F12)
- Console: Check for errors
- Network: Check RPC calls

---

## ✅ Deployment Complete!

**Next Steps**:

1. Monitor production for 24 hours
2. Gather user feedback
3. Fix any issues
4. Plan next features

**Documentation**:

- Full guide: `SECTION_REORDERING_DEPLOYMENT_GUIDE.md`
- Implementation: `SECTION_REORDERING_IMPLEMENTATION_GUIDE.md`
- Testing: `SECTION_REORDERING_TESTING_GUIDE.md`
- SQL: `SECTION_REORDERING_FINAL.sql`

---

**Deployed**: [Date]
**Status**: ✅ LIVE
**Build Time**: 6.13s
**Features**: 6 (Reorder, Move, Fixed, Visibility, Error Handling, Concurrent Ops)
