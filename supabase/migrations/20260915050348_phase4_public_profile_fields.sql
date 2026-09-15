/*
# Phase 4: Public Profile Fields

## Purpose
Add fields to participants table to support shareable public profile pages.
Participants can opt-in to make their achievements visible at /perfil/:slug.

## Modified Tables
- `participants`
  - `public_profile_enabled` (boolean, default false) — opt-in toggle for public visibility
  - `profile_slug` (text, unique, nullable) — URL-friendly slug for the public profile

## Security
- New RLS policy allows anonymous SELECT on participants WHERE public_profile_enabled = true
  (so the public profile page works without authentication)

## Important Notes
1. The profile_slug is auto-generated via a trigger when public_profile_enabled is set to true.
2. Slug format: lowercase first_name-last_name-first8chars_of_uuid, with non-alphanumeric replaced by hyphens.
3. Existing RLS policies on participants are unchanged.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'public_profile_enabled') THEN
    ALTER TABLE participants ADD COLUMN public_profile_enabled boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'profile_slug') THEN
    ALTER TABLE participants ADD COLUMN profile_slug text UNIQUE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_participants_profile_slug
  ON participants(profile_slug) WHERE profile_slug IS NOT NULL;

CREATE OR REPLACE FUNCTION generate_profile_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.public_profile_enabled = true AND (NEW.profile_slug IS NULL OR NEW.profile_slug = '') THEN
    NEW.profile_slug := lower(
      regexp_replace(
        regexp_replace(
          unaccent(NEW.first_name || '-' || NEW.last_name || '-' || substr(NEW.id::text, 1, 8)),
          '[^a-z0-9-]', '-', 'g'
        ),
        '-+', '-', 'g'
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profile_slug ON participants;
CREATE TRIGGER trg_profile_slug
  BEFORE INSERT OR UPDATE OF public_profile_enabled ON participants
  FOR EACH ROW EXECUTE FUNCTION generate_profile_slug();

DROP POLICY IF EXISTS "anon_select_public_profiles" ON participants;
CREATE POLICY "anon_select_public_profiles" ON participants FOR SELECT
  TO anon USING (public_profile_enabled = true);
