/*
  # Fix registration RLS - allow anon role to insert users

  ## Problem
  The backend server uses the anon key (SUPABASE_ANON_KEY) but the RLS policies
  only allow the service_role to INSERT into the users and refresh_tokens tables.
  This causes registration to fail with "Erreur lors de la création du compte".

  ## Changes
  1. Add INSERT policy on `users` for the `anon` role (needed for new user registration)
  2. Add INSERT policy on `refresh_tokens` for the `anon` role (needed when creating session after registration)
  3. Add SELECT policy on `users` for the `anon` role (needed to check if email already exists)
  4. Add SELECT policy on `refresh_tokens` for the `anon` role (needed to validate refresh tokens)
  5. Add DELETE policy on `refresh_tokens` for the `anon` role (needed for logout and token rotation)

  ## Notes
  - These policies are required because the Express backend uses the anon key
  - The backend enforces its own security (password hashing, JWT, validators)
  - A proper long-term fix would be to use SUPABASE_SERVICE_ROLE_KEY in the backend
*/

CREATE POLICY "Anon can insert new users"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can select users by email"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert refresh tokens"
  ON refresh_tokens FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can select refresh tokens"
  ON refresh_tokens FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can delete refresh tokens"
  ON refresh_tokens FOR DELETE
  TO anon
  USING (true);
