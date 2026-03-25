-- MANUAL PROFILE FORCE-FIX
-- Run this in the Supabase SQL Editor to manually set up your account.

INSERT INTO public.profiles (id, name, email, role)
SELECT id, 'jayesh', email, 'teacher'
FROM auth.users
WHERE email = 'jayeshsuthar0621@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET name = 'jayesh', role = 'teacher';

-- Also ensure RLS is not blocking you from seeing your own work
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
