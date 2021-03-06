-- Drop and recreate maps table
DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE maps (
id SERIAL PRIMARY KEY NOT NULL,
users_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
description VARCHAR(500) NOT NULL,
city VARCHAR (255) NOT NULL,
thumbnail_url VARCHAR (255),
center_coords JSON NOT NULL,
zoom INTEGER NOT NULL,
times_liked INTEGER DEFAULT 0,
date_created TIMESTAMP NOT NULL
);

