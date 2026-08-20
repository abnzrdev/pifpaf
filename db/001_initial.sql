CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  shortcode TEXT NOT NULL,
  caption TEXT,
  cover_url TEXT,
  published_at TIMESTAMPTZ,
  duration_seconds DOUBLE PRECISION CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  views BIGINT CHECK (views IS NULL OR views >= 0),
  likes BIGINT CHECK (likes IS NULL OR likes >= 0),
  comments BIGINT CHECK (comments IS NULL OR comments >= 0),
  shares BIGINT CHECK (shares IS NULL OR shares >= 0),
  raw_json JSONB NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, shortcode)
);

CREATE INDEX IF NOT EXISTS reels_user_created_idx ON reels (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reels_user_synced_idx ON reels (user_id, last_synced_at);
