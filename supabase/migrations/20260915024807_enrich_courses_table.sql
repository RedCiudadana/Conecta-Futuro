/*
# Enrich courses table with public-facing fields

1. Modified Tables
   - `courses` — adding columns so admin-created courses can appear
     on the public catalog and details page without CMS markdown files:
     - `description` (text) — course description shown on catalog/details
     - `thumbnail_url` (text) — URL or path to course cover image
     - `level` (text) — difficulty level (Basico, Intermedio, Avanzado)
     - `duration` (text) — human-readable duration (e.g. "4 semanas")
     - `category` (text) — course category for filtering
     - `instructor_name` (text) — instructor display name
     - `is_featured` (boolean) — whether to highlight on catalog, default false

2. Security
   - No changes to RLS policies (existing policies still apply).

3. Notes
   - All new columns are nullable so existing rows are not affected.
   - This enables admin-only course management without requiring CMS content files.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'description') THEN
    ALTER TABLE courses ADD COLUMN description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'thumbnail_url') THEN
    ALTER TABLE courses ADD COLUMN thumbnail_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'level') THEN
    ALTER TABLE courses ADD COLUMN level text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'duration') THEN
    ALTER TABLE courses ADD COLUMN duration text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'category') THEN
    ALTER TABLE courses ADD COLUMN category text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_name') THEN
    ALTER TABLE courses ADD COLUMN instructor_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_featured') THEN
    ALTER TABLE courses ADD COLUMN is_featured boolean NOT NULL DEFAULT false;
  END IF;
END $$;
