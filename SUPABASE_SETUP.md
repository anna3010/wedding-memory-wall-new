# Supabase Setup Guide

This guide will help you set up Supabase for the Wedding Memory Wall application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with your GitHub account
4. Create a new organization (or use existing)
5. Click "New Project"
6. Choose your organization
7. Set project name: `wedding-memory-wall`
8. Set a strong database password
9. Choose a region close to your users
10. Click "Create new project"

## 2. Set up Database Table

1. Once your project is ready, go to the SQL Editor
2. Copy the contents of `supabase-setup.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

This will create:
- `memories` table with proper columns
- Indexes for performance
- Row Level Security policies
- Automatic timestamp updates

## 3. Set up Storage Bucket

1. Go to the "Storage" section in your Supabase dashboard
2. Click "Create new bucket"
3. Set bucket name: `wedding-memories`
4. Set as "Public bucket" (so files can be accessed via URL)
5. Click "Save"

## 4. Get Environment Variables

1. Go to Project Settings → API
2. Copy the following values:

**Project URL:**
```
https://your-project-id.supabase.co
```

**Service Role Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
⚠️ **Keep this key secret!** Never expose it in client-side code.

## 5. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and replace the placeholder values:
```env
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Important:**
- `SUPABASE_SERVICE_ROLE_KEY` is for server-side operations only
- `PUBLIC_SUPABASE_ANON_KEY` is safe for client-side usage and enables realtime features
- Never commit `.env.local` to version control

## 6. Install Dependencies

Install the required packages:
```bash
npm install @supabase/supabase-js formidable
```

## 7. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Try uploading a test image or audio file through the upload form
3. Check the Supabase dashboard:
   - Go to Storage → wedding-memories to see uploaded files
   - Go to Table Editor → memories to see metadata

## 8. Deploy to Vercel

When deploying to Vercel, add the environment variables:

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add:
   - `SUPABASE_URL` (your project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (your service role key)
   - `PUBLIC_SUPABASE_ANON_KEY` (your anon key)

## Security Notes

- The Service Role Key has admin privileges - keep it secret
- Row Level Security is enabled on the memories table
- Files are stored in a public bucket but with random filenames
- File size and type validation happens server-side
- Consider adding rate limiting for production use

## Troubleshooting

**File upload fails:**
- Check Supabase URL and Service Role Key are correct
- Ensure the storage bucket exists and is public
- Check file size doesn't exceed 10MB

**Database errors:**
- Run the SQL setup script again
- Check RLS policies are correctly configured
- Verify table schema matches the setup script

**Environment variables not working:**
- Ensure `.env.local` is in the project root
- Restart the development server after changing variables
- Check for typos in variable names
