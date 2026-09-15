/*
# Create attendance form links table

1. New Tables
  - `attendance_form_links`
    - `id` (uuid, primary key)
    - `session_id` (uuid, FK → course_sessions, CASCADE)
    - `token` (text, unique) — random token used in the public URL
    - `is_active` (boolean, default true) — admin can deactivate
    - `expires_at` (timestamptz, nullable) — optional expiration
    - `created_at` (timestamptz)

2. Security
  - Enable RLS on `attendance_form_links`
  - Allow anon + authenticated full CRUD (consistent with existing tables)

3. Notes
  - One link per session enforced by unique constraint on session_id
  - Token is used in public URL: /asistencia/{token}
  - Participants use the link to self-register attendance by email
*/

CREATE TABLE IF NOT EXISTS attendance_form_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_session_link UNIQUE (session_id)
);

ALTER TABLE attendance_form_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_attendance_form_links" ON attendance_form_links;
CREATE POLICY "anon_select_attendance_form_links" ON attendance_form_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_attendance_form_links" ON attendance_form_links;
CREATE POLICY "anon_insert_attendance_form_links" ON attendance_form_links FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_attendance_form_links" ON attendance_form_links;
CREATE POLICY "anon_update_attendance_form_links" ON attendance_form_links FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_attendance_form_links" ON attendance_form_links;
CREATE POLICY "anon_delete_attendance_form_links" ON attendance_form_links FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_attendance_form_links_token ON attendance_form_links(token);
CREATE INDEX IF NOT EXISTS idx_attendance_form_links_session ON attendance_form_links(session_id);
