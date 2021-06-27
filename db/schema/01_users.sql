-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_pic_url VARCHAR(255)
);
