-- Supabase Database Setup for Wedding Memory Wall
-- Run this SQL in your Supabase SQL Editor to create the required tables

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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);

-- Enable Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read memories
CREATE POLICY "Anyone can view memories" ON memories
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert memories
CREATE POLICY "Anyone can insert memories" ON memories
  FOR INSERT WITH CHECK (true);

-- Optional: Create policy to allow updates (if needed)
-- CREATE POLICY "Anyone can update memories" ON memories
--   FOR UPDATE USING (true);

-- Optional: Create policy to allow deletes (if needed)
-- CREATE POLICY "Anyone can delete memories" ON memories
--   FOR DELETE USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
