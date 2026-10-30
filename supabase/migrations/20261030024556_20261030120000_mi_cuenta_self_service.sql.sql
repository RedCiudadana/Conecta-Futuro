/*
# Mi Cuenta — self-service student portal

## Purpose
Each authenticated Supabase user (a student) needs to view their own
participant profile, enrollments, attendance, certificates, and skills
in the "Mi Cuenta" module. Previously only admin staff could read these
tables; students had no way to see their own data.

## Changes

### 1. New function: get_my_account_data()
SECURITY DEFINER function that resolves the caller's auth email to their
participants row and returns a JSON bundle: participant profile,
enrollments, certificates (non-revoked), attendance, skills, badges,
path_progress. Returns NULL if no participant record matches.

### 2. New function: update_my_profile()
Lets a student update their own descriptive fields (phone, department,
gender, etc.) but NOT operational fields (status, DPI, consent dates).

### 3. Grants
EXECUTE on both functions granted to authenticated only. No anon access.

## Security
- Both functions derive identity from auth.uid()/JWT email — never accept
  a caller-supplied participant id (no IDOR).
- No anon access — students must be signed in.
- Existing staff-only policies on participants remain unchanged.
*/

CREATE OR REPLACE FUNCTION get_my_account_data()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_id uuid;
  v_result jsonb;
BEGIN
  IF v_uid IS NULL AND v_email = '' THEN
    RETURN NULL;
  END IF;

  SELECT id INTO v_id FROM participants
   WHERE (v_uid IS NOT NULL AND id = v_uid)
      OR (v_email <> '' AND lower(primary_email) = v_email)
   LIMIT 1;

  IF v_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'participant', (
      SELECT to_jsonb(x) FROM (
        SELECT id, first_name, last_name, primary_email, phone,
               gender, department, municipality, age_range, urban_rural,
               pueblo, employment_situation, business_owner, sector,
               institution, digital_skill_level, how_found_us,
               profile_slug, public_profile_enabled, created_at,
               last_activity_at
          FROM participants WHERE id = v_id
      ) x
    ),
    'enrollments', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT jsonb_build_object(
                 'id', e.id, 'status', e.status,
                 'enrolled_at', e.enrolled_at,
                 'completed_at', e.completed_at,
                 'course', jsonb_build_object(
                   'id', c.id, 'title', c.title, 'slug', c.slug,
                   'status', c.status, 'category', c.category,
                   'level', c.level, 'duration', c.duration,
                   'drive_folder_url', c.drive_folder_url
                 )
              ) AS obj
          FROM enrollments e
          LEFT JOIN courses c ON c.id = e.course_id
         WHERE e.participant_id = v_id
         ORDER BY e.enrolled_at DESC
      ) t
    ), '[]'::jsonb),
    'certificates', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT jsonb_build_object(
                 'id', ct.id, 'certificate_code', ct.certificate_code,
                 'status', ct.status, 'issued_at', ct.issued_at,
                 'hours', ct.hours, 'pdf_url', ct.pdf_url,
                 'verification_url', ct.verification_url,
                 'certificate_type', ct.certificate_type,
                 'course', jsonb_build_object(
                   'id', c.id, 'title', c.title, 'slug', c.slug
                 )
              ) AS obj
          FROM certificates ct
          LEFT JOIN courses c ON c.id = ct.course_id
         WHERE ct.participant_id = v_id
           AND COALESCE(ct.status, 'emitted') <> 'revoked'
         ORDER BY ct.issued_at DESC NULLS LAST
      ) t
    ), '[]'::jsonb),
    'attendance', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT jsonb_build_object(
                 'id', a.id, 'status', a.status,
                 'check_in_time', a.check_in_time, 'notes', a.notes,
                 'session', jsonb_build_object(
                   'id', s.id, 'title', s.title,
                   'session_date', s.session_date,
                   'start_time', s.start_time, 'end_time', s.end_time
                 ),
                 'course', jsonb_build_object(
                   'id', c.id, 'title', c.title, 'slug', c.slug
                 )
              ) AS obj
          FROM attendance a
          LEFT JOIN course_sessions s ON s.id = a.session_id
          LEFT JOIN courses c ON c.id = s.course_id
         WHERE a.participant_id = v_id
         ORDER BY s.session_date DESC NULLS LAST
      ) t
    ), '[]'::jsonb),
    'skills', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT jsonb_build_object(
                 'id', ps.id, 'level', ps.level,
                 'skill', jsonb_build_object(
                   'id', sk.id, 'name', sk.name, 'category', sk.category
                 )
              ) AS obj
          FROM participant_skills ps
          JOIN skills sk ON sk.id = ps.skill_id
         WHERE ps.participant_id = v_id
           AND COALESCE(ps.status, 'active') = 'active'
      ) t
    ), '[]'::jsonb),
    'badges', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT jsonb_build_object(
                 'id', pb.id, 'awarded_at', pb.awarded_at,
                 'badge', jsonb_build_object(
                   'id', b.id, 'name', b.name, 'icon', b.icon,
                   'color', b.color, 'description', b.description
                 )
              ) AS obj
          FROM participant_badges pb
          JOIN badges b ON b.id = pb.badge_id
         WHERE pb.participant_id = v_id
           AND COALESCE(pb.status, 'active') = 'active'
         ORDER BY pb.awarded_at DESC
      ) t
    ), '[]'::jsonb),
    'path_progress', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT jsonb_build_object(
                 'id', pp.id, 'completion_percentage', pp.completion_percentage,
                 'status', pp.status,
                 'path', jsonb_build_object(
                   'id', lp.id, 'name', lp.name, 'slug', lp.slug
                 )
              ) AS obj
          FROM path_progress pp
          LEFT JOIN learning_paths lp ON lp.id = pp.learning_path_id
         WHERE pp.participant_id = v_id
      ) t
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION get_my_account_data() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_my_account_data() TO authenticated;


CREATE OR REPLACE FUNCTION update_my_profile(
  p_phone text DEFAULT NULL,
  p_gender text DEFAULT NULL,
  p_department text DEFAULT NULL,
  p_municipality text DEFAULT NULL,
  p_age_range text DEFAULT NULL,
  p_urban_rural text DEFAULT NULL,
  p_pueblo text DEFAULT NULL,
  p_employment_situation text DEFAULT NULL,
  p_digital_skill_level text DEFAULT NULL,
  p_institution text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_id uuid;
BEGIN
  IF v_uid IS NULL AND v_email = '' THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT id INTO v_id FROM participants
   WHERE (v_uid IS NOT NULL AND id = v_uid)
      OR (v_email <> '' AND lower(primary_email) = v_email)
   LIMIT 1;

  IF v_id IS NULL THEN
    RAISE EXCEPTION 'No se encontro tu cuenta';
  END IF;

  UPDATE participants SET
    phone           = COALESCE(nullif(p_phone, ''), phone),
    gender          = COALESCE(nullif(p_gender, ''), gender),
    department      = COALESCE(nullif(p_department, ''), department),
    municipality    = COALESCE(nullif(p_municipality, ''), municipality),
    age_range       = COALESCE(nullif(p_age_range, ''), age_range),
    urban_rural     = COALESCE(nullif(p_urban_rural, ''), urban_rural),
    pueblo          = COALESCE(nullif(p_pueblo, ''), pueblo),
    employment_situation = COALESCE(nullif(p_employment_situation, ''), employment_situation),
    digital_skill_level  = COALESCE(nullif(p_digital_skill_level, ''), digital_skill_level),
    institution     = COALESCE(nullif(p_institution, ''), institution),
    updated_at      = now()
  WHERE id = v_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION update_my_profile(text, text, text, text, text, text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION update_my_profile(text, text, text, text, text, text, text, text, text, text) TO authenticated;
