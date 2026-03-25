-- EMERGENCY OVERRIDE
-- ONLY RUN THIS IF THE FAST_SCHEMA_REPAIR STILL HANGS

-- 1. DISABLE RLS TEMPORARILY (To test if saving works without security)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. RESET POLICIES (Ultra simple)
DROP POLICY IF EXISTS "simple_select" ON public.profiles;
DROP POLICY IF EXISTS "simple_update" ON public.profiles;
DROP POLICY IF EXISTS "simple_insert" ON public.profiles;

CREATE POLICY "final_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "final_update" ON public.profiles FOR ALL USING (auth.uid() = id);

-- 3. RE-ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. ENSURE TYPES
ALTER TABLE public.profiles ALTER COLUMN phone TYPE TEXT;
ALTER TABLE public.profiles ALTER COLUMN roll_number TYPE TEXT;

NOTIFY pgrst, 'reload schema';
