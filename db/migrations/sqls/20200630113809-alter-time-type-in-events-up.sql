ALTER TABLE events ALTER COLUMN time TYPE TIMESTAMP WITH TIME ZONE USING time AT TIME ZONE 'UTC';