-- Additive only. Safe to run more than once.
-- Adds an optional logo under the case-study quote.
-- Existing rows stay NULL and keep the current circular mark.
-- Does not change quotes, detail rows, or any media already stored.

ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS details_logo_id integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'case_studies_details_logo_id_media_id_fk'
  ) THEN
    ALTER TABLE case_studies
      ADD CONSTRAINT case_studies_details_logo_id_media_id_fk
      FOREIGN KEY (details_logo_id) REFERENCES media(id) ON DELETE SET NULL;
  END IF;
END $$;
