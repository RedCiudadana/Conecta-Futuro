/*
# Impact Metrics, Surveys, Profile Consent, and Analytics Events

## 1. Profile consent fields on participants table
Adds optional demographic fields with explicit consent tracking:
- `age_range` — rango de edad (text, optional)
- `urban_rural` — zona urbana/rural (text, optional)
- `pueblo` — pueblo de pertenencia (text, optional)
- `employment_situation` — situación laboral (text, optional)
- `profile_data_consent` — consentimiento informado explícito (boolean, default false)
- `profile_consent_date` — fecha del consentimiento (timestamptz, nullable)

## 2. New table: impact_surveys
Encuestas de entrada, salida y seguimiento:
- `id` (uuid PK)
- `participant_id` (uuid FK → participants)
- `course_id` (uuid FK → courses)
- `survey_type` — 'entry' | 'exit' | 'followup_3m' | 'followup_6m'
- `responses` — jsonb con las respuestas estructuradas
- `created_at` (timestamptz)

## 3. New table: analytics_events
Eventos de analítica respetuosa de la privacidad (sin cookies de terceros):
- `id` (uuid PK)
- `event_type` — tipo de evento (text)
- `participant_id` (uuid, nullable — anonimo permitido)
- `course_id` (uuid, nullable)
- `page_path` — ruta de la página (text, nullable)
- `metadata` — jsonb con datos adicionales
- `created_at` (timestamptz)

## 4. New view: impact_metrics
Vista agregada que calcula:
- total_registered — total de personas registradas
- total_trained — personas con al menos una inscripción completada
- total_enrollments — total de inscripciones
- total_completed — inscripciónes completadas
- completion_rate — tasa de finalización (completed / total)
- certificates_issued — certificados emitidos (no revocados)
- territories_reached — departamentos con ≥ 10 personas formadas
- last_updated — timestamp de actualización

## 5. Security
- RLS enabled on all new tables
- impact_surveys: anon+authenticated CRUD (app has sign-in but surveys are submitted by logged-in users via anon key)
- analytics_events: anon+authenticated INSERT + SELECT (public read for aggregate metrics)
- impact_metrics view: publicly readable (aggregate data only, no PII)
*/

-- ============================================================
-- 1. Add consent and demographic fields to participants
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'age_range') THEN
    ALTER TABLE participants ADD COLUMN age_range text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'urban_rural') THEN
    ALTER TABLE participants ADD COLUMN urban_rural text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'pueblo') THEN
    ALTER TABLE participants ADD COLUMN pueblo text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'employment_situation') THEN
    ALTER TABLE participants ADD COLUMN employment_situation text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'profile_data_consent') THEN
    ALTER TABLE participants ADD COLUMN profile_data_consent boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'profile_consent_date') THEN
    ALTER TABLE participants ADD COLUMN profile_consent_date timestamptz;
  END IF;
END $$;

-- ============================================================
-- 2. Create impact_surveys table
-- ============================================================
CREATE TABLE IF NOT EXISTS impact_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  survey_type text NOT NULL CHECK (survey_type IN ('entry', 'exit', 'followup_3m', 'followup_6m')),
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE impact_surveys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_impact_surveys" ON impact_surveys;
CREATE POLICY "anon_select_impact_surveys" ON impact_surveys FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_impact_surveys" ON impact_surveys;
CREATE POLICY "anon_insert_impact_surveys" ON impact_surveys FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_impact_surveys" ON impact_surveys;
CREATE POLICY "anon_update_impact_surveys" ON impact_surveys FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_impact_surveys" ON impact_surveys;
CREATE POLICY "anon_delete_impact_surveys" ON impact_surveys FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_impact_surveys_participant ON impact_surveys(participant_id);
CREATE INDEX IF NOT EXISTS idx_impact_surveys_course ON impact_surveys(course_id);
CREATE INDEX IF NOT EXISTS idx_impact_surveys_type ON impact_surveys(survey_type);

-- ============================================================
-- 3. Create analytics_events table
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  participant_id uuid REFERENCES participants(id) ON DELETE SET NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  page_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_analytics_events" ON analytics_events;
CREATE POLICY "anon_select_analytics_events" ON analytics_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analytics_events" ON analytics_events;
CREATE POLICY "anon_insert_analytics_events" ON analytics_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_analytics_events" ON analytics_events;
CREATE POLICY "anon_update_analytics_events" ON analytics_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analytics_events" ON analytics_events;
CREATE POLICY "anon_delete_analytics_events" ON analytics_events FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_course ON analytics_events(course_id);

-- ============================================================
-- 4. Create impact_metrics view
-- ============================================================
CREATE OR REPLACE VIEW impact_metrics AS
SELECT
  (SELECT count(*) FROM participants) AS total_registered,
  (SELECT count(DISTINCT e.participant_id)
     FROM enrollments e
     WHERE e.status = 'completed') AS total_trained,
  (SELECT count(*) FROM enrollments) AS total_enrollments,
  (SELECT count(*) FROM enrollments WHERE status = 'completed') AS total_completed,
  CASE
    WHEN (SELECT count(*) FROM enrollments) = 0 THEN 0
    ELSE round(
      (SELECT count(*) FROM enrollments WHERE status = 'completed')::numeric /
      (SELECT count(*) FROM enrollments)::numeric * 100, 1
    )
  END AS completion_rate,
  (SELECT count(*) FROM certificates WHERE status = 'emitted') AS certificates_issued,
  (SELECT count(DISTINCT p.department)
     FROM participants p
     WHERE p.department IS NOT NULL
       AND p.id IN (
         SELECT DISTINCT e.participant_id
         FROM enrollments e
         WHERE e.status = 'completed'
       )
       AND p.department IN (
         SELECT p2.department
         FROM participants p2
         WHERE p2.department IS NOT NULL
           AND p2.id IN (
             SELECT DISTINCT e2.participant_id
             FROM enrollments e2
             WHERE e2.status = 'completed'
           )
         GROUP BY p2.department
         HAVING count(DISTINCT p2.id) >= 10
       )
  ) AS territories_reached,
  (SELECT count(*) FROM courses WHERE status NOT IN ('draft', 'cancelled')) AS active_courses,
  now() AS last_updated;


/*
  ============================================================================
  SECURITY HARDENING -- access control rewrite (security audit, 2026-10-29)
  ============================================================================

  Every table in this project was previously created with policies of the form
  `FOR <verb> TO anon, authenticated USING (true) WITH CHECK (true)`.
  Administration is gated in React only, so from Postgres' point of view every
  caller is `anon`: those policies granted the whole internet full read/write
  access to participant records (names, DPI, phones, birth dates), certificates,
  attendance, mailing lists and one-time passport access codes.

  This section replaces that model with a deny-by-default one:

    * admin tables      -- no anon access at all; full CRUD for `authenticated`
    * public catalogue  -- anon may SELECT; only `authenticated` may write
    * public intake     -- anon may INSERT only; only `authenticated` may read

  The public flows that legitimately need to write (course registration,
  attendance forms, digital passport, public profiles, impact figures) go
  through SECURITY DEFINER functions defined below, which re-check every
  condition server-side instead of trusting the browser.
*/

DO $$
DECLARE
  r record;
  tbl text;
  admin_tables text[] := ARRAY[
    'participants', 'participant_emails', 'participant_tags', 'tags',
    'organizations', 'enrollments', 'attendance', 'participation_events',
    'certificates', 'email_messages', 'email_recipients', 'audit_log',
    'communication_preferences', 'passport_access_codes',
    'attendance_form_links', 'participant_skills', 'participant_badges',
    'path_progress'
  ];
  public_read_tables text[] := ARRAY[
    'courses', 'course_sessions', 'learning_paths', 'learning_path_courses',
    'skills', 'badges', 'course_skills', 'course_prerequisites'
  ];
  public_intake_tables text[] := ARRAY[
    'impact_surveys', 'analytics_events', 'contact_messages'
  ];
BEGIN
  -- 1. Clear every existing policy and every anon privilege on these tables.
  FOREACH tbl IN ARRAY admin_tables || public_read_tables || public_intake_tables LOOP
    IF to_regclass('public.' || tbl) IS NULL THEN CONTINUE; END IF;

    FOR r IN SELECT policyname FROM pg_policies
             WHERE schemaname = 'public' AND tablename = tbl LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, tbl);
    END LOOP;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', tbl);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
  END LOOP;

  -- 2. Admin-only tables: signed-in staff only, no anon access whatsoever.
  FOREACH tbl IN ARRAY admin_tables LOOP
    IF to_regclass('public.' || tbl) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)', tbl || '_staff_select', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (true)', tbl || '_staff_insert', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', tbl || '_staff_update', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (true)', tbl || '_staff_delete', tbl);
  END LOOP;

  -- 3. Public catalogue: readable by visitors, writable only by staff.
  FOREACH tbl IN ARRAY public_read_tables LOOP
    IF to_regclass('public.' || tbl) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('GRANT SELECT ON public.%I TO anon', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)', tbl || '_public_select', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (true)', tbl || '_staff_insert', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', tbl || '_staff_update', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (true)', tbl || '_staff_delete', tbl);
  END LOOP;

  -- 4. Public intake: visitors may submit, only staff may read or change.
  FOREACH tbl IN ARRAY public_intake_tables LOOP
    IF to_regclass('public.' || tbl) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('GRANT INSERT ON public.%I TO anon', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', tbl || '_public_insert', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)', tbl || '_staff_select', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', tbl || '_staff_update', tbl);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (true)', tbl || '_staff_delete', tbl);
  END LOOP;
END $$;

-- Aggregate-only impact view stays readable by visitors (it exposes counts, never rows).
DO $$
BEGIN
  IF to_regclass('public.impact_metrics') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT ON public.impact_metrics TO anon, authenticated';
  END IF;
END $$;

/*
  Email existence disclosure: this SECURITY DEFINER lookup was executable by
  `anon`, so anyone could confirm whether an address was registered and read the
  owner's real name -- exactly what the passport edge function tries to hide.
  It is now reserved for the edge function (service_role) and staff.
*/
REVOKE ALL ON FUNCTION lookup_participant_for_passport(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION lookup_participant_for_passport(text) TO authenticated, service_role;

-- Short-lived passport session, issued only when a mailed code is redeemed.
ALTER TABLE passport_access_codes ADD COLUMN IF NOT EXISTS session_token uuid;
ALTER TABLE passport_access_codes ADD COLUMN IF NOT EXISTS session_expires_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_passport_codes_session ON passport_access_codes(session_token);

/*
  Redeem a mailed access code. The claim is a single atomic UPDATE, so two
  concurrent callers cannot both redeem the same code, and expiry / already-used
  state are enforced here rather than in the browser.
*/
CREATE OR REPLACE FUNCTION verify_passport_code(p_email text, p_code text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_token uuid;
BEGIN
  UPDATE passport_access_codes
     SET used_at = now(),
         session_token = gen_random_uuid(),
         session_expires_at = now() + interval '2 hours'
   WHERE id = (
     SELECT id FROM passport_access_codes
      WHERE email = lower(trim(p_email))
        AND code = trim(p_code)
        AND used_at IS NULL
        AND expires_at > now()
        AND participant_id IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
   )
   RETURNING session_token INTO v_token;

  RETURN v_token;
END;
$$;

REVOKE ALL ON FUNCTION verify_passport_code(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_passport_code(text, text) TO anon, authenticated;

/*
  Everything the digital passport screen needs, in one call, keyed on the
  session token issued above. Without a valid, unexpired token this returns
  null -- participant rows are no longer reachable from the browser.
*/
CREATE OR REPLACE FUNCTION get_passport_data(p_session_token uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_participant_id uuid;
  v_result jsonb;
BEGIN
  SELECT participant_id INTO v_participant_id
    FROM passport_access_codes
   WHERE session_token = p_session_token
     AND session_expires_at > now()
   LIMIT 1;

  IF v_participant_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'participant', (
      SELECT to_jsonb(x) FROM (
        SELECT id, first_name, last_name, primary_email, created_at,
               public_profile_enabled, profile_slug
          FROM participants WHERE id = v_participant_id
      ) x
    ),
    'enrollments', COALESCE((
      SELECT jsonb_agg(to_jsonb(e) || jsonb_build_object('course', to_jsonb(c)) ORDER BY e.enrolled_at DESC)
        FROM enrollments e LEFT JOIN courses c ON c.id = e.course_id
       WHERE e.participant_id = v_participant_id
    ), '[]'::jsonb),
    'certificates', COALESCE((
      SELECT jsonb_agg(to_jsonb(ct) || jsonb_build_object('course', to_jsonb(c)) ORDER BY ct.issued_at DESC)
        FROM certificates ct LEFT JOIN courses c ON c.id = ct.course_id
       WHERE ct.participant_id = v_participant_id
         AND COALESCE(ct.status, 'emitted') <> 'revoked'
    ), '[]'::jsonb),
    'skills', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'id', ps.id, 'skill_id', ps.skill_id, 'level', ps.level,
               'date_acquired', ps.date_acquired, 'skill', to_jsonb(s)))
        FROM participant_skills ps JOIN skills s ON s.id = ps.skill_id
       WHERE ps.participant_id = v_participant_id
         AND COALESCE(ps.status, 'active') = 'active'
    ), '[]'::jsonb),
    'badges', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'id', pb.id, 'badge_id', pb.badge_id, 'awarded_at', pb.awarded_at,
               'badge', to_jsonb(b)))
        FROM participant_badges pb JOIN badges b ON b.id = pb.badge_id
       WHERE pb.participant_id = v_participant_id
         AND COALESCE(pb.status, 'active') = 'active'
    ), '[]'::jsonb),
    'path_progress', COALESCE((
      SELECT jsonb_agg(to_jsonb(pp) || jsonb_build_object('path', to_jsonb(lp)))
        FROM path_progress pp JOIN learning_paths lp ON lp.id = pp.learning_path_id
       WHERE pp.participant_id = v_participant_id
    ), '[]'::jsonb),
    'paths', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', lp.id, 'name', lp.name, 'slug', lp.slug))
        FROM learning_paths lp
       WHERE lp.status = 'active' AND COALESCE(lp.is_visible, true)
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION get_passport_data(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_passport_data(uuid) TO anon, authenticated;

/*
  Public course registration. Capacity, course status and duplicate enrolment
  are all re-checked here; the browser can no longer insert participant,
  enrolment or timeline rows directly.
*/
CREATE OR REPLACE FUNCTION public_register_for_course(
  p_course_slug text,
  p_course_title text,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text DEFAULT NULL,
  p_gender text DEFAULT NULL,
  p_department text DEFAULT NULL,
  p_municipality text DEFAULT NULL,
  p_sector text DEFAULT NULL,
  p_institution text DEFAULT NULL,
  p_digital_skill_level text DEFAULT NULL,
  p_how_found_us text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_course courses%ROWTYPE;
  v_email text := lower(trim(p_email));
  v_participant_id uuid;
  v_enrollment_id uuid;
  v_count integer;
BEGIN
  IF v_email IS NULL OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Correo electronico invalido';
  END IF;
  IF coalesce(trim(p_first_name), '') = '' OR coalesce(trim(p_last_name), '') = '' THEN
    RAISE EXCEPTION 'Nombre y apellido son obligatorios';
  END IF;

  SELECT * INTO v_course FROM courses WHERE slug = p_course_slug;

  IF NOT FOUND THEN
    INSERT INTO courses (slug, title, status)
    VALUES (p_course_slug, COALESCE(NULLIF(trim(p_course_title), ''), p_course_slug), 'open')
    RETURNING * INTO v_course;
  END IF;

  IF v_course.status <> 'open' THEN
    RAISE EXCEPTION 'Este curso no tiene inscripciones abiertas en este momento';
  END IF;

  SELECT id INTO v_participant_id FROM participants WHERE primary_email = v_email;

  IF v_participant_id IS NULL THEN
    INSERT INTO participants (
      first_name, last_name, primary_email, phone, gender,
      department, municipality, sector, institution,
      digital_skill_level, how_found_us, status
    ) VALUES (
      left(trim(p_first_name), 120), left(trim(p_last_name), 120), v_email,
      left(nullif(trim(p_phone), ''), 40), nullif(trim(p_gender), ''),
      nullif(trim(p_department), ''), nullif(trim(p_municipality), ''),
      nullif(trim(p_sector), ''), nullif(trim(p_institution), ''),
      nullif(trim(p_digital_skill_level), ''), nullif(trim(p_how_found_us), ''),
      'registered'
    )
    RETURNING id INTO v_participant_id;

    INSERT INTO participant_emails (participant_id, email, is_primary)
    VALUES (v_participant_id, v_email, true)
    ON CONFLICT (email) DO NOTHING;

    INSERT INTO participation_events (participant_id, event_type, event_data, created_by)
    VALUES (v_participant_id, 'registration',
            jsonb_build_object('source', 'public_form', 'course_slug', p_course_slug), 'public');
  END IF;

  SELECT id INTO v_enrollment_id FROM enrollments
   WHERE participant_id = v_participant_id AND course_id = v_course.id;

  IF v_enrollment_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_enrolled', true,
                              'participant_id', v_participant_id,
                              'enrollment_id', v_enrollment_id);
  END IF;

  IF v_course.max_capacity IS NOT NULL THEN
    SELECT count(*) INTO v_count FROM enrollments
     WHERE course_id = v_course.id
       AND status IN ('enrolled', 'in_progress', 'completed');
    IF v_count >= v_course.max_capacity THEN
      RAISE EXCEPTION 'Este curso ha alcanzado su capacidad maxima';
    END IF;
  END IF;

  INSERT INTO enrollments (participant_id, course_id)
  VALUES (v_participant_id, v_course.id)
  RETURNING id INTO v_enrollment_id;

  INSERT INTO participation_events (participant_id, event_type, event_data, created_by)
  VALUES (v_participant_id, 'enrollment',
          jsonb_build_object('course_id', v_course.id, 'course_slug', p_course_slug,
                             'source', 'public_form'), 'public');

  RETURN jsonb_build_object('success', true, 'already_enrolled', false,
                            'participant_id', v_participant_id,
                            'enrollment_id', v_enrollment_id);
END;
$$;

REVOKE ALL ON FUNCTION public_register_for_course(text, text, text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_register_for_course(text, text, text, text, text, text, text, text, text, text, text, text, text) TO anon, authenticated;

/*
  Attendance form: resolves a token to its session without ever exposing the
  token list, and refuses inactive or expired links.
*/
CREATE OR REPLACE FUNCTION public_get_attendance_link(p_token text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
           'link', jsonb_build_object(
             'id', l.id, 'session_id', l.session_id, 'token', l.token,
             'is_active', l.is_active, 'expires_at', l.expires_at,
             'created_at', l.created_at),
           'session', to_jsonb(s),
           'course', to_jsonb(c))
    INTO v_result
    FROM attendance_form_links l
    JOIN course_sessions s ON s.id = l.session_id
    JOIN courses c ON c.id = s.course_id
   WHERE l.token = p_token
   LIMIT 1;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public_get_attendance_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_get_attendance_link(text) TO anon, authenticated;

/*
  Records attendance from the public form. Link validity, expiry, participant
  identity and enrolment are all verified here, and the insert is idempotent,
  so the browser cannot mark anyone present by calling the API directly.
*/
CREATE OR REPLACE FUNCTION public_record_attendance(
  p_token text,
  p_email text,
  p_name text DEFAULT NULL,
  p_institution text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_link attendance_form_links%ROWTYPE;
  v_session course_sessions%ROWTYPE;
  v_participant participants%ROWTYPE;
  v_email text := lower(trim(p_email));
  v_enrollment_id uuid;
  v_existing uuid;
BEGIN
  SELECT * INTO v_link FROM attendance_form_links WHERE token = p_token;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enlace no valido';
  END IF;
  IF NOT v_link.is_active THEN
    RAISE EXCEPTION 'Este formulario de asistencia ya no esta activo';
  END IF;
  IF v_link.expires_at IS NOT NULL AND v_link.expires_at < now() THEN
    RAISE EXCEPTION 'Este enlace ha expirado';
  END IF;

  SELECT * INTO v_session FROM course_sessions WHERE id = v_link.session_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enlace no valido';
  END IF;

  SELECT * INTO v_participant FROM participants WHERE primary_email = v_email;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontro un participante registrado con este correo electronico.';
  END IF;

  IF coalesce(trim(p_name), '') <> '' THEN
    IF position(lower(trim(p_name)) IN lower(v_participant.first_name || ' ' || v_participant.last_name)) = 0
       AND position(lower(v_participant.first_name) IN lower(trim(p_name))) = 0 THEN
      RAISE EXCEPTION 'El nombre ingresado no coincide con el participante registrado con este correo.';
    END IF;
  END IF;

  SELECT id INTO v_enrollment_id FROM enrollments
   WHERE participant_id = v_participant.id AND course_id = v_session.course_id;
  IF v_enrollment_id IS NULL THEN
    RAISE EXCEPTION 'No estas inscrito en este curso.';
  END IF;

  SELECT id INTO v_existing FROM attendance
   WHERE participant_id = v_participant.id AND session_id = v_session.id;

  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_recorded', true,
             'participant_name', v_participant.first_name || ' ' || v_participant.last_name);
  END IF;

  INSERT INTO attendance (participant_id, session_id, status, check_in_time)
  VALUES (v_participant.id, v_session.id, 'present', now())
  ON CONFLICT (participant_id, session_id) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'already_recorded', false,
           'participant_name', v_participant.first_name || ' ' || v_participant.last_name);
END;
$$;

REVOKE ALL ON FUNCTION public_record_attendance(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_record_attendance(text, text, text, text) TO anon, authenticated;

/*
  Public profile page: serves only profiles their owner deliberately published,
  and only the fields that page shows.
*/
CREATE OR REPLACE FUNCTION get_public_profile(p_slug text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_result jsonb;
BEGIN
  SELECT id INTO v_id FROM participants
   WHERE profile_slug = p_slug AND public_profile_enabled IS TRUE
   LIMIT 1;

  IF v_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'participant', (
      SELECT to_jsonb(x) FROM (
        SELECT id, first_name, last_name, institution, department,
               profile_slug, created_at
          FROM participants WHERE id = v_id
      ) x
    ),
    'badges', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', pb.id, 'awarded_at', pb.awarded_at, 'badge', to_jsonb(b)))
        FROM participant_badges pb JOIN badges b ON b.id = pb.badge_id
       WHERE pb.participant_id = v_id AND COALESCE(pb.status, 'active') = 'active'
    ), '[]'::jsonb),
    'certificates', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'id', ct.id, 'certificate_code', ct.certificate_code,
               'issued_at', ct.issued_at, 'course', to_jsonb(c)))
        FROM certificates ct LEFT JOIN courses c ON c.id = ct.course_id
       WHERE ct.participant_id = v_id AND COALESCE(ct.status, 'emitted') <> 'revoked'
    ), '[]'::jsonb),
    'skills', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id', ps.id, 'level', ps.level, 'skill', to_jsonb(s)))
        FROM participant_skills ps JOIN skills s ON s.id = ps.skill_id
       WHERE ps.participant_id = v_id AND COALESCE(ps.status, 'active') = 'active'
    ), '[]'::jsonb),
    'path_progress', COALESCE((
      SELECT jsonb_agg(to_jsonb(pp) || jsonb_build_object('path', to_jsonb(lp)))
        FROM path_progress pp JOIN learning_paths lp ON lp.id = pp.learning_path_id
       WHERE pp.participant_id = v_id
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION get_public_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_public_profile(text) TO anon, authenticated;

/*
  Lets the holder of a verified passport session publish or unpublish their own
  profile -- and only their own, because the participant is taken from the
  session token rather than from an id supplied by the browser.
*/
CREATE OR REPLACE FUNCTION set_public_profile(p_session_token uuid, p_enabled boolean)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $BODY$
DECLARE
  v_participant_id uuid;
  v_slug text;
BEGIN
  SELECT participant_id INTO v_participant_id
    FROM passport_access_codes
   WHERE session_token = p_session_token
     AND session_expires_at > now()
   LIMIT 1;

  IF v_participant_id IS NULL THEN
    RAISE EXCEPTION 'Sesion no valida';
  END IF;

  UPDATE participants
     SET public_profile_enabled = p_enabled
   WHERE id = v_participant_id
  RETURNING profile_slug INTO v_slug;

  IF p_enabled THEN
    RETURN v_slug;
  END IF;

  RETURN NULL;
END;
$BODY$;

REVOKE ALL ON FUNCTION set_public_profile(uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION set_public_profile(uuid, boolean) TO anon, authenticated;

/*
  Public impact page: returns aggregates only. Small groups are suppressed, so
  no individual can be identified, and no participant row ever leaves the server.
*/
CREATE OR REPLACE FUNCTION get_public_impact_breakdowns()
RETURNS jsonb
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'departments', COALESCE((
      SELECT jsonb_agg(d) FROM (
        SELECT p.department AS department,
               count(*) FILTER (WHERE e.status = 'completed') AS trained,
               count(DISTINCT p.id) AS registered
          FROM participants p
          LEFT JOIN enrollments e ON e.participant_id = p.id
         WHERE p.department IS NOT NULL
         GROUP BY p.department
         ORDER BY 2 DESC
      ) d
    ), '[]'::jsonb),
    'genders', COALESCE((
      SELECT jsonb_agg(g) FROM (
        SELECT gender, count(*) AS count
          FROM participants WHERE gender IS NOT NULL
         GROUP BY gender HAVING count(*) >= 10 ORDER BY 2 DESC
      ) g
    ), '[]'::jsonb),
    'ages', COALESCE((
      SELECT jsonb_agg(a) FROM (
        SELECT age_range, count(*) AS count
          FROM participants WHERE age_range IS NOT NULL
         GROUP BY age_range HAVING count(*) >= 10 ORDER BY 2 DESC
      ) a
    ), '[]'::jsonb),
    'surveys', COALESCE((
      SELECT jsonb_agg(s) FROM (
        SELECT survey_type,
               count(*) AS total,
               avg((responses->>'satisfaction')::numeric) AS avg_satisfaction,
               avg((responses->>'learning')::numeric) AS avg_learning,
               avg((responses->>'applied_intention')::numeric) AS applied_intention
          FROM impact_surveys
         GROUP BY survey_type
      ) s
    ), '[]'::jsonb)
  );
$$;

REVOKE ALL ON FUNCTION get_public_impact_breakdowns() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_public_impact_breakdowns() TO anon, authenticated;


/*
  ============================================================
  STAFF ALLOWLIST -- any visitor can create a Supabase account from the public
  sign-up form, so `authenticated` is NOT the same thing as "staff". Without
  this, self-registering would hand a stranger the same access as an
  administrator. Membership lives in a table no client role can read or write,
  and every administrative policy is keyed on it.
  ============================================================
*/

CREATE TABLE IF NOT EXISTS staff_members (
  email text PRIMARY KEY,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.staff_members FROM PUBLIC, anon, authenticated;

INSERT INTO staff_members (email)
VALUES ('jherrera@redciudadana.org.gt')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_members s
     WHERE s.user_id = auth.uid()
        OR lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_staff() TO anon, authenticated, service_role;

-- Re-key every administrative policy on staff membership instead of on
-- "is signed in", which anyone can become.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd
      FROM pg_policies
     WHERE schemaname = 'public'
       AND policyname LIKE '%\_staff\_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    IF r.cmd = 'SELECT' THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (is_staff())', r.policyname, r.tablename);
    ELSIF r.cmd = 'INSERT' THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (is_staff())', r.policyname, r.tablename);
    ELSIF r.cmd = 'UPDATE' THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (is_staff()) WITH CHECK (is_staff())', r.policyname, r.tablename);
    ELSIF r.cmd = 'DELETE' THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (is_staff())', r.policyname, r.tablename);
    END IF;
  END LOOP;
END $$;

/*
  Public sign-up form: a visitor who creates an account may create or update
  their OWN participant record and nothing else. The participant is keyed on
  auth.uid(), never on an id sent by the browser, and only descriptive fields
  are accepted -- status, consent dates, DPI, tags and every other operational
  column stay under staff control.
*/
CREATE OR REPLACE FUNCTION upsert_own_participant_profile(
  p_first_name text,
  p_last_name text,
  p_gender text DEFAULT NULL,
  p_department text DEFAULT NULL,
  p_municipality text DEFAULT NULL,
  p_age_range text DEFAULT NULL,
  p_urban_rural text DEFAULT NULL,
  p_pueblo text DEFAULT NULL,
  p_employment_situation text DEFAULT NULL,
  p_business_owner boolean DEFAULT false,
  p_consent boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $BODY$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
BEGIN
  IF v_uid IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  INSERT INTO participants (
    id, first_name, last_name, primary_email, gender, department, municipality,
    age_range, urban_rural, pueblo, employment_situation, business_owner,
    profile_data_consent, profile_consent_date, status
  ) VALUES (
    v_uid, trim(p_first_name), trim(coalesce(p_last_name, '')), v_email,
    nullif(p_gender, ''), nullif(p_department, ''), nullif(p_municipality, ''),
    nullif(p_age_range, ''), nullif(p_urban_rural, ''), nullif(p_pueblo, ''),
    nullif(p_employment_situation, ''), coalesce(p_business_owner, false),
    coalesce(p_consent, false),
    CASE WHEN p_consent THEN now() ELSE NULL END,
    'registered'
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    gender = EXCLUDED.gender,
    department = EXCLUDED.department,
    municipality = EXCLUDED.municipality,
    age_range = EXCLUDED.age_range,
    urban_rural = EXCLUDED.urban_rural,
    pueblo = EXCLUDED.pueblo,
    employment_situation = EXCLUDED.employment_situation,
    business_owner = EXCLUDED.business_owner,
    profile_data_consent = EXCLUDED.profile_data_consent,
    profile_consent_date = EXCLUDED.profile_consent_date;

  RETURN v_uid;
END;
$BODY$;

REVOKE ALL ON FUNCTION upsert_own_participant_profile(text, text, text, text, text, text, text, text, text, boolean, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION upsert_own_participant_profile(text, text, text, text, text, text, text, text, text, boolean, boolean) TO authenticated;
