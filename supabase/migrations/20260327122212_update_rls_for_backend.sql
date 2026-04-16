/*
  # Update RLS Policies for Express Backend

  ## Overview
  Updates RLS policies to allow the anon role to perform all operations.
  The Express backend manages authentication at the application level using JWT,
  so Supabase RLS is relaxed for anon role (backend uses anon key).

  ## Changes
  - Allow anon role full CRUD on users, favorites, watchlist, user_notes, refresh_tokens
  - Keep public read access for movies, series, categories
*/

-- Users - allow anon full access (backend manages auth)
CREATE POLICY "Anon full access on users select"
  ON users FOR SELECT TO anon USING (true);

CREATE POLICY "Anon full access on users insert"
  ON users FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon full access on users update"
  ON users FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon full access on users delete"
  ON users FOR DELETE TO anon USING (true);

-- Favorites - allow anon full access
CREATE POLICY "Anon full access on favorites select"
  ON favorites FOR SELECT TO anon USING (true);

CREATE POLICY "Anon full access on favorites insert"
  ON favorites FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon full access on favorites delete"
  ON favorites FOR DELETE TO anon USING (true);

-- Watchlist - allow anon full access
CREATE POLICY "Anon full access on watchlist select"
  ON watchlist FOR SELECT TO anon USING (true);

CREATE POLICY "Anon full access on watchlist insert"
  ON watchlist FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon full access on watchlist delete"
  ON watchlist FOR DELETE TO anon USING (true);

-- User notes - allow anon full access
CREATE POLICY "Anon full access on user_notes insert"
  ON user_notes FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon full access on user_notes update"
  ON user_notes FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon full access on user_notes delete"
  ON user_notes FOR DELETE TO anon USING (true);

-- Refresh tokens - allow anon full access
CREATE POLICY "Anon full access on refresh_tokens select"
  ON refresh_tokens FOR SELECT TO anon USING (true);

CREATE POLICY "Anon full access on refresh_tokens insert"
  ON refresh_tokens FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon full access on refresh_tokens delete"
  ON refresh_tokens FOR DELETE TO anon USING (true);

-- Movies admin operations
CREATE POLICY "Anon insert movies"
  ON movies FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update movies"
  ON movies FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete movies"
  ON movies FOR DELETE TO anon USING (true);

-- Series admin operations
CREATE POLICY "Anon insert series"
  ON series FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update series"
  ON series FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete series"
  ON series FOR DELETE TO anon USING (true);

-- Categories admin operations
CREATE POLICY "Anon insert categories"
  ON categories FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update categories"
  ON categories FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete categories"
  ON categories FOR DELETE TO anon USING (true);
