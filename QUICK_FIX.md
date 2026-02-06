# 🚨 Quick Fix for Table Not Found Error

## Problem
Supabase can't find the `memories` table, so you get:
```
Could not find the table 'public.memories' in the schema cache
```

## 🛠️ 2-Minute Fix

### **Option 1: Create Table via Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/rimfsgxzqzausdvgdawj
2. Click **"SQL Editor"** (left sidebar)
3. Paste this simple SQL:
```sql
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio')),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
4. Click **"Run"** → **"Success!"** should appear

### **Option 2: Use Supabase CLI (Faster)**
If you have the Supabase CLI installed:
```bash
# Install if needed
npm install -g @supabase/cli

# Login and create table
supabase login
supabase db push --schema=public << 'EOF'
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio')),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
EOF
```

## ✅ After Creating Table

1. **Refresh browser** - The error should disappear
2. **Test upload** - Should work with real Supabase
3. **Check gallery** - Should show uploaded memories

## 🎯 Expected Result

The gallery will load without the "table not found" error and you can:
- ✅ Upload real files to Supabase Storage
- ✅ Store metadata in Supabase Database
- ✅ See memories appear in gallery
- ✅ Use realtime updates

**Choose Option 1 for easiest fix!** 🚀
