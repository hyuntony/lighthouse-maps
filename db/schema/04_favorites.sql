-- Drop and recreate favorites table
DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
id SERIAL PRIMARY KEY NOT NULL,
users_id REFERENCES users(id) ON DELETE CASCADE NOT NULL,
maps_id REFERENCES maps(id) ON DELETE CASCADE NOT NULL
);
