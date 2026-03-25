-- FIX: Adding missing columns to profiles table
-- Run this in your Supabase SQL Editor to resolve the 'column not found' error.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS usn TEXT UNIQUE;

-- Ensure these are TEXT to support alphanumeric and handle empty strings
DO $$ 
BEGIN
    ALTER TABLE public.profiles ALTER COLUMN phone TYPE TEXT;
EXCEPTION WHEN others THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.profiles ALTER COLUMN roll_number TYPE TEXT;
EXCEPTION WHEN others THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS course TEXT;

-- Optional: Re-create the signup trigger function to handle these new fields if they are sent during Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, usn, phone)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'usn',
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
