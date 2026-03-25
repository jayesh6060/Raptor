-- VTU 2022 SCHEME 4TH SEMESTER (CSE)
-- Run this in the Supabase SQL Editor

-- 1. Insert 2022 Scheme Courses (BCS4xx)
INSERT INTO public.courses (code, name, department)
VALUES 
  ('BCS401', 'Analysis and Design of Algorithms', 'CSE'),
  ('BCS402', 'Microcontrollers', 'CSE'),
  ('BCS403', 'Database Management System', 'CSE'),
  ('BCSL404', 'Analysis and Design of Algorithms Laboratory', 'CSE'),
  ('BCS405A', 'Discrete Mathematical Structures', 'CSE'),
  ('BCSL456D', 'UI/UX Design', 'CSE'),
  ('BBOC407', 'Biology for Engineers', 'CSE'),
  ('BUHK408', 'Universal Human Values', 'CSE')
ON CONFLICT (code) DO NOTHING;

-- 2. Assign to Teacher (Jayesh)
DO $$
DECLARE
    teacher_uuid UUID;
    course_record RECORD;
BEGIN
    SELECT id INTO teacher_uuid FROM public.profiles WHERE email ILIKE 'jayeshsuthar0621@gmail.com' LIMIT 1;
    IF teacher_uuid IS NOT NULL THEN
        FOR course_record IN SELECT id FROM public.courses WHERE code IN ('BCS401', 'BCS402', 'BCS403', 'BCSL404', 'BCS405A', 'BCSL456D', 'BBOC407', 'BUHK408') LOOP
            INSERT INTO public.teacher_assignments (course_id, teacher_id) VALUES (course_record.id, teacher_uuid) ON CONFLICT (course_id, teacher_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;
