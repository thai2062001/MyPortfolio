# Skill Highlight Images Feature

## 🎯 Overview

Tính năng upload ảnh cho highlight trong skill detail đã được triển khai hoàn chỉnh. Admin có thể:

✅ Upload nhiều ảnh cho từng highlight  
✅ Gắn ảnh vào highlight cụ thể  
✅ Chọn cover image cho mỗi highlight  
✅ Edit metadata (alt text, caption)  
✅ Quản lý highlights trực tiếp trong form  
✅ Xóa ảnh và highlights

## 📁 What's New

### New Files

```
src/components/admin/SkillHighlightImageGallery.tsx    # Main component
database/SKILL_HIGHLIGHT_IMAGES_MIGRATION.sql          # Database migration
src/test/skill-highlight-images.test.ts                # Unit tests
docs/SKILL_HIGHLIGHT_IMAGES_GUIDE.md                   # Technical guide
docs/SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md              # Deployment guide
docs/SKILL_HIGHLIGHT_IMAGES_QUICK_START.md             # Admin quick start
docs/SKILL_HIGHLIGHT_IMAGES_IMPLEMENTATION_SUMMARY.md  # Implementation summary
```

### Modified Files

```
src/pages/admin/SkillsAdmin.tsx                         # Added highlight management
src/types/skills.ts                                    # Added SkillHighlightImage type
src/lib/supabase-skill-queries.ts                      # Added query functions
SUPABASE_SCHEMA_CONSOLIDATED.sql                       # Updated schema
```

## 🚀 Quick Start

### For Admins

1. Go to **Admin → Skills**
2. Click **"Add Skill"** or **"Edit"** existing skill
3. Create highlights in **"Skill Highlights"** section
4. Upload images in **"Highlight Images Gallery"** section
5. Assign images to highlights by clicking edit (✏️)
6. Set cover image by clicking star (⭐)
7. Click **"Save"** to save everything

👉 **Detailed Guide:** See `docs/SKILL_HIGHLIGHT_IMAGES_QUICK_START.md`

### For Developers

1. **Database Migration:**

   ```bash
   # Run migration in Supabase SQL Editor
   # File: database/SKILL_HIGHLIGHT_IMAGES_MIGRATION.sql
   ```

2. **Code Review:**
   - Main component: `src/components/admin/SkillHighlightImageGallery.tsx`
   - Updated page: `src/pages/admin/SkillsAdmin.tsx`
   - New types: `src/types/skills.ts`
   - New queries: `src/lib/supabase-skill-queries.ts`

3. **Testing:**

   ```bash
   npm run test
   ```

4. **Deployment:**
   ```bash
   npm run build
   npm run deploy
   ```

👉 **Detailed Guide:** See `docs/SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md`

## 📊 Architecture

### Database Schema

```
skills (1) ──── (many) skill_highlights
                           │
                           └──── (many) skill_highlight_images
```

**New Table: `skill_highlight_images`**

- `id`: UUID (primary key)
- `skill_id`: UUID (FK to skills)
- `highlight_id`: UUID (FK to skill_highlights)
- `image_url`: TEXT (Cloudinary URL)
- `alt_text`: TEXT (accessibility)
- `caption`: TEXT (description)
- `is_cover`: BOOLEAN (cover image flag)
- `order_index`: INTEGER (sort order)
- `created_at`, `updated_at`: TIMESTAMPTZ

### Component Structure

```
SkillsAdmin
├─ Skill Form
│  ├─ Basic Fields
│  ├─ Highlights Management
│  │  ├─ Add/Edit Highlight Form
│  │  └─ Highlights List
│  └─ SkillHighlightImageGallery
│     ├─ Upload Area
│     ├─ Images List
│     └─ Image Actions
└─ Skills Table
```

## 🎨 UI/UX Features

### Highlight Image Card

- Thumbnail preview
- Alt text display
- Caption display
- Highlight badge (blue) or "Unassigned" (gray)
- Cover badge (yellow) if is_cover = true
- Action buttons: Edit (✏️), Set Cover (⭐), Delete (✕)

### Highlight Assignment

- Dropdown to select highlight
- Badge shows current assignment
- Can change anytime
- Unassigned images show gray badge

### Cover Image

- Only one per highlight
- Star icon to toggle
- Auto-removes cover from other images
- Only available after highlight assignment

## 🔧 Configuration

### Cloudinary

- **Upload Preset:** `portfolio_icons`
- **Folder:** `portfolio/skills/highlights`
- **Format:** WebP (auto-converted)
- **Quality:** 80%
- **Max Size:** 5MB per file

### Environment Variables

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 📚 Documentation

| Document                                           | Purpose                 |
| -------------------------------------------------- | ----------------------- |
| `SKILL_HIGHLIGHT_IMAGES_QUICK_START.md`            | Admin user guide        |
| `SKILL_HIGHLIGHT_IMAGES_GUIDE.md`                  | Technical documentation |
| `SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md`             | Deployment checklist    |
| `SKILL_HIGHLIGHT_IMAGES_IMPLEMENTATION_SUMMARY.md` | Implementation details  |

## ✅ Testing

### Manual Testing Checklist

- [ ] Add skill with highlights
- [ ] Upload highlight images
- [ ] Assign images to highlights
- [ ] Set cover images
- [ ] Edit image metadata
- [ ] Delete images
- [ ] Edit existing skill
- [ ] Verify database data
- [ ] Test on mobile
- [ ] Test error scenarios

### Unit Tests

```bash
npm run test -- skill-highlight-images
```

## 🐛 Troubleshooting

### Upload Failed

- Check file size (max 5MB)
- Check file format (must be image)
- Check internet connection
- Check Cloudinary quota

### Can't Assign Highlight

- Create highlight first
- Refresh page if highlights not showing
- Try again

### Cover Image Not Showing

- Assign image to highlight first
- Only one cover per highlight
- Try setting different image

### Images Not Saving

- Click "Save" button at bottom
- Wait for success message
- Check for error messages

👉 **More Help:** See `docs/SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md` → Troubleshooting

## 📈 Performance

### Database Optimization

- Indexed on `skill_id` for fast queries
- Indexed on `highlight_id` for fast queries
- Indexed on `is_cover` for fast cover queries

### Image Optimization

- Auto WebP conversion (smaller files)
- Cloudinary CDN for fast delivery
- Lazy loading in UI

### Scalability

- Supports unlimited images per skill
- Recommended max 20 images per skill
- Pagination can be added if needed

## 🔐 Security

### RLS Policies

- Public can view images of published skills
- Authenticated users can manage images
- Cascade delete when highlight deleted

### Validation

- File type validation (images only)
- File size validation (max 5MB)
- Highlight existence validation
- Skill existence validation

## 🚢 Deployment

### Pre-Deployment

- [ ] Database migration applied
- [ ] Code reviewed
- [ ] Tests passed
- [ ] Documentation updated
- [ ] Cloudinary configured

### Deployment Steps

1. Run database migration
2. Deploy code
3. Run tests
4. Monitor logs
5. Gather user feedback

### Rollback

If issues occur:

1. Revert code changes
2. Revert database changes (if needed)
3. Restore from backup

👉 **Detailed Steps:** See `docs/SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md`

## 📝 API Reference

### Query Functions

```typescript
// Get all highlight images for a skill
getSkillHighlightImages(skillId: string): Promise<SkillHighlightImage[]>

// Get images for a specific highlight
getHighlightImages(highlightId: string): Promise<SkillHighlightImage[]>

// Get cover image for a highlight
getHighlightCoverImage(highlightId: string): Promise<SkillHighlightImage | null>
```

### Component Props

```typescript
interface SkillHighlightImageGalleryProps {
  skillId: string;
  highlights: SkillHighlight[];
  onImagesChange?: (images: SkillHighlightImage[]) => void;
}
```

## 🎓 Learning Resources

- **For Admins:** `docs/SKILL_HIGHLIGHT_IMAGES_QUICK_START.md`
- **For Developers:** `docs/SKILL_HIGHLIGHT_IMAGES_GUIDE.md`
- **For DevOps:** `docs/SKILL_HIGHLIGHT_IMAGES_DEPLOYMENT.md`
- **Code Comments:** See component files

## 🔄 Version History

- **v1.0.0** (2026-04-01): Initial release
  - Upload multiple images per highlight
  - Assign images to highlights
  - Cover image selection
  - Edit metadata
  - Delete images
  - Highlight management in form

## 🤝 Support

### Getting Help

1. Check documentation
2. Check browser console for errors
3. Check database state
4. Contact development team

### Reporting Issues

- Include error message
- Include steps to reproduce
- Include browser/OS info
- Include database state if applicable

## 📞 Contact

For questions or issues:

- Check documentation first
- Review code comments
- Contact development team

## 📄 License

Same as main project

---

**Last Updated:** April 1, 2026  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production
