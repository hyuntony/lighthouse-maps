--map table seeds here (Example)

INSERT INTO maps (
  id,
  users_id,
  name,
  description,
  city,
  thumbnail_url,
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
  '/images/default_map.png',
  '{"lat": "43.65466545346492", "lng": "-79.38810835706505"}',
  4,
  NOW()
),
(
  2,
  '2',
  'Scenic walk',
  'A nice quiet walk through high park',
  'Toronto',
  '/images/default_map.png',
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
  '/images/default_map.png',
  '{"lat": "43.66508594101991", "lng": "-79.4115507922296"}',
  4,
  NOW()
);




