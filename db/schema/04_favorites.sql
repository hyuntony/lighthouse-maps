-- Drop and recreate favorites table
DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
id SERIAL PRIMARY KEY NOT NULL,
users_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
maps_id VARCHAR(255) REFERENCES maps(id) ON DELETE CASCADE NOT NULL
);
