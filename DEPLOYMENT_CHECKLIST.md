# 🚀 Cloudflare Pages Deployment Checklist

## ✅ Completed Setup
- [x] Removed Vercel adapter from Astro config
- [x] Deleted vercel.json
- [x] Deleted /api folder (serverless functions)
- [x] Updated Supabase client for direct uploads
- [x] Updated UploadForm to use direct Supabase uploads
- [x] Updated MemoryGallery to use direct Supabase fetch
- [x] Fixed file type filtering (file_type vs type)
- [x] Build works locally (dist/ folder generated)
- [x] Updated .env.example for Cloudflare Pages

## 🎯 Next Steps for Deployment

### 1. Supabase Setup (if not done)
```sql
-- Create storage bucket
-- In Supabase Dashboard: Storage → Create bucket "memories" (Public: YES)

-- Create database table
create table memories (
  id uuid default gen_random_uuid() primary key,
  file_url text not null,
  file_type text not null,
  guest_name text,
  message text,
  created_at timestamp with time zone default now()
);

-- Add storage policy
-- In Storage → Policies → memories bucket
-- Add SELECT + INSERT policy for public: true
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for Cloudflare Pages deployment"
git push origin main
```

### 3. Cloudflare Pages Setup
1. Go to Cloudflare Dashboard → Pages → Create Project
2. Connect GitHub repo
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`

### 4. Environment Variables
In Cloudflare Pages → Settings → Environment Variables:
- `PUBLIC_SUPABASE_URL`: your Supabase URL
- `PUBLIC_SUPABASE_ANON_KEY`: your anon key

### 5. Deploy!
Click Deploy and you'll get: `https://your-project.pages.dev`

## 🎉 Architecture Summary
```
Guest phone/browser
→ Astro site (Cloudflare Pages)
→ Supabase Storage (files)
→ Supabase DB (metadata)
```

No backend, no serverless, no permissions hell! 🌸
