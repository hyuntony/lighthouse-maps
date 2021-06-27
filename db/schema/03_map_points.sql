-- Drop and recreate map_points table
DROP TABLE IF EXISTS map_points CASCADE;

CREATE TABLE map_points (
id SERIAL PRIMARY KEY NOT NULL,
maps_id REFERENCES maps(id) ON DELETE CASCADE NOT NULL,
name VARCHAR (255) NOT NULL,
description VARCHAR(500) NOT NULL,
image_url VARCHAR(255),
coords JSON NOT NULL
)
