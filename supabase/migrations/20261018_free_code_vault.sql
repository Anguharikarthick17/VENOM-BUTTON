-- ==============================================================================
-- GENZLOG Free Code Vault Database Migration
-- Table: free_code_projects
-- Storage Bucket: free-code-thumbnails
-- ==============================================================================

-- 1. Create Free Code Projects Table
CREATE TABLE IF NOT EXISTS public.free_code_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_number INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  thumbnail_url TEXT NOT NULL,
  github_url TEXT NOT NULL,
  live_demo_url TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE
);

-- 2. Constraints and Indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'free_code_projects_reel_number_key'
  ) THEN
    ALTER TABLE public.free_code_projects ADD CONSTRAINT free_code_projects_reel_number_key UNIQUE (reel_number);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'free_code_projects_slug_key'
  ) THEN
    ALTER TABLE public.free_code_projects ADD CONSTRAINT free_code_projects_slug_key UNIQUE (slug);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_free_code_projects_status ON public.free_code_projects (status);
CREATE INDEX IF NOT EXISTS idx_free_code_projects_sort_order ON public.free_code_projects (sort_order ASC, reel_number DESC);
CREATE INDEX IF NOT EXISTS idx_free_code_projects_published ON public.free_code_projects (status, sort_order ASC, reel_number DESC);

-- 3. Automatic updated_at Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_free_code_projects_updated_at ON public.free_code_projects;
CREATE TRIGGER set_free_code_projects_updated_at
BEFORE UPDATE ON public.free_code_projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE public.free_code_projects ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous reads ONLY for published projects
DROP POLICY IF EXISTS "Public can view published free code projects" ON public.free_code_projects;
CREATE POLICY "Public can view published free code projects"
ON public.free_code_projects
FOR SELECT
TO public
USING (status = 'published');

-- Allow authenticated users (Admins) full read/write access
DROP POLICY IF EXISTS "Authenticated users have full access to free code projects" ON public.free_code_projects;
CREATE POLICY "Authenticated users have full access to free code projects"
ON public.free_code_projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Storage Bucket Configuration for Thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'free-code-thumbnails',
  'free-code-thumbnails',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- Storage RLS Policies
-- Allow public viewing of thumbnails
DROP POLICY IF EXISTS "Public can view free code thumbnails" ON storage.objects;
CREATE POLICY "Public can view free code thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'free-code-thumbnails');

-- Allow authenticated admin users to upload/update/delete thumbnails
DROP POLICY IF EXISTS "Authenticated admins can manage thumbnails" ON storage.objects;
CREATE POLICY "Authenticated admins can manage thumbnails"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'free-code-thumbnails')
WITH CHECK (bucket_id = 'free-code-thumbnails');

-- 6. Safe Seed Migration for Projects #1 and #2 (guaranteed not to overwrite existing rows)
INSERT INTO public.free_code_projects (
  reel_number,
  slug,
  title,
  short_description,
  description,
  thumbnail_url,
  github_url,
  live_demo_url,
  tech_stack,
  features,
  category,
  status,
  sort_order,
  published_at
) VALUES
(
  1,
  'login-page',
  'GENZLOG Login Page',
  'Premium monochrome authentication experience with an interactive 3D chrome sculpture, responsive animations, and accessible form validation.',
  'GENZLOG Login Page is a premium monochrome authentication interface featuring an interactive 3D chrome sculpture and responsive animations. Built with React, TypeScript, Three.js, and Tailwind CSS, it combines modern design with accessible form validation and smooth interactions.',
  '/projects/login-page/screenshot.png',
  'https://github.com/Anguharikarthick17/LOGIN-PAGE---1',
  NULL,
  ARRAY['React', 'TypeScript', 'Three.js', 'Tailwind CSS'],
  ARRAY['Interactive 3D chrome sculpture', 'Responsive animations', 'Accessible form validation', 'Smooth user interactions'],
  'Login & Signup',
  'published',
  1,
  timezone('utc'::text, now())
),
(
  2,
  'creative-studio',
  'Creative Studio',
  'High-performance monochrome creative studio portfolio with smooth micro-animations, interactive showcase elements, and minimalist typography.',
  'Creative Studio is a high-performance modern agency portfolio and showcase interface featuring smooth micro-interactions, responsive grid layout, and minimalist monochrome typography. Designed for creative agencies and independent developers.',
  '/projects/login-page/screenshot.png',
  'https://github.com/Anguharikarthick17/creative-studio',
  NULL,
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  ARRAY['Minimalist monochrome design', 'Smooth micro-animations', 'Responsive portfolio showcase', 'Optimized performance'],
  'Landing Page Sections',
  'published',
  2,
  timezone('utc'::text, now())
)
ON CONFLICT (reel_number) DO NOTHING;
