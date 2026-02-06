# How to Get Your Supabase Service Role Key

You have the publishable key, but we need the service role key for server-side operations.

## Steps to Get Service Role Key:

1. Go to your Supabase project: https://supabase.com/dashboard/project/rimfsgxzqzausdvgdawj
2. Click on **Settings** (gear icon in left sidebar)
3. Click on **API** in the settings menu
4. Scroll down to **Project API keys** section
5. Find the **service_role** key (it starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
6. Click the **Copy** button next to the service_role key

## Update Your Environment:

Replace the service role key in your `.env.local` file:

```env
SUPABASE_URL=https://rimfsgxzqzausdvgdawj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_0gHLOqmYSIIVNFExeIA2og_XG8sula
```

## Security Note:
- The service role key has admin privileges - keep it secret!
- Never commit it to version control
- Only use it on the server-side (API routes)
- The publishable key is safe for client-side use

## After Adding the Key:

1. Restart your development server: `npm run dev`
2. The upload functionality will work with real Supabase storage
3. Files will be uploaded to your Supabase Storage bucket
4. Metadata will be saved to your Supabase database

## Current Status:

✅ **API Routes Fixed** - Now in correct Astro location  
✅ **Demo Mode Working** - Upload form works with mock data  
⏳ **Waiting for Service Key** - To enable real Supabase integration  

The upload form should now work without the 404 error!
