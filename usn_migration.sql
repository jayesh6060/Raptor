-- Run this in the Supabase SQL Editor to add USN functionality

-- 1. Create the valid_usns table
CREATE TABLE IF NOT EXISTS public.valid_usns (
  usn TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on valid_usns
ALTER TABLE public.valid_usns ENABLE ROW LEVEL SECURITY;

-- Allow unauthenticated public to read valid USNs (needed during signup)
DROP POLICY IF EXISTS "Anyone can check valid USNs" ON public.valid_usns;
CREATE POLICY "Anyone can check valid USNs" ON public.valid_usns FOR SELECT USING (true);

-- Allow admins full access to valid_usns
DROP POLICY IF EXISTS "Admins can manage valid USNs" ON public.valid_usns;
CREATE POLICY "Admins can manage valid USNs" ON public.valid_usns 
FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. Add usn column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS usn TEXT UNIQUE;

-- 3. Update the handle_new_user function to grab the usn from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, usn)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'usn'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- 4. Insert a test USN so you can test student signup
INSERT INTO public.valid_usns (usn) VALUES ('1RV20CS001') ON CONFLICT DO NOTHING;
