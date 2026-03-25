-- Teacher Permissions Fix
-- This script grants users with the 'teacher' role the same management permissions as 'admin'
-- for educational entities (attendance, notes, exams, etc.)

-- 1. Attendance access for teachers
DROP POLICY IF EXISTS "Teachers can manage attendance." ON public.attendance;
CREATE POLICY "Teachers can manage attendance." ON public.attendance FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 2. Notes management for teachers
DROP POLICY IF EXISTS "Teachers can manage notes." ON public.notes;
CREATE POLICY "Teachers can manage notes." ON public.notes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 3. Exams management for teachers
DROP POLICY IF EXISTS "Teachers can manage exams." ON public.exams;
CREATE POLICY "Teachers can manage exams." ON public.exams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

DROP POLICY IF EXISTS "Teachers can manage questions." ON public.questions;
CREATE POLICY "Teachers can manage questions." ON public.questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 4. Submissions (Results) viewable by teachers
DROP POLICY IF EXISTS "Teachers can view submissions." ON public.submissions;
CREATE POLICY "Teachers can view submissions." ON public.submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 5. Profiles (Student records) manageability for teachers
-- Note: Teachers can now manage student profiles (needed for the student directory)
DROP POLICY IF EXISTS "Teachers can manage student profiles." ON public.profiles;
CREATE POLICY "Teachers can manage student profiles." ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
