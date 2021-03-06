-- Drop and recreate comments table
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments (
id SERIAL PRIMARY KEY NOT NULL,
users_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
maps_id INTEGER REFERENCES maps(id) ON DELETE CASCADE NOT NULL,
text VARCHAR(255) NOT NULL,
date_created TIMESTAMP NOT NULL,
times_liked INTEGER DEFAULT 0
);
