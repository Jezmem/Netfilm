/*
  # Fix RLS policies for favorites, watchlist and user_notes

  ## Problem
  The backend uses the anon key to connect to Supabase. A previous migration
  removed all anon policies on favorites, watchlist and user_notes, but the
  replacement migration only added back policies for users and refresh_tokens.
  This causes errors when adding favorites, watchlist items or notes because
  the anon role cannot INSERT, UPDATE or DELETE on those tables.

  ## Changes
  1. favorites - add SELECT, INSERT, DELETE for anon
  2. watchlist - add SELECT, INSERT, DELETE for anon
  3. user_notes - add SELECT, INSERT, UPDATE, DELETE for anon
*/

-- favorites
DROP POLICY IF EXISTS "Anon can select favorites" ON favorites;
DROP POLICY IF EXISTS "Anon can insert favorites" ON favorites;
DROP POLICY IF EXISTS "Anon can delete favorites" ON favorites;

CREATE POLICY "Anon can select favorites"
  ON favorites FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can insert favorites"
  ON favorites FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can delete favorites"
  ON favorites FOR DELETE TO anon USING (true);

-- watchlist
DROP POLICY IF EXISTS "Anon can select watchlist" ON watchlist;
DROP POLICY IF EXISTS "Anon can insert watchlist" ON watchlist;
DROP POLICY IF EXISTS "Anon can delete watchlist" ON watchlist;

CREATE POLICY "Anon can select watchlist"
  ON watchlist FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can insert watchlist"
  ON watchlist FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can delete watchlist"
  ON watchlist FOR DELETE TO anon USING (true);

-- user_notes
DROP POLICY IF EXISTS "Anon can select user_notes" ON user_notes;
DROP POLICY IF EXISTS "Anon can insert user_notes" ON user_notes;
DROP POLICY IF EXISTS "Anon can update user_notes" ON user_notes;
DROP POLICY IF EXISTS "Anon can delete user_notes" ON user_notes;

CREATE POLICY "Anon can select user_notes"
  ON user_notes FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can insert user_notes"
  ON user_notes FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can update user_notes"
  ON user_notes FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete user_notes"
  ON user_notes FOR DELETE TO anon USING (true);
