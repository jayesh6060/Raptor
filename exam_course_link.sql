-- UPDATE: Linking Exams to Courses
-- This follows the same relational patterns established for Attendance and Notes.

-- 1. Update Exams Table
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- 2. Update RLS for course-based exam management
DROP POLICY IF EXISTS "Teachers can manage their course exams." ON public.exams;
CREATE POLICY "Teachers can manage their course exams." ON public.exams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teacher_assignments 
    WHERE teacher_id = auth.uid() AND course_id = public.exams.course_id
  ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Ensure questions follow the exam access
DROP POLICY IF EXISTS "Questions access via exam." ON public.questions;
CREATE POLICY "Questions access via exam." ON public.questions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.exams e
    JOIN public.teacher_assignments ta ON ta.course_id = e.course_id
    WHERE e.id = public.questions.exam_id AND ta.teacher_id = auth.uid()
  ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
