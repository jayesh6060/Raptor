-- ROBUST PROFILE FIX (Case Insensitive)
-- Run this in the Supabase SQL Editor

INSERT INTO public.profiles (id, name, email, role)
SELECT id, 'jayesh', email, 'teacher'
FROM auth.users
WHERE email ILIKE 'jayeshsuthar0621@gmail.com' -- ILIKE is case-insensitive
ON CONFLICT (id) DO UPDATE 
SET name = 'jayesh', role = 'teacher';

-- Final blow to any RLS loops
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
