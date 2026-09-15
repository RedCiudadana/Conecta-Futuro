/*
# Add Drive folder URL to courses

## Purpose
Store a Google Drive folder link per course where scanned diplomas from
previous cohorts are kept. Admins can link existing diploma archives so
participants from earlier courses can retrieve their certificates.

## Modified Tables
- `courses`
  - `drive_folder_url` (text, nullable) -- URL to the Google Drive folder
    containing diplomas from previous course editions.

## Security
- No new policies needed; existing course RLS policies cover the new column.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'drive_folder_url') THEN
    ALTER TABLE courses ADD COLUMN drive_folder_url text;
  END IF;
END $$;
