-- Create a file to fix RLS policies
-- Run this in your Supabase SQL Editor

-- 1. Policies for SITES table
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Remove valid strict policies if they exist (optional, to be safe)
DROP POLICY IF EXISTS "Authenticated users can read sites" ON public.sites;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sites;

-- Add a policy that allows EVERYONE (anon and authenticated) to read sites
CREATE POLICY "Enable read access for all users" 
ON public.sites FOR SELECT 
USING (true);


-- 2. Policies for INTERVENTIONS table
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- Remove strict policies
DROP POLICY IF EXISTS "Authenticated users can read interventions" ON public.interventions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.interventions;

-- Add a policy that allows EVERYONE to read interventions
CREATE POLICY "Enable read access for all users" 
ON public.interventions FOR SELECT 
USING (true);
