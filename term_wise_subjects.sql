-- TERM-WISE SUBJECTS (VTU 2022 SCHEME)
-- Run this in the Supabase SQL Editor

-- 1. Add semester column
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1;

-- 2. Insert Semester 1 subjects
INSERT INTO public.courses (code, name, department, semester)
VALUES 
  ('BMATS101', 'Mathematics for CSE Stream-I', 'CSE', 1),
  ('BPHYS102', 'Applied Physics for CSE Stream', 'CSE', 1),
  ('BEEEE103', 'Basic Electrical & Electronics Engineering', 'CSE', 1),
  ('BPLCK105A', 'Introduction to C Programming', 'CSE', 1),
  ('BCEDL105P', 'Computer Aided Engineering Drawing', 'CSE', 1),
  ('BENGK106', 'Communicative English', 'CSE', 1),
  ('BIDTK107', 'Innovation and Design Thinking', 'CSE', 1)
ON CONFLICT (code) DO UPDATE SET semester = 1;

-- 3. Update Semester 4 subjects
UPDATE public.courses SET semester = 4 WHERE code LIKE 'BCS40%' OR code LIKE 'BCSL40%' OR code = 'BBOC407' OR code = 'BUHK408';

-- 4. Assign new Semester 1 subjects to Jayesh
DO $$
DECLARE
    teacher_uuid UUID;
    course_record RECORD;
BEGIN
    SELECT id INTO teacher_uuid FROM public.profiles WHERE email ILIKE 'jayeshsuthar0621@gmail.com' LIMIT 1;
    IF teacher_uuid IS NOT NULL THEN
        FOR course_record IN SELECT id FROM public.courses WHERE semester = 1 LOOP
            INSERT INTO public.teacher_assignments (course_id, teacher_id) VALUES (course_record.id, teacher_uuid) ON CONFLICT (course_id, teacher_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;
