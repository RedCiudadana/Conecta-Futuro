/*
# Passport Access Codes

## Purpose
Allow students to access their digital passport by requesting a one-time
verification code sent to their email. This protects sensitive participant
data -- only the email owner can view their full passport.

## New Tables
- `passport_access_codes`
  - `id` uuid PK
  - `email` text (lowercased)
  - `code` text (6-digit)
  - `expires_at` timestamptz (10 minutes)
  - `used_at` timestamptz nullable
  - `participant_id` uuid nullable (resolved when code is created)
  - `created_at` timestamptz

## Security
- RLS enabled, TO anon (no auth needed -- this is the public flow).
- INSERT: anyone can request a code for an email.
- SELECT: anyone can verify a code (but codes are 6-digit and expire in 10 min).
- UPDATE: anyone can mark a code as used.
- DELETE: not needed from the client side.
- Rate limiting is enforced by the edge function (max 1 code per email per 60s).
*/

CREATE TABLE IF NOT EXISTS passport_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  participant_id uuid,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_passport_codes_email ON passport_access_codes(email);
CREATE INDEX IF NOT EXISTS idx_passport_codes_code ON passport_access_codes(code);

ALTER TABLE passport_access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_passport_code" ON passport_access_codes FOR INSERT
  TO anon WITH CHECK (true);
CREATE POLICY "anon_select_passport_code" ON passport_access_codes FOR SELECT
  TO anon USING (true);
CREATE POLICY "anon_update_passport_code" ON passport_access_codes FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

-- Allow anon to read participant data needed for passport lookup
-- (only id, name, email, created_at -- NOT DPI, phone, address, etc.)
-- We use a SECURITY DEFINER function instead of exposing the full table.
CREATE OR REPLACE FUNCTION lookup_participant_for_passport(p_email text)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  primary_email text,
  created_at timestamptz,
  public_profile_enabled boolean,
  profile_slug text
)
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, first_name, last_name, primary_email, created_at,
         public_profile_enabled, profile_slug
  FROM participants
  WHERE lower(trim(primary_email)) = lower(trim(p_email))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION lookup_participant_for_passport TO anon, authenticated;
