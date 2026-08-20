-- ============================================================
-- Supabase Schema — זיכרון בחול (Sand Memorial)
-- Run this in your Supabase SQL editor to set up the database.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- sculptures
-- Stores each sand sculpture created by the artist.
-- ────────────────────────────────────────────────────────────
CREATE TABLE sculptures (
  id          BIGSERIAL    PRIMARY KEY,
  name        TEXT         NOT NULL,
  age         INTEGER      NOT NULL CHECK (age BETWEEN 1 AND 120),
  unit        TEXT         NOT NULL,
  date        TEXT         NOT NULL,        -- Display date, e.g. "אוקטובר 2023"
  story       TEXT         NOT NULL,
  image_url      TEXT,                      -- Supabase Storage public URL (legacy)
  instagram_url  TEXT,                      -- Optional link to original Instagram post
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- requests
-- Stores sculpture requests submitted by families via /request.
-- ────────────────────────────────────────────────────────────
CREATE TABLE requests (
  id              BIGSERIAL    PRIMARY KEY,
  requester_name  TEXT         NOT NULL,
  contact_info    TEXT         NOT NULL,
  fallen_name     TEXT         NOT NULL,
  story           TEXT         NOT NULL,
  status          TEXT         NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'in_progress', 'completed', 'handled')),
  submitted_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes for duplicate detection and status filtering (used by the dashboard)
CREATE INDEX idx_requests_fallen_name ON requests (fallen_name);
CREATE INDEX idx_requests_status      ON requests (status);

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
ALTER TABLE sculptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests   ENABLE ROW LEVEL SECURITY;

-- Public: anyone may read published sculptures (home page gallery)
CREATE POLICY "sculptures_public_read"
  ON sculptures FOR SELECT TO anon
  USING (true);

-- Public: families may submit new requests (the /request form)
CREATE POLICY "requests_public_insert"
  ON requests FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated (admin): full access to both tables
-- (used when the admin panel is migrated to Supabase Auth)
CREATE POLICY "sculptures_admin_all"
  ON sculptures FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "requests_admin_all"
  ON requests FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ============================================================
-- DEVELOPMENT OVERRIDE
-- The admin panel currently uses cookie-based auth (not Supabase
-- Auth), so the client always runs as the 'anon' role.
-- Run the block below in your Supabase SQL editor to grant the
-- anon role full table access during development.
--
-- !! REMOVE THESE POLICIES BEFORE GOING TO PRODUCTION !!
-- Replace them by integrating Supabase Auth for the admin panel,
-- at which point the 'authenticated' policies above take over.
-- ============================================================

CREATE POLICY "DEV_sculptures_anon_all"
  ON sculptures FOR ALL TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "DEV_requests_anon_all"
  ON requests FOR ALL TO anon
  USING (true) WITH CHECK (true);


-- ============================================================
-- sculpture_media
-- One row per media file attached to a sculpture.
-- Storage files live in the 'sculpture-media' bucket.
-- ============================================================

CREATE TABLE sculpture_media (
  id            BIGSERIAL    PRIMARY KEY,
  sculpture_id  BIGINT       NOT NULL REFERENCES sculptures(id) ON DELETE CASCADE,
  url           TEXT         NOT NULL,           -- Public Storage URL
  storage_path  TEXT         NOT NULL,           -- Path inside the bucket
  type          TEXT         NOT NULL CHECK (type IN ('image', 'video')),
  position      INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sculpture_media_sculpture_id ON sculpture_media (sculpture_id);

ALTER TABLE sculpture_media ENABLE ROW LEVEL SECURITY;

-- Public: anyone may read media (gallery)
CREATE POLICY "sculpture_media_public_read"
  ON sculpture_media FOR SELECT TO anon
  USING (true);

-- Authenticated (admin): full access
CREATE POLICY "sculpture_media_admin_all"
  ON sculpture_media FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- DEV: anon full access (remove before production)
CREATE POLICY "DEV_sculpture_media_anon_all"
  ON sculpture_media FOR ALL TO anon
  USING (true) WITH CHECK (true);


-- ============================================================
-- Storage — sculpture-media bucket
-- Run these statements AFTER creating the bucket in the
-- Supabase dashboard (Storage → New bucket → "sculpture-media",
-- toggle Public ON).
-- ============================================================

-- Allow public read of all objects in the bucket
CREATE POLICY "storage_sculpture_media_public_read"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'sculpture-media');

-- Allow anon upload (admin panel uses cookie auth, not Supabase Auth)
-- !! Restrict to authenticated role before going to production !!
CREATE POLICY "DEV_storage_sculpture_media_anon_insert"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'sculpture-media');

-- Allow anon delete
CREATE POLICY "DEV_storage_sculpture_media_anon_delete"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'sculpture-media');
