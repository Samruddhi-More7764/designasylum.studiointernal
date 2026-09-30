-- Additive only. Safe to run more than once.
-- Does not delete rows, media files, or existing image foreign keys.
-- Run on local and production while PAYLOAD_PUSH=false, before the new
-- case-study layout code serves traffic.
--
-- Existing case studies stay "full" (one media). Split columns start empty.
-- Testimonials designation is nullable; existing names and quotes stay.

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS designation varchar;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_case_studies_hero_layout') THEN
    CREATE TYPE "public"."enum_case_studies_hero_layout" AS ENUM ('full', 'split');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_case_studies_gallery_layout') THEN
    CREATE TYPE "public"."enum_case_studies_gallery_layout" AS ENUM ('full', 'split');
  END IF;
END $$;

ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS hero_layout "public"."enum_case_studies_hero_layout" NOT NULL DEFAULT 'full';

ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS hero_left_image_id integer,
  ADD COLUMN IF NOT EXISTS hero_left_alt varchar,
  ADD COLUMN IF NOT EXISTS hero_right_image_id integer,
  ADD COLUMN IF NOT EXISTS hero_right_alt varchar;

-- Complete media can be omitted when a slot is two columns. Existing files stay.
ALTER TABLE case_studies ALTER COLUMN hero_image_image_id DROP NOT NULL;
ALTER TABLE case_studies ALTER COLUMN hero_image_alt DROP NOT NULL;

ALTER TABLE case_studies_gallery
  ADD COLUMN IF NOT EXISTS layout "public"."enum_case_studies_gallery_layout" NOT NULL DEFAULT 'full';

ALTER TABLE case_studies_gallery
  ADD COLUMN IF NOT EXISTS left_image_id integer,
  ADD COLUMN IF NOT EXISTS left_alt varchar,
  ADD COLUMN IF NOT EXISTS right_image_id integer,
  ADD COLUMN IF NOT EXISTS right_alt varchar;

ALTER TABLE case_studies_gallery ALTER COLUMN image_id DROP NOT NULL;
ALTER TABLE case_studies_gallery ALTER COLUMN alt DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'case_studies_hero_left_image_id_media_id_fk'
  ) THEN
    ALTER TABLE case_studies
      ADD CONSTRAINT case_studies_hero_left_image_id_media_id_fk
      FOREIGN KEY (hero_left_image_id) REFERENCES media(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'case_studies_hero_right_image_id_media_id_fk'
  ) THEN
    ALTER TABLE case_studies
      ADD CONSTRAINT case_studies_hero_right_image_id_media_id_fk
      FOREIGN KEY (hero_right_image_id) REFERENCES media(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'case_studies_gallery_left_image_id_media_id_fk'
  ) THEN
    ALTER TABLE case_studies_gallery
      ADD CONSTRAINT case_studies_gallery_left_image_id_media_id_fk
      FOREIGN KEY (left_image_id) REFERENCES media(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'case_studies_gallery_right_image_id_media_id_fk'
  ) THEN
    ALTER TABLE case_studies_gallery
      ADD CONSTRAINT case_studies_gallery_right_image_id_media_id_fk
      FOREIGN KEY (right_image_id) REFERENCES media(id) ON DELETE SET NULL;
  END IF;
END $$;
