/*
  # Create diagnostic results table for Digitaliza tu PyME

  1. New Tables
    - `diagnostic_results`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, nullable) - References auth.users if logged in
      - `email` (text, nullable) - Email for anonymous users
      - `name` (text, nullable) - Name of participant
      - `business_name` (text, nullable) - Name of the business
      - `answers` (jsonb) - Array of answers (question_id, answer, points)
      - `total_score` (integer) - Total points (10-40)
      - `maturity_level` (integer) - Level 1-4
      - `recommended_modules` (text[]) - Array of recommended module numbers
      - `created_at` (timestamptz) - When diagnostic was completed
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `diagnostic_results` table
    - Add policy for authenticated users to read their own results
    - Add policy for authenticated users to create their own results
    - Add policy for anonymous users to create results (no user_id)
    - Add policy for users to update their own results
*/

CREATE TABLE IF NOT EXISTS diagnostic_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  business_name text,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_score integer NOT NULL CHECK (total_score >= 10 AND total_score <= 40),
  maturity_level integer NOT NULL CHECK (maturity_level >= 1 AND maturity_level <= 4),
  recommended_modules text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own diagnostic results
CREATE POLICY "Users can view own diagnostic results"
  ON diagnostic_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can create their own diagnostic results
CREATE POLICY "Authenticated users can create own diagnostic results"
  ON diagnostic_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Anonymous users can create diagnostic results (no user_id)
CREATE POLICY "Anonymous users can create diagnostic results"
  ON diagnostic_results
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Policy: Users can update their own diagnostic results
CREATE POLICY "Users can update own diagnostic results"
  ON diagnostic_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_user_id ON diagnostic_results(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_created_at ON diagnostic_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_maturity_level ON diagnostic_results(maturity_level);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_diagnostic_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER diagnostic_results_updated_at
  BEFORE UPDATE ON diagnostic_results
  FOR EACH ROW
  EXECUTE FUNCTION update_diagnostic_results_updated_at();
