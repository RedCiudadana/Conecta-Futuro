/*
# Phase 1: Participant Enrichment, Skills System, Certificate Enhancement

## Summary
Extends the participant entity with additional demographic/professional fields,
creates a skills tracking system, and enhances the certificates table.

## 1. Modified Tables

### participants
- job_title (text, nullable) - Cargo/puesto del participante
- country (text, default 'Guatemala') - País
- education_level (text, nullable) - Nivel educativo
- business_owner (boolean, default false) - Es dueño de negocio
- public_official (boolean, default false) - Es funcionario público
- age_range (text, nullable) - Rango de edad
- last_activity_at (timestamptz, nullable) - Última actividad registrada

### certificates
- hours (numeric, nullable) - Horas del certificado
- status (text, default 'emitted') - Estado: emitted/revoked/pending
- revoked_at (timestamptz, nullable) - Fecha de revocación
- revoked_by (text, nullable) - Quién revocó
- verification_url (text, nullable) - URL de verificación pública

## 2. New Tables

### skills
- id (uuid, PK)
- name (text, not null)
- slug (text, unique, not null)
- description (text, nullable)
- category (text, not null)
- level (text, default 'basico') - basico/intermedio/avanzado/especializado
- status (text, default 'active')
- created_at, updated_at

### course_skills (junction: courses <-> skills)
- id (uuid, PK)
- course_id (uuid, FK -> courses)
- skill_id (uuid, FK -> skills)
- level (text, default 'basico')
- weight (integer, default 1)
- UNIQUE(course_id, skill_id)

### participant_skills (tracks skill acquisition per participant)
- id (uuid, PK)
- participant_id (uuid, FK -> participants)
- skill_id (uuid, FK -> skills)
- level (text, not null)
- source_type (text, not null) - 'course', 'manual', 'import'
- source_id (text, nullable) - Reference to course_id or other source
- date_acquired (timestamptz, default now())
- status (text, default 'active')
- UNIQUE(participant_id, skill_id, source_type, source_id)

## 3. Security
- RLS enabled on all new tables
- anon + authenticated SELECT/INSERT/UPDATE/DELETE with USING(true) (matches existing pattern)

## 4. Notes
- No columns dropped or renamed
- All new columns are nullable or have defaults — no data loss risk
- Existing certificates remain untouched (status defaults to 'emitted')
*/

-- 1. Enrich participants table
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='job_title') THEN
    ALTER TABLE participants ADD COLUMN job_title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='country') THEN
    ALTER TABLE participants ADD COLUMN country text DEFAULT 'Guatemala';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='education_level') THEN
    ALTER TABLE participants ADD COLUMN education_level text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='business_owner') THEN
    ALTER TABLE participants ADD COLUMN business_owner boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='public_official') THEN
    ALTER TABLE participants ADD COLUMN public_official boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='age_range') THEN
    ALTER TABLE participants ADD COLUMN age_range text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='participants' AND column_name='last_activity_at') THEN
    ALTER TABLE participants ADD COLUMN last_activity_at timestamptz;
  END IF;
END $$;

-- 2. Enrich certificates table
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certificates' AND column_name='hours') THEN
    ALTER TABLE certificates ADD COLUMN hours numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certificates' AND column_name='status') THEN
    ALTER TABLE certificates ADD COLUMN status text DEFAULT 'emitted' CHECK (status IN ('emitted', 'revoked', 'pending'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certificates' AND column_name='revoked_at') THEN
    ALTER TABLE certificates ADD COLUMN revoked_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certificates' AND column_name='revoked_by') THEN
    ALTER TABLE certificates ADD COLUMN revoked_by text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certificates' AND column_name='verification_url') THEN
    ALTER TABLE certificates ADD COLUMN verification_url text;
  END IF;
END $$;

-- 3. Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  level text NOT NULL DEFAULT 'basico' CHECK (level IN ('basico', 'intermedio', 'avanzado', 'especializado')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_skills" ON skills;
CREATE POLICY "anon_select_skills" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_skills" ON skills;
CREATE POLICY "anon_insert_skills" ON skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_skills" ON skills;
CREATE POLICY "anon_update_skills" ON skills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_skills" ON skills;
CREATE POLICY "anon_delete_skills" ON skills FOR DELETE TO anon, authenticated USING (true);

-- 4. Course-Skills junction
CREATE TABLE IF NOT EXISTS course_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'basico' CHECK (level IN ('basico', 'intermedio', 'avanzado', 'especializado')),
  weight integer DEFAULT 1,
  UNIQUE(course_id, skill_id)
);

ALTER TABLE course_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_course_skills" ON course_skills;
CREATE POLICY "anon_select_course_skills" ON course_skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_course_skills" ON course_skills;
CREATE POLICY "anon_insert_course_skills" ON course_skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_course_skills" ON course_skills;
CREATE POLICY "anon_update_course_skills" ON course_skills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_course_skills" ON course_skills;
CREATE POLICY "anon_delete_course_skills" ON course_skills FOR DELETE TO anon, authenticated USING (true);

-- 5. Participant-Skills tracking
CREATE TABLE IF NOT EXISTS participant_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('basico', 'intermedio', 'avanzado', 'especializado')),
  source_type text NOT NULL CHECK (source_type IN ('course', 'manual', 'import')),
  source_id text,
  date_acquired timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  UNIQUE(participant_id, skill_id, source_type, source_id)
);

ALTER TABLE participant_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_participant_skills" ON participant_skills;
CREATE POLICY "anon_select_participant_skills" ON participant_skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_participant_skills" ON participant_skills;
CREATE POLICY "anon_insert_participant_skills" ON participant_skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_participant_skills" ON participant_skills;
CREATE POLICY "anon_update_participant_skills" ON participant_skills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_participant_skills" ON participant_skills;
CREATE POLICY "anon_delete_participant_skills" ON participant_skills FOR DELETE TO anon, authenticated USING (true);

-- 6. Index for performance
CREATE INDEX IF NOT EXISTS idx_participant_skills_participant ON participant_skills(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_skills_skill ON participant_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_course_skills_course ON course_skills(course_id);
CREATE INDEX IF NOT EXISTS idx_course_skills_skill ON course_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_participants_last_activity ON participants(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);

-- 7. Trigger for skills.updated_at
CREATE OR REPLACE FUNCTION update_skills_updated_at()
RETURNS TRIGGER AS $t$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$t$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS skills_updated_at ON skills;
CREATE TRIGGER skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_skills_updated_at();
