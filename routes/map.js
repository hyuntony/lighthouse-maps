const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/new", (req, res) => {
    const userID = req.session.user_id;
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

  router.get("/new/:map_id", (req, res) => {
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
            const templateVars = { userID, user, map };
            console.log(templateVars);
            return res.render("new_map_points", templateVars);
          }));
      });
  });


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
          console.log(map);
          const templateVars = { user, map, userID, mapID };
          return res.render("map", templateVars);

          }));
      });

  });


  return router;
};
