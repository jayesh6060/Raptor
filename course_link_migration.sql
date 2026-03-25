-- UPDATE: Adding course_id to attendance and notes
-- This connects these features to the new relational Courses model.

-- 1. Update Attendance Table
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- 2. Update Notes Table
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- 3. Update RLS for updated attendance
DROP POLICY IF EXISTS "Teachers can manage their course attendance." ON public.attendance;
CREATE POLICY "Teachers can manage their course attendance." ON public.attendance FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teacher_assignments 
    WHERE teacher_id = auth.uid() AND course_id = public.attendance.course_id
  ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Update RLS for updated notes
DROP POLICY IF EXISTS "Teachers can manage their course notes." ON public.notes;
CREATE POLICY "Teachers can manage their course notes." ON public.notes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teacher_assignments 
    WHERE teacher_id = auth.uid() AND course_id = public.notes.course_id
  ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
