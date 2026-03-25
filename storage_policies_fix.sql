-- ====================================================================
-- FINAL COMPREHENSIVE FIX: NOTES SCHEMA, STORAGE, AND POLICIES
-- ====================================================================

-- 1. REPAIR TABLE SCHEMA
-- Ensure the required columns exist for the UI to function
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'notes';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id);

-- 2. ENSURE RLS IS ACTIVE
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 3. DROP ALL PREVIOUS POLICIES TO START FRESH
DROP POLICY IF EXISTS "Notes are viewable by everyone." ON public.notes;
DROP POLICY IF EXISTS "Public Read Notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can manage notes." ON public.notes;
DROP POLICY IF EXISTS "Admins and Teachers can manage notes" ON public.notes;
DROP POLICY IF EXISTS "Allow public read access" ON public.notes;
DROP POLICY IF EXISTS "Allow admins and teachers to manage" ON public.notes;

-- 4. CREATE CLEAN DATABASE POLICIES
-- Allow anyone (students, teachers, admins) to view notes
CREATE POLICY "Allow public read access" 
ON public.notes FOR SELECT 
USING (true);

-- Allow Admins and Teachers to perform all actions (Insert, Update, Delete)
CREATE POLICY "Allow admins and teachers to manage" 
ON public.notes FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  )
);

-- 5. REPAIR STORAGE POLICIES
-- Ensure the notes bucket is correctly configured
UPDATE storage.buckets SET public = true WHERE id = 'notes';

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Full Access" ON storage.objects;
DROP POLICY IF EXISTS "public acces 1qipc1_0" ON storage.objects;

-- Allow public reading of files
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'notes');

-- Allow admins/teachers to upload and manage files
CREATE POLICY "Admin/Teacher Storage Access"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'notes' AND
  (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  ))
)
WITH CHECK (
  bucket_id = 'notes' AND
  (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  ))
);

-- ====================================================================
-- SUCCESS VERIFICATION COMMANDS (Run these to verify status)
-- ====================================================================
-- SELECT * FROM public.notes; 
-- (Should show your uploaded records with course_id and category)
