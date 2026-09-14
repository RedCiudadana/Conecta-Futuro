/*
# Create Core Participant Management Tables

This migration creates the foundational tables for the Gestión de Participantes module.

1. New Tables

## `organizations`
- `id` (uuid, primary key) - Unique identifier
- `name` (text, not null) - Organization name
- `type` (text) - Type: empresa, ong, gobierno, academia, cooperativa, otro
- `sector` (text) - Business sector
- `size` (text) - Size category: micro, pequeña, mediana, grande
- `municipality` (text) - Municipality in Guatemala
- `department` (text) - Department in Guatemala
- `phone` (text) - Contact phone
- `website` (text) - Website URL
- `created_at` / `updated_at` (timestamptz) - Timestamps

## `participants`
- `id` (uuid, primary key) - Unique identifier
- `first_name` (text, not null) - First name
- `last_name` (text, not null) - Last name
- `primary_email` (text, unique, not null) - Normalized primary email
- `phone` (text) - Phone number
- `dpi` (text, unique) - Guatemala national ID (DPI)
- `gender` (text) - Gender: masculino, femenino, otro, prefiero_no_decir
- `birth_date` (date) - Date of birth
- `municipality` (text) - Municipality
- `department` (text) - Department
- `organization_id` (uuid, FK) - Link to organization
- `role_in_org` (text) - Role within organization
- `digital_skill_level` (text) - Level: basico, intermedio, avanzado
- `how_found_us` (text) - Acquisition channel
- `status` (text, default 'registered') - Lifecycle: registered, verified, active, inactive, graduated, dropped
- `notes` (text) - Internal notes
- `created_at` / `updated_at` (timestamptz) - Timestamps

## `participant_emails`
- `id` (uuid, primary key) - Unique identifier
- `participant_id` (uuid, FK) - Link to participant
- `email` (text, unique, not null) - Normalized email address
- `is_primary` (boolean, default false) - Whether this is the primary email
- `is_verified` (boolean, default false) - Verification status
- `verified_at` (timestamptz) - When verified
- `verification_token` (text) - Token for email verification
- `created_at` (timestamptz) - Timestamp

## `tags`
- `id` (uuid, primary key) - Unique identifier
- `name` (text, unique, not null) - Tag name
- `color` (text, default '#6B7280') - Display color hex
- `created_at` (timestamptz) - Timestamp

## `participant_tags`
- `participant_id` (uuid, FK) - Link to participant
- `tag_id` (uuid, FK) - Link to tag
- Primary key is (participant_id, tag_id)

2. Security
- RLS enabled on all tables
- All tables allow read/write for anon + authenticated (admin-gated in app layer via Firebase)

3. Indexes
- participants: primary_email, dpi, status, organization_id, department
- participant_emails: email, participant_id
- organizations: name

4. Important Notes
- Email normalization (lowercase, trimmed) is enforced via trigger
- DPI uniqueness allows null (not all participants have DPI)
- The status field tracks the full participant lifecycle funnel
*/

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text CHECK (type IN ('empresa', 'ong', 'gobierno', 'academia', 'cooperativa', 'otro')),
  sector text,
  size text CHECK (size IN ('micro', 'pequeña', 'mediana', 'grande')),
  municipality text,
  department text,
  phone text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_select" ON organizations;
CREATE POLICY "org_select" ON organizations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "org_insert" ON organizations;
CREATE POLICY "org_insert" ON organizations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "org_update" ON organizations;
CREATE POLICY "org_update" ON organizations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "org_delete" ON organizations;
CREATE POLICY "org_delete" ON organizations FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  primary_email text UNIQUE NOT NULL,
  phone text,
  dpi text UNIQUE,
  gender text CHECK (gender IN ('masculino', 'femenino', 'otro', 'prefiero_no_decir')),
  birth_date date,
  municipality text,
  department text,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  role_in_org text,
  digital_skill_level text CHECK (digital_skill_level IN ('basico', 'intermedio', 'avanzado')),
  how_found_us text,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'verified', 'active', 'inactive', 'graduated', 'dropped')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "part_select" ON participants;
CREATE POLICY "part_select" ON participants FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "part_insert" ON participants;
CREATE POLICY "part_insert" ON participants FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "part_update" ON participants;
CREATE POLICY "part_update" ON participants FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "part_delete" ON participants;
CREATE POLICY "part_delete" ON participants FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(primary_email);
CREATE INDEX IF NOT EXISTS idx_participants_dpi ON participants(dpi);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_participants_org ON participants(organization_id);
CREATE INDEX IF NOT EXISTS idx_participants_dept ON participants(department);

-- Participant emails table (for multiple emails per participant)
CREATE TABLE IF NOT EXISTS participant_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  is_primary boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  verification_token text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE participant_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pemail_select" ON participant_emails;
CREATE POLICY "pemail_select" ON participant_emails FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "pemail_insert" ON participant_emails;
CREATE POLICY "pemail_insert" ON participant_emails FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "pemail_update" ON participant_emails;
CREATE POLICY "pemail_update" ON participant_emails FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "pemail_delete" ON participant_emails;
CREATE POLICY "pemail_delete" ON participant_emails FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_pemail_email ON participant_emails(email);
CREATE INDEX IF NOT EXISTS idx_pemail_participant ON participant_emails(participant_id);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tag_select" ON tags;
CREATE POLICY "tag_select" ON tags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "tag_insert" ON tags;
CREATE POLICY "tag_insert" ON tags FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tag_update" ON tags;
CREATE POLICY "tag_update" ON tags FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "tag_delete" ON tags;
CREATE POLICY "tag_delete" ON tags FOR DELETE TO anon, authenticated USING (true);

-- Participant tags junction table
CREATE TABLE IF NOT EXISTS participant_tags (
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (participant_id, tag_id)
);

ALTER TABLE participant_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ptag_select" ON participant_tags;
CREATE POLICY "ptag_select" ON participant_tags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ptag_insert" ON participant_tags;
CREATE POLICY "ptag_insert" ON participant_tags FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ptag_delete" ON participant_tags;
CREATE POLICY "ptag_delete" ON participant_tags FOR DELETE TO anon, authenticated USING (true);

-- Email normalization trigger
CREATE OR REPLACE FUNCTION normalize_participant_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.primary_email = lower(trim(NEW.primary_email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normalize_participant_email ON participants;
CREATE TRIGGER trg_normalize_participant_email
  BEFORE INSERT OR UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION normalize_participant_email();

CREATE OR REPLACE FUNCTION normalize_pemail_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = lower(trim(NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normalize_pemail_email ON participant_emails;
CREATE TRIGGER trg_normalize_pemail_email
  BEFORE INSERT OR UPDATE ON participant_emails
  FOR EACH ROW EXECUTE FUNCTION normalize_pemail_email();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_participants_updated ON participants;
CREATE TRIGGER trg_participants_updated
  BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_organizations_updated ON organizations;
CREATE TRIGGER trg_organizations_updated
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
