-- THE ULTIMATE "FIX IT" SQL SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO RESOLVE ALL HANGING AND SCHEMA ISSUES

-- 1. DROP ALL POTENTIALLY RECURSIVE POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Teachers and Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can manage student profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage everything." ON public.profiles;
DROP POLICY IF EXISTS "Teachers can manage student profiles." ON public.profiles;

-- 2. CREATE CLEAN, NON-RECURSIVE POLICIES
-- Anyone can see any profile (fastest possible SELECT)
CREATE POLICY "profiles_select_policy" ON public.profiles 
FOR SELECT USING (true);

-- Users can only edit THEIR OWN profile (direct ID check, no SELECTs)
CREATE POLICY "profiles_update_policy" ON public.profiles 
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admins can do everything (based on JWT metadata to avoid recursion)
CREATE POLICY "profiles_admin_policy" ON public.profiles 
FOR ALL USING ( (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin' );

-- 3. FIX SCHEMA (Ensure columns exist AND have correct types)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS usn TEXT;
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

-- Explicitly fix types to TEXT to avoid "" vs INTEGER errors
DO $$ 
BEGIN
    ALTER TABLE public.profiles ALTER COLUMN phone TYPE TEXT;
    ALTER TABLE public.profiles ALTER COLUMN roll_number TYPE TEXT;
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Columns already fixed or missing.';
END $$;

-- 4. VERIFY RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. RELOAD SCHEMA CACHE (Internal trick)
NOTIFY pgrst, 'reload schema';
