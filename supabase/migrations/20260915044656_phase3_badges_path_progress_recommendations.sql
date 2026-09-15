/*
# Phase 3: Badges/Micro-credentials, Path Progress, Prerequisites, Recommendations

1. New Tables

  - `badges`
    - `id` (uuid, primary key) 
    - `name` (text, not null) - Display name (e.g. "Ciudadano Digital")
    - `slug` (text, unique, not null) - URL identifier
    - `description` (text) - What this badge represents
    - `icon` (text) - Lucide icon name or emoji
    - `color` (text) - CSS color/class for display
    - `badge_type` (text) - Type: path_completion, skill_combo, milestone, manual
    - `criteria` (jsonb) - Machine-readable criteria for auto-awarding
    - `image_url` (text) - Badge image/icon URL
    - `status` (text) - active/archived
    - `sort_order` (integer) - Display ordering
    - `created_at`, `updated_at` (timestamptz)

  - `participant_badges`
    - `id` (uuid, primary key)
    - `participant_id` (uuid, FK to participants)
    - `badge_id` (uuid, FK to badges)
    - `awarded_at` (timestamptz) - When the badge was earned
    - `awarded_by` (text) - 'auto' or admin identifier
    - `source_type` (text) - How it was earned: path, skill_combo, milestone, manual
    - `source_id` (text) - ID of the source (learning_path_id, etc.)
    - `metadata` (jsonb) - Extra context
    - `status` (text) - active/revoked
    - Unique constraint on (participant_id, badge_id)

  - `path_progress`
    - `id` (uuid, primary key)
    - `participant_id` (uuid, FK to participants)
    - `learning_path_id` (uuid, FK to learning_paths)
    - `started_at` (timestamptz) - When participant started the path
    - `completed_at` (timestamptz) - When all required courses were completed
    - `completion_percentage` (integer) - Cached completion %
    - `courses_completed` (integer) - Count of completed courses
    - `courses_total` (integer) - Total required courses
    - `status` (text) - in_progress, completed, abandoned
    - `updated_at` (timestamptz)
    - Unique constraint on (participant_id, learning_path_id)

  - `course_prerequisites`
    - `id` (uuid, primary key)
    - `course_id` (uuid, FK to courses) - The course that has the prerequisite
    - `prerequisite_course_id` (uuid, FK to courses) - Must be completed first
    - `is_strict` (boolean) - If true, blocks enrollment; if false, shows warning
    - `created_at` (timestamptz)
    - Unique constraint on (course_id, prerequisite_course_id)

2. Modifications
  - Add `badge_id` to `learning_paths` to link path completion → badge

3. Security
  - Enable RLS on all new tables
  - Allow anon + authenticated SELECT (public read for badges)
  - Allow authenticated INSERT/UPDATE/DELETE (admin management)
  - participant_badges: public read for verification, authenticated write

4. Notes
  - badges.criteria stores JSON like: {"type":"path_completion","path_id":"..."} or {"type":"skill_combo","skills":["skill-id-1","skill-id-2"],"min_level":"intermedio"}
  - path_progress is updated when enrollments/certificates change
  - course_prerequisites enables prerequisite enforcement at enrollment time
*/

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text DEFAULT 'award',
  color text DEFAULT 'sky',
  badge_type text NOT NULL DEFAULT 'manual' CHECK (badge_type IN ('path_completion', 'skill_combo', 'milestone', 'manual')),
  criteria jsonb DEFAULT '{}',
  image_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_badges" ON badges;
CREATE POLICY "anon_select_badges" ON badges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_badges" ON badges;
CREATE POLICY "auth_insert_badges" ON badges FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_badges" ON badges;
CREATE POLICY "auth_update_badges" ON badges FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_badges" ON badges;
CREATE POLICY "auth_delete_badges" ON badges FOR DELETE
  TO authenticated USING (true);

-- Participant badges junction
CREATE TABLE IF NOT EXISTS participant_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  awarded_by text DEFAULT 'auto',
  source_type text NOT NULL DEFAULT 'manual' CHECK (source_type IN ('path', 'skill_combo', 'milestone', 'manual')),
  source_id text,
  metadata jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  UNIQUE(participant_id, badge_id)
);

ALTER TABLE participant_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_participant_badges" ON participant_badges;
CREATE POLICY "anon_select_participant_badges" ON participant_badges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_participant_badges" ON participant_badges;
CREATE POLICY "auth_insert_participant_badges" ON participant_badges FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_participant_badges" ON participant_badges;
CREATE POLICY "auth_update_participant_badges" ON participant_badges FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_participant_badges" ON participant_badges;
CREATE POLICY "auth_delete_participant_badges" ON participant_badges FOR DELETE
  TO authenticated USING (true);

-- Path progress tracking
CREATE TABLE IF NOT EXISTS path_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  learning_path_id uuid NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  completion_percentage integer NOT NULL DEFAULT 0,
  courses_completed integer NOT NULL DEFAULT 0,
  courses_total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(participant_id, learning_path_id)
);

ALTER TABLE path_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_path_progress" ON path_progress;
CREATE POLICY "anon_select_path_progress" ON path_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_path_progress" ON path_progress;
CREATE POLICY "auth_insert_path_progress" ON path_progress FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_path_progress" ON path_progress;
CREATE POLICY "auth_update_path_progress" ON path_progress FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_path_progress" ON path_progress;
CREATE POLICY "auth_delete_path_progress" ON path_progress FOR DELETE
  TO authenticated USING (true);

-- Course prerequisites
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  is_strict boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, prerequisite_course_id),
  CHECK (course_id != prerequisite_course_id)
);

ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_course_prerequisites" ON course_prerequisites;
CREATE POLICY "anon_select_course_prerequisites" ON course_prerequisites FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_course_prerequisites" ON course_prerequisites;
CREATE POLICY "auth_insert_course_prerequisites" ON course_prerequisites FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_course_prerequisites" ON course_prerequisites;
CREATE POLICY "auth_update_course_prerequisites" ON course_prerequisites FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_course_prerequisites" ON course_prerequisites;
CREATE POLICY "auth_delete_course_prerequisites" ON course_prerequisites FOR DELETE
  TO authenticated USING (true);

-- Add badge_id to learning_paths for path-completion badges
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_paths' AND column_name = 'badge_id') THEN
    ALTER TABLE learning_paths ADD COLUMN badge_id uuid REFERENCES badges(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_badges_slug ON badges(slug);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_participant_badges_participant ON participant_badges(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_badges_badge ON participant_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_path_progress_participant ON path_progress(participant_id);
CREATE INDEX IF NOT EXISTS idx_path_progress_path ON path_progress(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_course_prerequisites_course ON course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_course_prerequisites_prereq ON course_prerequisites(prerequisite_course_id);
