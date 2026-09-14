/*
# Create Enrollment, Attendance, and Participation Event Tables

These tables track the complete learning journey: course enrollment, session attendance,
and participation milestones.

1. New Tables

## `courses`
- `id` (uuid, primary key) - Unique identifier
- `slug` (text, unique, not null) - URL-friendly identifier matching CMS content
- `title` (text, not null) - Course title
- `program` (text) - Program: primeros_pasos, digitaliza_pyme, directorio_ia
- `modality` (text) - Delivery: presencial, virtual, hibrido, autoestudio
- `start_date` / `end_date` (date) - Course date range
- `max_capacity` (integer) - Maximum enrollment
- `status` (text) - Estado: draft, open, in_progress, completed, cancelled
- `created_at` / `updated_at` (timestamptz) - Timestamps

## `course_sessions`
- `id` (uuid, primary key) - Unique identifier
- `course_id` (uuid, FK) - Link to course
- `title` (text, not null) - Session title
- `session_date` (date) - Date of session
- `start_time` / `end_time` (time) - Time range
- `location` (text) - Physical or virtual location
- `session_number` (integer) - Order within course
- `created_at` (timestamptz) - Timestamp

## `enrollments`
- `id` (uuid, primary key) - Unique identifier
- `participant_id` (uuid, FK) - Link to participant
- `course_id` (uuid, FK) - Link to course
- `status` (text) - Status: enrolled, in_progress, completed, dropped, waitlisted
- `enrolled_at` (timestamptz) - Enrollment timestamp
- `completed_at` (timestamptz) - Completion timestamp
- `completion_percentage` (numeric) - Progress 0-100
- `final_grade` (numeric) - Final grade if applicable
- `drop_reason` (text) - Reason for dropping
- Unique constraint on (participant_id, course_id)

## `attendance`
- `id` (uuid, primary key) - Unique identifier
- `participant_id` (uuid, FK) - Link to participant
- `session_id` (uuid, FK) - Link to course session
- `status` (text) - Status: present, absent, late, excused
- `check_in_time` (timestamptz) - Actual check-in time
- `notes` (text) - Attendance notes
- Unique constraint on (participant_id, session_id)

## `participation_events`
- `id` (uuid, primary key) - Unique identifier
- `participant_id` (uuid, FK) - Link to participant
- `event_type` (text) - Type: registration, verification, enrollment, attendance, completion, certification, communication, note
- `event_data` (jsonb) - Flexible event payload
- `created_by` (text) - Who triggered (admin email or 'system')
- `created_at` (timestamptz) - Timestamp

2. Security
- RLS enabled on all tables with anon+authenticated access (admin-gated in app)

3. Indexes
- enrollments: participant_id, course_id, status
- attendance: participant_id, session_id
- participation_events: participant_id, event_type, created_at
- courses: slug, program, status
- course_sessions: course_id, session_date
*/

-- Courses table (mirrors CMS content but adds operational fields)
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  program text CHECK (program IN ('primeros_pasos', 'digitaliza_pyme', 'directorio_ia', 'otro')),
  modality text CHECK (modality IN ('presencial', 'virtual', 'hibrido', 'autoestudio')),
  start_date date,
  end_date date,
  max_capacity integer,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "course_select" ON courses;
CREATE POLICY "course_select" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "course_insert" ON courses;
CREATE POLICY "course_insert" ON courses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "course_update" ON courses;
CREATE POLICY "course_update" ON courses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "course_delete" ON courses;
CREATE POLICY "course_delete" ON courses FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_program ON courses(program);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

DROP TRIGGER IF EXISTS trg_courses_updated ON courses;
CREATE TRIGGER trg_courses_updated
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Course sessions table
CREATE TABLE IF NOT EXISTS course_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  session_date date,
  start_time time,
  end_time time,
  location text,
  session_number integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "csession_select" ON course_sessions;
CREATE POLICY "csession_select" ON course_sessions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "csession_insert" ON course_sessions;
CREATE POLICY "csession_insert" ON course_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "csession_update" ON course_sessions;
CREATE POLICY "csession_update" ON course_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "csession_delete" ON course_sessions;
CREATE POLICY "csession_delete" ON course_sessions FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_csessions_course ON course_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_csessions_date ON course_sessions(session_date);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped', 'waitlisted')),
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  completion_percentage numeric(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  final_grade numeric(5,2),
  drop_reason text,
  UNIQUE(participant_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enroll_select" ON enrollments;
CREATE POLICY "enroll_select" ON enrollments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "enroll_insert" ON enrollments;
CREATE POLICY "enroll_insert" ON enrollments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "enroll_update" ON enrollments;
CREATE POLICY "enroll_update" ON enrollments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "enroll_delete" ON enrollments;
CREATE POLICY "enroll_delete" ON enrollments FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_enrollments_participant ON enrollments(participant_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in_time timestamptz,
  notes text,
  UNIQUE(participant_id, session_id)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attend_select" ON attendance;
CREATE POLICY "attend_select" ON attendance FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "attend_insert" ON attendance;
CREATE POLICY "attend_insert" ON attendance FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "attend_update" ON attendance;
CREATE POLICY "attend_update" ON attendance FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "attend_delete" ON attendance;
CREATE POLICY "attend_delete" ON attendance FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_attendance_participant ON attendance(participant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);

-- Participation events (timeline/audit trail for each participant)
CREATE TABLE IF NOT EXISTS participation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('registration', 'verification', 'enrollment', 'attendance', 'completion', 'certification', 'communication', 'note', 'status_change')),
  event_data jsonb DEFAULT '{}'::jsonb,
  created_by text DEFAULT 'system',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE participation_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pevt_select" ON participation_events;
CREATE POLICY "pevt_select" ON participation_events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "pevt_insert" ON participation_events;
CREATE POLICY "pevt_insert" ON participation_events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "pevt_delete" ON participation_events;
CREATE POLICY "pevt_delete" ON participation_events FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_pevents_participant ON participation_events(participant_id);
CREATE INDEX IF NOT EXISTS idx_pevents_type ON participation_events(event_type);
CREATE INDEX IF NOT EXISTS idx_pevents_created ON participation_events(created_at);
