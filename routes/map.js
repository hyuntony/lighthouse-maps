const express = require('express');
const router  = express.Router();
const timeago = require('timeago.js');

// Get users data, forward to new map template
module.exports = (db) => {
  router.get("/new", (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      return res.redirect('/');
    }
    db.query(`SELECT * FROM users
            WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        const templateVars = { user, userID };
        return res.render("new_map", templateVars);
      });
  });

  // Get user data, new map data, forward to map points template
  router.get("/new/:map_id", (req, res) => {
    const userID = req.session.user_id;
    const mapID = req.params.map_id;
    if (!userID) {
      return res.redirect('/');
    }
    db.query(`SELECT * FROM users
    WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
          .then((data => {
            const map = data.rows[0];
            const templateVars = { userID, user, map };
            return res.render("new_map_points", templateVars);
          }));
      });
  });

  // Get user and map data, forward to edit map template
  router.get("/:map_id/edit", (req, res) => {
    const userID = req.session.user_id;
    const mapID = req.params.map_id;
    if (!userID) {
      return res.redirect('/');
    }
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
          .then((data => {
            const map = data.rows[0];
            const templateVars = { user, map, userID };
            return res.render("edit_map", templateVars);
          }));
      });
  });

  // Get user and map data, forward to map's final page
  router.get("/:map", (req, res) => {
    const userID = req.session.user_id;
    const mapID = req.params.map;
    db.query(`SELECT * FROM users
      WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
          .then((data => {
            const map = data.rows[0];
            const date = timeago.format(map.date_created);
            const templateVars = { user, map, userID, mapID, date };
            return res.render("map", templateVars);
          }));
      });
  });

  // Sets map's starting coordinates based on user input, forwards to map creation
  router.post("/new", (req, res) => {
    const userID = req.session.user_id;
    const { title, description, city } = req.body;
    let lat,lng;
    if (city === 'Toronto') {
      lat = 43.66711105167949;
      lng = -79.38703536987305;
    }
    if (city === 'Vancouver') {
      lat = 49.2066341452146;
      lng = -123.1024993211031;
    }
    db.query(`INSERT INTO maps (users_id, name, description, city, thumbnail_url, center_coords, zoom, date_created)
              VALUES ($1, $2, $3, $4, '/images/default_map.png', '{"lat": "${lat}", "lng": "${lng}"}', 13, NOW())
              RETURNING id`, [userID, title, description, city])
      .then(data => {
        return res.redirect(`/map/new/${data.rows[0].id}`);
      });
  });

  // Post new points to db
  router.post("/new/:map_id/points", (req, res) => {
    const mapID = req.params.map_id;
    const point = req.body;
    const lat = Number(point.lat);
    const lng = Number(point.lng);

    db.query(`INSERT INTO map_points (maps_id, name, description, coords)
    VALUES ($1, $2, $3, '{"lat": "${lat}", "lng": "${lng}" }')
    RETURNING id`, [mapID, point.name, point.description])
      .then(
        res.json({ success: true })
      );
  });

  // Update map coordinates and zoom
  router.post("/new/:map_id/update", (req, res) => {
    const map = req.body;
    const lat = Number(map.lat);
    const lng = Number(map.lng);
    const zoom = Number(map.zoom);
    db.query(`UPDATE maps
    SET center_coords = '{"lat": "${lat}", "lng": "${lng}"}', zoom = ${zoom}
    WHERE ID = ${map.mapID}`)
      .then(() => {
        return res.send(`/map/${map.mapID}`);
      });
  });

  // Update map name, description, coordinates and zoom
  router.post("/edit/update", (req, res) => {
    console.log(req.body);
    const map = req.body;
    const lat = Number(map.lat);
    const lng = Number(map.lng);
    const zoom = Number(map.zoom);
    db.query(`UPDATE maps
    SET center_coords = '{"lat": "${lat}", "lng": "${lng}"}',
    zoom = ${zoom},
    name = $1,
    description = $2
    WHERE id = ${map.map_id}`, [map.name, map.description])
      .then(() => {
        return res.send(`/map/${map.map_id}`);
      });
  });

  // Update point name and description
  router.post("/point/update", (req, res) => {
    const reqData = req.body;

    db.query(`UPDATE map_points
              SET name = $1, description = $2
              WHERE id = ${reqData.point_id}`, [reqData.name, reqData.description])
      .then(res.json({ success: true }));
  });

  // Delete point
  router.post("/point/delete", (req, res) => {
    const reqdata = req.body;

    db.query(`DELETE FROM map_points
              WHERE id = ${reqdata.point_id}`)
      .then(res.json({ success: true }));
  });

  // Gets user and map's data to redirect to map's edit page
  router.get("/:map_id/edit", (req, res) => {
    const userID = req.session.user_id;
    const mapID = req.params.map_id;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
          .then((data => {
            const map = data.rows[0];
            const templateVars = { user, map, userID };
            return res.render("edit_map", templateVars);
          }));
      });
  });

  // Delete map, dedirect back to user's profile
  router.post('/:map_id/delete', (req, res) => {
    const mapID = req.params.map_id;
    db.query(`DELETE FROM maps where maps.id = $1`, [mapID])
      .then(() => {
        res.redirect('/profile');
      });
  });

  return router;
};
