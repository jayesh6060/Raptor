-- FIX ATTENDANCE SCHEMA AND PERMISSIONS
-- Run this in the Supabase SQL Editor

-- 1. Add course_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attendance' AND column_name = 'course_id') THEN
        ALTER TABLE public.attendance ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Update the UNIQUE constraint
-- First, drop the old one
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_student_id_date_subject_key;
-- Create the new one including course_id
ALTER TABLE public.attendance ADD CONSTRAINT attendance_student_id_date_course_id_key UNIQUE (student_id, date, course_id);

-- 3. Update RLS Policies
-- Allow teachers to manage attendance for their assigned courses
DROP POLICY IF EXISTS "Teachers can manage attendance for their courses." ON public.attendance;
CREATE POLICY "Teachers can manage attendance for their courses." ON public.attendance
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teacher_assignments 
    WHERE teacher_id = auth.uid() 
    AND course_id = attendance.course_id
  )
);

-- Ensure students can view their own records for these courses
DROP POLICY IF EXISTS "Students can view their own course attendance." ON public.attendance;
CREATE POLICY "Students can view their own course attendance." ON public.attendance
FOR SELECT USING (
  student_id = auth.uid()
);

-- Grant permissions to authenticated users (necessary for RLS to work)
GRANT ALL ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
