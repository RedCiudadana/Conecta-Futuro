/*
# Create Learning Paths system

1. New Tables
  - `learning_paths`
    - `id` (uuid, primary key)
    - `name` (text, not null) - Display name of the learning path
    - `slug` (text, unique, not null) - URL-friendly identifier
    - `short_description` (text) - Brief summary shown on cards
    - `long_description` (text) - Full description shown on detail page
    - `target_audience` (text) - Who this path is for
    - `objective` (text) - What the learner will achieve
    - `image_url` (text) - Hero/card image URL
    - `icon` (text) - Icon identifier (lucide icon name)
    - `initial_level` (text) - Starting skill level
    - `final_level` (text) - Expected skill level after completion
    - `estimated_duration` (text) - Human-readable duration
    - `competencies` (text[]) - Array of skills/competencies developed
    - `practical_activities` (text[]) - Array of hands-on activities
    - `associated_tools` (text[]) - Tools the learner will use
    - `diagnostic_slug` (text) - Slug of associated diagnostic page
    - `final_evaluation_url` (text) - URL to final evaluation
    - `certificate_type` (text) - Type of certificate/microcredential
    - `status` (text) - draft/active/archived
    - `is_visible` (boolean) - Whether shown publicly
    - `sort_order` (integer) - Display ordering
    - `cta_text` (text) - Call-to-action button text
    - `cta_url` (text) - Call-to-action URL override
    - `result_description` (text) - What the user gets at the end
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `learning_path_courses`
    - `id` (uuid, primary key)
    - `learning_path_id` (uuid, FK to learning_paths)
    - `course_slug` (text, not null) - Slug linking to CMS or DB course
    - `sort_order` (integer) - Order within the path
    - `is_required` (boolean) - Whether course is mandatory
    - `stage` (text) - Stage label (diagnostico/aprendizaje/practica/evaluacion)
    - `created_at` (timestamptz)
    - Unique constraint on (learning_path_id, course_slug)

2. Security
  - Enable RLS on both tables.
  - Allow anon + authenticated SELECT (public read).
  - Allow authenticated INSERT/UPDATE/DELETE (admin management).

3. Notes
  - course_slug references CMS markdown slugs or DB course slugs.
  - A course can belong to multiple paths (many-to-many).
  - Paths are ordered by sort_order for display.
*/

-- Learning Paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  long_description text,
  target_audience text,
  objective text,
  image_url text,
  icon text,
  initial_level text,
  final_level text,
  estimated_duration text,
  competencies text[] DEFAULT '{}',
  practical_activities text[] DEFAULT '{}',
  associated_tools text[] DEFAULT '{}',
  diagnostic_slug text,
  final_evaluation_url text,
  certificate_type text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_visible boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  cta_text text,
  cta_url text,
  result_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_learning_paths" ON learning_paths;
CREATE POLICY "anon_select_learning_paths" ON learning_paths FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_learning_paths" ON learning_paths;
CREATE POLICY "auth_insert_learning_paths" ON learning_paths FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_learning_paths" ON learning_paths;
CREATE POLICY "auth_update_learning_paths" ON learning_paths FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_learning_paths" ON learning_paths;
CREATE POLICY "auth_delete_learning_paths" ON learning_paths FOR DELETE
  TO authenticated USING (true);

-- Junction table: learning path <-> courses
CREATE TABLE IF NOT EXISTS learning_path_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id uuid NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT true,
  stage text CHECK (stage IN ('diagnostico', 'aprendizaje', 'practica', 'implementacion', 'evaluacion')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(learning_path_id, course_slug)
);

ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lp_courses" ON learning_path_courses;
CREATE POLICY "anon_select_lp_courses" ON learning_path_courses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_lp_courses" ON learning_path_courses;
CREATE POLICY "auth_insert_lp_courses" ON learning_path_courses FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_lp_courses" ON learning_path_courses;
CREATE POLICY "auth_update_lp_courses" ON learning_path_courses FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_lp_courses" ON learning_path_courses;
CREATE POLICY "auth_delete_lp_courses" ON learning_path_courses FOR DELETE
  TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_learning_paths_slug ON learning_paths(slug);
CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON learning_paths(status);
CREATE INDEX IF NOT EXISTS idx_lp_courses_path_id ON learning_path_courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_lp_courses_slug ON learning_path_courses(course_slug);
