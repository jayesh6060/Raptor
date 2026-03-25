-- QUICK FIX FOR RECURSION HANG
-- Run this in Supabase SQL Editor to unblock your profile page immediately

-- 1. DROP ALL POLICIES ON PROFILES (Including our new ones for a clean slate)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Teachers and Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can manage student profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage everything." ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_fast" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "simple_select" ON public.profiles;
DROP POLICY IF EXISTS "simple_update" ON public.profiles;
DROP POLICY IF EXISTS "simple_insert" ON public.profiles;

-- 2. ENABLE SIMPLE POLICIES (No recursion)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "simple_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "simple_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "simple_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. ENSURE COLUMNS EXIST
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;

-- 4. FORCE REFRESH
NOTIFY pgrst, 'reload schema';
