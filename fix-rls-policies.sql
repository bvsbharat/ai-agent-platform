-- Fix RLS policies for mcps table
-- Run this in your Supabase SQL editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "API can insert mcps" ON public.mcps;
DROP POLICY IF EXISTS "API can update mcps" ON public.mcps;

-- Create new policies that allow INSERT and UPDATE operations
CREATE POLICY "API can insert mcps" ON public.mcps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "API can update mcps" ON public.mcps
  FOR UPDATE USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'mcps';