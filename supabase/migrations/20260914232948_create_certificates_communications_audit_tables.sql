/*
# Create Certificates, Communications, and Audit Log Tables

Final set of tables for the participant management module.

1. New Tables

## `certificates`
- `id` (uuid, primary key) - Unique identifier
- `participant_id` (uuid, FK) - Link to participant
- `course_id` (uuid, FK) - Link to course
- `certificate_code` (text, unique, not null) - Unique verification code
- `issued_at` (timestamptz) - Issue date
- `certificate_type` (text) - Type: completion, participation, excellence
- `pdf_url` (text) - URL to generated PDF
- `metadata` (jsonb) - Additional certificate data

## `email_messages`
- `id` (uuid, primary key) - Unique identifier
- `subject` (text, not null) - Email subject
- `body` (text, not null) - Email body (HTML allowed)
- `sender` (text) - Sender identifier
- `message_type` (text) - Type: welcome, reminder, notification, certificate, bulk, custom
- `status` (text) - Status: draft, queued, sent, failed
- `scheduled_at` (timestamptz) - When to send
- `sent_at` (timestamptz) - When actually sent
- `metadata` (jsonb) - Template vars, campaign info
- `created_at` (timestamptz) - Timestamp

## `email_recipients`
- `id` (uuid, primary key) - Unique identifier
- `message_id` (uuid, FK) - Link to email message
- `participant_id` (uuid, FK) - Link to participant
- `email` (text, not null) - Recipient email
- `status` (text) - Delivery status: pending, sent, delivered, bounced, failed
- `sent_at` (timestamptz) - When sent to this recipient
- `opened_at` (timestamptz) - When opened (if tracked)
- `error_message` (text) - Error details if failed

## `audit_log`
- `id` (uuid, primary key) - Unique identifier
- `entity_type` (text, not null) - What was changed: participant, enrollment, course, etc.
- `entity_id` (uuid) - ID of changed entity
- `action` (text, not null) - Action: create, update, delete, import, export
- `changes` (jsonb) - Before/after snapshot
- `performed_by` (text) - Who did it (admin email)
- `ip_address` (text) - Request IP
- `created_at` (timestamptz) - Timestamp

## `communication_preferences`
- `participant_id` (uuid, PK + FK) - One row per participant
- `email_notifications` (boolean) - Opt-in for email
- `sms_notifications` (boolean) - Opt-in for SMS
- `whatsapp_notifications` (boolean) - Opt-in for WhatsApp
- `language` (text) - Preferred language: es, en
- `updated_at` (timestamptz) - Last update

2. Security
- RLS enabled on all tables with anon+authenticated access

3. Indexes
- certificates: participant_id, course_id, certificate_code
- email_messages: status, message_type
- email_recipients: message_id, participant_id
- audit_log: entity_type, entity_id, created_at
*/

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_code text UNIQUE NOT NULL,
  issued_at timestamptz DEFAULT now(),
  certificate_type text NOT NULL DEFAULT 'completion' CHECK (certificate_type IN ('completion', 'participation', 'excellence')),
  pdf_url text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cert_select" ON certificates;
CREATE POLICY "cert_select" ON certificates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "cert_insert" ON certificates;
CREATE POLICY "cert_insert" ON certificates FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "cert_update" ON certificates;
CREATE POLICY "cert_update" ON certificates FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "cert_delete" ON certificates;
CREATE POLICY "cert_delete" ON certificates FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_certs_participant ON certificates(participant_id);
CREATE INDEX IF NOT EXISTS idx_certs_course ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certs_code ON certificates(certificate_code);

-- Email messages table
CREATE TABLE IF NOT EXISTS email_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body text NOT NULL,
  sender text,
  message_type text NOT NULL DEFAULT 'custom' CHECK (message_type IN ('welcome', 'reminder', 'notification', 'certificate', 'bulk', 'custom')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emsg_select" ON email_messages;
CREATE POLICY "emsg_select" ON email_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "emsg_insert" ON email_messages;
CREATE POLICY "emsg_insert" ON email_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "emsg_update" ON email_messages;
CREATE POLICY "emsg_update" ON email_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "emsg_delete" ON email_messages;
CREATE POLICY "emsg_delete" ON email_messages FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_emsg_status ON email_messages(status);
CREATE INDEX IF NOT EXISTS idx_emsg_type ON email_messages(message_type);

-- Email recipients table
CREATE TABLE IF NOT EXISTS email_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES email_messages(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES participants(id) ON DELETE SET NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),
  sent_at timestamptz,
  opened_at timestamptz,
  error_message text
);

ALTER TABLE email_recipients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ercpt_select" ON email_recipients;
CREATE POLICY "ercpt_select" ON email_recipients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ercpt_insert" ON email_recipients;
CREATE POLICY "ercpt_insert" ON email_recipients FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ercpt_update" ON email_recipients;
CREATE POLICY "ercpt_update" ON email_recipients FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ercpt_delete" ON email_recipients;
CREATE POLICY "ercpt_delete" ON email_recipients FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_ercpt_message ON email_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_ercpt_participant ON email_recipients(participant_id);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'import', 'export', 'bulk_action')),
  changes jsonb DEFAULT '{}'::jsonb,
  performed_by text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_select" ON audit_log;
CREATE POLICY "audit_select" ON audit_log FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "audit_insert" ON audit_log;
CREATE POLICY "audit_insert" ON audit_log FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- Communication preferences table
CREATE TABLE IF NOT EXISTS communication_preferences (
  participant_id uuid PRIMARY KEY REFERENCES participants(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  whatsapp_notifications boolean DEFAULT false,
  language text DEFAULT 'es' CHECK (language IN ('es', 'en')),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE communication_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cpref_select" ON communication_preferences;
CREATE POLICY "cpref_select" ON communication_preferences FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "cpref_insert" ON communication_preferences;
CREATE POLICY "cpref_insert" ON communication_preferences FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "cpref_update" ON communication_preferences;
CREATE POLICY "cpref_update" ON communication_preferences FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "cpref_delete" ON communication_preferences;
CREATE POLICY "cpref_delete" ON communication_preferences FOR DELETE TO anon, authenticated USING (true);
