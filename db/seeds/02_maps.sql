--map table seeds here (Example)

INSERT INTO maps (
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
  '1',
  'Secret Bars',
  'Join me in a walk around downtown Toronto for some great secret gems!',
  'Toronto',
  '/images/default_map.png',
  '{"lat": "43.65511465680141", "lng": "-79.40334586193786"}',
  16,
  NOW()
),
(
  '2',
  'Scenic walk',
  'A nice quiet walk through high park',
  'Toronto',
  '/images/default_map.png',
  '{"lat": "43.64913395525846", "lng": "-79.4679562680143"}',
  13,
  NOW()
),
(
  '3',
  'Scenes from Scott Pilgrim',
  'Best scenes from the best movie!',
  'Toronto',
  '/images/default_map.png',
  '{"lat": "43.66508594101991", "lng": "-79.4115507922296"}',
  13,
  NOW()
);




