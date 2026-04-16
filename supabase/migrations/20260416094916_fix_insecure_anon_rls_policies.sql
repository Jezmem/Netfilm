/*
  # Fix insecure RLS policies - remove unrestricted anon access

  ## Overview
  Removes all RLS policies that granted unrestricted (always-true) access to the
  `anon` role on every table. These policies effectively bypassed row-level security
  and allowed any unauthenticated request to insert, update, or delete any data.

  ## Root cause
  The Express backend was configured with the anon key instead of the service_role key,
  so a second migration had to grant anon full access to compensate. The server config
  has now been corrected to use the service_role key, which already has its own
  unrestricted policies defined in the first migration.

  ## Changes

  ### Policies dropped (all were `USING (true)` / `WITH CHECK (true)` for anon role)

  #### categories
  - DROP "Anon insert categories"
  - DROP "Anon update categories"
  - DROP "Anon delete categories"

  #### movies
  - DROP "Anon insert movies"
  - DROP "Anon update movies"
  - DROP "Anon delete movies"

  #### series
  - DROP "Anon insert series"
  - DROP "Anon update series"
  - DROP "Anon delete series"

  #### users
  - DROP "Anon full access on users insert"
  - DROP "Anon full access on users update"
  - DROP "Anon full access on users delete"
  - DROP "Anon full access on users select"

  #### favorites
  - DROP "Anon full access on favorites insert"
  - DROP "Anon full access on favorites delete"
  - DROP "Anon full access on favorites select"

  #### watchlist
  - DROP "Anon full access on watchlist insert"
  - DROP "Anon full access on watchlist delete"
  - DROP "Anon full access on watchlist select"

  #### user_notes
  - DROP "Anon full access on user_notes insert"
  - DROP "Anon full access on user_notes update"
  - DROP "Anon full access on user_notes delete"

  #### refresh_tokens
  - DROP "Anon full access on refresh_tokens insert"
  - DROP "Anon full access on refresh_tokens delete"
  - DROP "Anon full access on refresh_tokens select"

  ## Security notes
  - The service_role policies from migration 1 remain intact and are sufficient
    for the backend server to operate.
  - Public SELECT on movies, series, categories is preserved via the existing
    "Public can read ..." policies which include the anon role for reads only.
  - No user data is exposed to unauthenticated callers after this migration.
*/

-- categories: drop insecure anon write policies
DROP POLICY IF EXISTS "Anon insert categories" ON categories;
DROP POLICY IF EXISTS "Anon update categories" ON categories;
DROP POLICY IF EXISTS "Anon delete categories" ON categories;

-- movies: drop insecure anon write policies
DROP POLICY IF EXISTS "Anon insert movies" ON movies;
DROP POLICY IF EXISTS "Anon update movies" ON movies;
DROP POLICY IF EXISTS "Anon delete movies" ON movies;

-- series: drop insecure anon write policies
DROP POLICY IF EXISTS "Anon insert series" ON series;
DROP POLICY IF EXISTS "Anon update series" ON series;
DROP POLICY IF EXISTS "Anon delete series" ON series;

-- users: drop all insecure anon policies
DROP POLICY IF EXISTS "Anon full access on users select" ON users;
DROP POLICY IF EXISTS "Anon full access on users insert" ON users;
DROP POLICY IF EXISTS "Anon full access on users update" ON users;
DROP POLICY IF EXISTS "Anon full access on users delete" ON users;

-- favorites: drop all insecure anon policies
DROP POLICY IF EXISTS "Anon full access on favorites select" ON favorites;
DROP POLICY IF EXISTS "Anon full access on favorites insert" ON favorites;
DROP POLICY IF EXISTS "Anon full access on favorites delete" ON favorites;

-- watchlist: drop all insecure anon policies
DROP POLICY IF EXISTS "Anon full access on watchlist select" ON watchlist;
DROP POLICY IF EXISTS "Anon full access on watchlist insert" ON watchlist;
DROP POLICY IF EXISTS "Anon full access on watchlist delete" ON watchlist;

-- user_notes: drop all insecure anon policies
DROP POLICY IF EXISTS "Anon full access on user_notes insert" ON user_notes;
DROP POLICY IF EXISTS "Anon full access on user_notes update" ON user_notes;
DROP POLICY IF EXISTS "Anon full access on user_notes delete" ON user_notes;

-- refresh_tokens: drop all insecure anon policies
DROP POLICY IF EXISTS "Anon full access on refresh_tokens select" ON refresh_tokens;
DROP POLICY IF EXISTS "Anon full access on refresh_tokens insert" ON refresh_tokens;
DROP POLICY IF EXISTS "Anon full access on refresh_tokens delete" ON refresh_tokens;
