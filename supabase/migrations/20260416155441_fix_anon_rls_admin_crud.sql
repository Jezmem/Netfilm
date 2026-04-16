/*
  # Fix RLS policies for admin CRUD on movies, series and categories

  ## Problem
  The backend uses the anon key to connect to Supabase. A previous migration
  removed all anon write policies on movies, series and categories. Since the
  Express backend enforces admin role via JWT middleware (requireAdmin), these
  write operations must also be allowed for the anon role at the database level.

  ## Changes
  1. movies - add INSERT, UPDATE, DELETE for anon
  2. series - add INSERT, UPDATE, DELETE for anon
  3. categories - add INSERT, UPDATE, DELETE for anon
*/

-- movies
DROP POLICY IF EXISTS "Anon insert movies" ON movies;
DROP POLICY IF EXISTS "Anon update movies" ON movies;
DROP POLICY IF EXISTS "Anon delete movies" ON movies;

CREATE POLICY "Anon insert movies"
  ON movies FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update movies"
  ON movies FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete movies"
  ON movies FOR DELETE TO anon USING (true);

-- series
DROP POLICY IF EXISTS "Anon insert series" ON series;
DROP POLICY IF EXISTS "Anon update series" ON series;
DROP POLICY IF EXISTS "Anon delete series" ON series;

CREATE POLICY "Anon insert series"
  ON series FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update series"
  ON series FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete series"
  ON series FOR DELETE TO anon USING (true);

-- categories
DROP POLICY IF EXISTS "Anon insert categories" ON categories;
DROP POLICY IF EXISTS "Anon update categories" ON categories;
DROP POLICY IF EXISTS "Anon delete categories" ON categories;

CREATE POLICY "Anon insert categories"
  ON categories FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update categories"
  ON categories FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete categories"
  ON categories FOR DELETE TO anon USING (true);
