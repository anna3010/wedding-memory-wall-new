# 🚨 Supabase Table Setup Required

## Problem Identified
The error message shows:
```
Could not find the table 'public.memories' in the schema cache
```

This means the **`memories` table doesn't exist** in your Supabase database yet.

## 🛠️ Quick Fix (2 minutes)

### **Step 1: Go to Supabase SQL Editor**
1. Visit: https://supabase.com/dashboard/project/rimfsgxzqzausdvgdawj
2. Click **"SQL Editor"** in the left sidebar
3. Copy the SQL below and paste it into the editor
4. Click **"Run"** button

### **Step 2: Create Storage Bucket**
1. Click **"Storage"** in the left sidebar  
2. Click **"Create new bucket"**
3. Enter bucket name: `wedding-memories`
4. Make it **Public** bucket
5. Click **"Save"**

## 📋 SQL to Run

```sql
-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio')),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);

-- Enable Row Level Security
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view memories" ON memories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert memories" ON memories  
  FOR INSERT WITH CHECK (true);

-- Create function for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## ✅ After Running SQL

1. **Refresh the page** - The gallery should load without errors
2. **Test upload** - Files will be stored in Supabase Storage
3. **Check realtime** - New memories appear instantly

## 🔍 Verification

To verify the table was created:
```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'memories';
```

The error should disappear immediately after running the SQL! 🎯
