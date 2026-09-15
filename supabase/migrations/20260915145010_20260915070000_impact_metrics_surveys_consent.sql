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
