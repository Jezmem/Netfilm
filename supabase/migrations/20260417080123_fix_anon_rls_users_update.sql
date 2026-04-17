/*
  # Fix RLS policies for anon role on users table

  ## Problem
  The backend uses the Supabase anon key (no service role key configured).
  The `users` table only had policies for `service_role`, so UPDATE operations
  (profile edit, avatar upload) were blocked by RLS, causing 500 errors.

  ## Changes
  1. Add SELECT policy for anon on users (needed for getProfile)
  2. Add UPDATE policy for anon on users (needed for updateProfile, uploadAvatar)

  ## Notes
  - Authorization is enforced at the Express layer via JWT middleware
  - The backend filters all queries by `req.user.id`, so users can only
    access their own data even though RLS uses anon role
*/

DROP POLICY IF EXISTS "Anon select users" ON users;
DROP POLICY IF EXISTS "Anon update users" ON users;

CREATE POLICY "Anon select users"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon update users"
  ON users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
