-- VTU 4TH SEMESTER (CSE) SUBJECTS MIGRATION
-- Run this in the Supabase SQL Editor

-- 1. Insert Courses
INSERT INTO public.courses (code, name, department)
VALUES 
  ('21MATCS41', 'Mathematical Foundations for Computing', 'CSE'),
  ('21CS42', 'Design and Analysis of Algorithms', 'CSE'),
  ('21CS43', 'Microcontroller and Embedded Systems', 'CSE'),
  ('21CS44', 'Operating Systems', 'CSE'),
  ('21BE45', 'Biology for Engineers', 'CSE'),
  ('21CSL46', 'Python Programming Lab', 'CSE'),
  ('21CIV47', 'Environmental Studies', 'CSE'),
  ('21CIP48', 'Constitution of India, Professional Ethics', 'CSE')
ON CONFLICT (code) DO NOTHING;

-- 2. Assign to Teacher (Jayesh)
-- We search for the teacher by email
DO $$
DECLARE
    teacher_uuid UUID;
    course_record RECORD;
BEGIN
    SELECT id INTO teacher_uuid FROM public.profiles WHERE email ILIKE 'jayeshsuthar0621@gmail.com' LIMIT 1;
    
    IF teacher_uuid IS NOT NULL THEN
        FOR course_record IN SELECT id FROM public.courses WHERE code IN ('21MATCS41', '21CS42', '21CS43', '21CS44', '21BE45', '21CSL46', '21CIV47', '21CIP48')
        LOOP
            INSERT INTO public.teacher_assignments (course_id, teacher_id)
            VALUES (course_record.id, teacher_uuid)
            ON CONFLICT (course_id, teacher_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;
