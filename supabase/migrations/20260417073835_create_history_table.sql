/*
  # Create history table

  ## Summary
  Adds a browsing history feature so authenticated users can see which movies and series they have previously visited.

  ## New Tables
  - `history`
    - `id` (uuid, primary key)
    - `user_id` (uuid, FK to users) — the user who visited the content
    - `content_type` (text) — either 'movie' or 'series'
    - `content_id` (uuid) — the id of the movie or series visited
    - `visited_at` (timestamptz) — timestamp of the last visit (updated on re-visit)

  ## Security
  - RLS enabled — only the owning user can read, insert, or delete their own history entries.
  - Unique constraint on (user_id, content_type, content_id) so each piece of content appears only once; re-visits update the timestamp via upsert.

  ## Notes
  1. The unique constraint allows efficient upsert (insert or update visited_at on conflict).
  2. No DELETE cascade is needed because user accounts use Supabase Auth which handles cleanup separately.
*/

CREATE TABLE IF NOT EXISTS history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'series')),
  content_id uuid NOT NULL,
  visited_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, content_type, content_id)
);

CREATE INDEX IF NOT EXISTS history_user_id_idx ON history (user_id);
CREATE INDEX IF NOT EXISTS history_visited_at_idx ON history (visited_at DESC);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own history"
  ON history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
  ON history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
