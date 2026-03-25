-- FIX CERTIFICATES TABLE
-- Run this in Supabase SQL Editor to resolve the "table not found" error

-- 1. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    issuer TEXT DEFAULT 'Self Uploaded',
    file_url TEXT NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'verified'
    type TEXT DEFAULT 'image' -- 'pdf', 'image'
);

-- 2. Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Students can view their own certificates
CREATE POLICY "Users can view own certificates" 
ON public.certificates FOR SELECT 
USING (auth.uid() = student_id);

-- Students can insert their own certificates
CREATE POLICY "Users can insert own certificates" 
ON public.certificates FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- Students can delete their own certificates
CREATE POLICY "Users can delete own certificates" 
ON public.certificates FOR DELETE 
USING (auth.uid() = student_id);

-- 4. ENSURE STORAGE CONFIGURATION
-- This ensures the 'certificates' bucket exists in Supabase Storage
-- If this fails, create a bucket named 'certificates' manually in the Supabase Dashboard -> Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Force Refresh Schema Cache (IMPORTANT)
NOTIFY pgrst, 'reload schema';
