/*
  # Netfilm Database Schema

  ## Overview
  Complete schema for the Netfilm platform - a movie and series discovery application.

  ## Tables Created

  ### 1. users
  - Core user accounts with role-based access (user/admin)
  - Stores hashed passwords, avatar URLs, and timestamps
  - Note: Authentication is managed by Express JWT, not Supabase Auth

  ### 2. categories
  - Content categories (Action, Drama, Comedy, etc.)

  ### 3. movies
  - Movie catalog with ratings, descriptions, images
  - Linked to a category via foreign key

  ### 4. series
  - TV series catalog with same structure as movies

  ### 5. favorites
  - User favorites for both movies and series
  - Unique constraint prevents duplicate favorites

  ### 6. watchlist
  - User watchlist for both movies and series
  - Unique constraint prevents duplicate entries

  ### 7. user_notes
  - User ratings (1-5) and comments for content
  - Unique constraint: one note per user per content item

  ## Security
  - RLS enabled on all tables
  - Service role can perform all operations (backend uses service role key)
  - Users can read public data, write only their own private data

  ## Notes
  - Backend Express server uses service role key to bypass RLS for admin ops
  - All authentication logic is handled by Express/JWT
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  email text UNIQUE NOT NULL,
  mot_de_passe_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar text DEFAULT NULL,
  date_creation timestamptz DEFAULT now(),
  date_modification timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on users"
  ON users FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role insert users"
  ON users FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update users"
  ON users FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role delete users"
  ON users FOR DELETE
  TO service_role
  USING (true);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  description text DEFAULT '',
  date_creation timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

CREATE POLICY "Service role insert categories"
  ON categories FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update categories"
  ON categories FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role delete categories"
  ON categories FOR DELETE
  TO service_role
  USING (true);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text DEFAULT '',
  date_sortie date,
  note decimal(2,1) DEFAULT 0.0 CHECK (note >= 0 AND note <= 10),
  image text DEFAULT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  date_creation timestamptz DEFAULT now()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read movies"
  ON movies FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

CREATE POLICY "Service role insert movies"
  ON movies FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update movies"
  ON movies FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role delete movies"
  ON movies FOR DELETE
  TO service_role
  USING (true);

-- Series table
CREATE TABLE IF NOT EXISTS series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text DEFAULT '',
  date_sortie date,
  note decimal(2,1) DEFAULT 0.0 CHECK (note >= 0 AND note <= 10),
  image text DEFAULT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  date_creation timestamptz DEFAULT now()
);

ALTER TABLE series ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read series"
  ON series FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

CREATE POLICY "Service role insert series"
  ON series FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update series"
  ON series FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role delete series"
  ON series FOR DELETE
  TO service_role
  USING (true);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'series')),
  content_id uuid NOT NULL,
  date_ajout timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on favorites select"
  ON favorites FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role full access on favorites insert"
  ON favorites FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role full access on favorites delete"
  ON favorites FOR DELETE
  TO service_role
  USING (true);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'series')),
  content_id uuid NOT NULL,
  date_ajout timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on watchlist select"
  ON watchlist FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role full access on watchlist insert"
  ON watchlist FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role full access on watchlist delete"
  ON watchlist FOR DELETE
  TO service_role
  USING (true);

-- User notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'series')),
  content_id uuid NOT NULL,
  note int NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire text DEFAULT '',
  date_creation timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read user notes"
  ON user_notes FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

CREATE POLICY "Service role insert user notes"
  ON user_notes FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update user notes"
  ON user_notes FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role delete user notes"
  ON user_notes FOR DELETE
  TO service_role
  USING (true);

-- Refresh tokens table for JWT management
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  date_creation timestamptz DEFAULT now()
);

ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on refresh_tokens select"
  ON refresh_tokens FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role full access on refresh_tokens insert"
  ON refresh_tokens FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role full access on refresh_tokens delete"
  ON refresh_tokens FOR DELETE
  TO service_role
  USING (true);
