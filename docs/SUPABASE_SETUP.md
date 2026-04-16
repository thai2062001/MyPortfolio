# 🚀 Supabase Quick Setup Guide (Standardized)

This guide provides the fastest way to set up the database for the Radiant Growth Portfolio.

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings > API**, copy your `URL` and `anon public` key.

## 2. Environment Configuration
Create or update `.env.local` in the project root:
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Database Initialization (CRITICAL)
To set up all tables, RLS policies, and the new **Trilingual (EN, JA, VI)** support:

1. Open the file [SUPABASE_SCHEMA_CONSOLIDATED.sql](../SUPABASE_SCHEMA_CONSOLIDATED.sql) in this repository.
2. Copy the **ENTIRE** content of the file.
3. Go to your Supabase Dashboard → **SQL Editor**.
4. Create a **New Query**, paste the code, and click **Run**.

### 🌟 Trilingual Support Columns
The system now uses a standard suffix pattern for all content:
- `column_name` (e.g. `title`): **English** (Standard/Fallback)
- `column_name_ja` (e.g. `title_ja`): **Japanese**
- `column_name_vi` (e.g. `title_vi`): **Vietnamese**

> [!IMPORTANT]
> The consolidated script automatically handles everything. No additional patches are required for trilingual support.

## 4. Authentication Setup
1. Go to **Authentication > Providers**.
2. Ensure **Email/Password** is enabled.
3. Go to **Authentication > Users** and "Invite" your admin email.
4. Set your password via the invitation email or manually in the dashboard.

## 5. Image Hosting (Cloudinary)
For high-performance image management:
1. Create a [Cloudinary](https://cloudinary.com) account.
2. Create an **Unsigned Upload Preset** named `portfolio_upload`.
3. Add credentials to `.env.local`:
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=portfolio_upload
```

## 6. Run the Project
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The Admin Portal will be available at: `http://localhost:8080/admin`

---
*Last updated: 2026-04-13 with Trilingual (EN, JA, VI) Support.*
