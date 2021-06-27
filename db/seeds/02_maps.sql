--map table seeds here (Example)

INSERT INTO maps (
  id,
  users_id,
  name,
  description,
  city,
  center_coords,
  zoom,
  date_created
  )

VALUES (
  1,
  '1',
  'Pub Crawls',
  'This is the best pub crawl the world has ever seen!',
  'Toronto',
  '{"lat": "43", "lng": "79"}',
  4,
  NOW()
),
(
  2,
  '2',
  'Scenic walk',
  'A nice quiet walk through high park',
  'Toronto',
  '{"lat": "43.64913395525846", "lng": "-79.4679562680143"}',
  7,
  NOW()
),
(
  3,
  '3',
  'Scenes from Scott Pilgrim',
  'Best scenes from the best movie!',
  'Toronto',
  '{"lat": "43.66508594101991", "lng": "-79.4115507922296"}',
  4,
  NOW()
);




