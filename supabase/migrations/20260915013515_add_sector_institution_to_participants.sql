/*
# Add sector and institution columns to participants

1. Modified Tables
   - `participants`
     - `sector` (text) - Sector: publico, privado, sociedad_civil, otro
     - `institution` (text) - Name of institution, organization, or company

2. Notes
   - These fields are collected during public course registration.
   - The DPI column remains in the table but is no longer collected on the public form.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'participants' AND column_name = 'sector'
  ) THEN
    ALTER TABLE participants ADD COLUMN sector text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'participants' AND column_name = 'institution'
  ) THEN
    ALTER TABLE participants ADD COLUMN institution text;
  END IF;
END $$;
