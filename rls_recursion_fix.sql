-- FIX FOR INFINITE RLS RECURSION
-- This script replaces recursive policies with efficient ones using JWT metadata.

-- 1. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Teachers can manage student profiles." ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage everything." ON public.attendance;
DROP POLICY IF EXISTS "Admins can manage notes." ON public.notes;
DROP POLICY IF EXISTS "Admins can manage exams." ON public.exams;
DROP POLICY IF EXISTS "Admins can manage questions." ON public.questions;

-- 2. Create non-recursive policies for Profiles
-- This allows teachers/admins to see all profiles without re-querying the profiles table for their own role
CREATE POLICY "Teachers and Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = id OR 
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'teacher')
);

-- 3. Update the "Teachers can manage profiles" to be safer
CREATE POLICY "Teachers can manage student profiles" 
ON public.profiles FOR ALL 
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'teacher')
);

-- 4. Ensure users can ALWAYS handle their own profile
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can manage own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Fix Attendance delegation
DROP POLICY IF EXISTS "Admins can manage everything." ON public.attendance;
CREATE POLICY "Privileged roles can manage attendance" 
ON public.attendance FOR ALL 
USING (
  auth.uid() = student_id OR 
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('admin', 'teacher')
);
