-- migration: courses_and_enrollments
-- This migration introduces the relational architecture connecting Teachers and Students.
-- Run this in your Supabase SQL Editor to apply the changes.

-- 1. Create Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- e.g., 'CS101'
  name TEXT NOT NULL,        -- e.g., 'Introduction to Computer Science'
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Teacher Assignments Table (Many-to-Many: Teachers <-> Courses)
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(course_id, teacher_id)
);

-- 3. Create Enrollments Table (Many-to-Many: Students <-> Courses)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(course_id, student_id)
);

-- 4. Enable RLS protecting these tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Courses
DROP POLICY IF EXISTS "Courses are viewable by everyone." ON public.courses;
CREATE POLICY "Courses are viewable by everyone." ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage courses." ON public.courses;
CREATE POLICY "Admins can manage courses." ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. RLS Policies for Teacher Assignments
DROP POLICY IF EXISTS "Teacher assignments are viewable by everyone." ON public.teacher_assignments;
CREATE POLICY "Teacher assignments are viewable by everyone." ON public.teacher_assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage teacher assignments." ON public.teacher_assignments;
CREATE POLICY "Admins can manage teacher assignments." ON public.teacher_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. RLS Policies for Enrollments
DROP POLICY IF EXISTS "Enrollments viewable by relevant users." ON public.enrollments;
CREATE POLICY "Enrollments viewable by relevant users." ON public.enrollments FOR SELECT USING (
  student_id = auth.uid() 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM public.teacher_assignments WHERE teacher_id = auth.uid() AND course_id = enrollments.course_id)
);

DROP POLICY IF EXISTS "Admins can manage enrollments." ON public.enrollments;
CREATE POLICY "Admins can manage enrollments." ON public.enrollments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Teachers can enroll students to their courses." ON public.enrollments;
CREATE POLICY "Teachers can enroll students to their courses." ON public.enrollments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.teacher_assignments WHERE teacher_id = auth.uid() AND course_id = enrollments.course_id)
);
