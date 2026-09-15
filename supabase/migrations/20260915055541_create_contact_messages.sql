/*
# Contact Messages Table

## Purpose
Store messages submitted through the Contact page form. Replaces the previous
Google Forms integration with a native database table so all submissions are
persisted in the project's own Supabase database.

## New Tables
- `contact_messages`
  - `id` uuid PK
  - `name` text (sender's full name)
  - `email` text (sender's email)
  - `subject` text (reason/topic for contact)
  - `message` text (the message body)
  - `status` text (new/read/replied, defaults to 'new')
  - `created_at` timestamptz

## Security
- RLS enabled. This is a no-auth public form, so policies use `TO anon, authenticated`.
- INSERT: anyone can submit a contact message.
- SELECT/UPDATE/DELETE: only authenticated users (admins) can read or manage messages.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_message" ON contact_messages;
CREATE POLICY "anon_insert_contact_message" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);
