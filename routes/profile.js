const express = require('express');
const router  = express.Router();
const timeago = require('timeago.js');

// Check for user, render profile if they exist
module.exports = (db) => {
  let templateVars = {};
  router.get('/', (req, res) => {
    const userID = req.session.user_id;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        // Render user's maps
        db.query(`SELECT maps.name as map_name, users_id, maps.id, users.name, maps.description, maps.city, maps.thumbnail_url, maps.date_created FROM maps JOIN users ON users.id = users_id WHERE users.id = $1
        ORDER BY maps.date_created desc`,[userID])
          .then(data => {
            const maps = data.rows;
            maps.forEach((map) => {
              map.date_created = timeago.format(map.date_created);
            });
            // Render user's favorites
            db.query(`SELECT maps.name, maps_id, maps.description, maps.city, maps.thumbnail_url, maps.description, maps.date_created
            FROM favorites JOIN users on users.id = users_id JOIN maps on maps.id = maps_id WHERE users.id = $1
            ORDER BY maps.date_created desc`, [userID])
              .then(data => {
                const favorites = data.rows;
                favorites.forEach((map) => {
                  map.date_created = timeago.format(map.date_created);
                });
                templateVars =  {maps, user, userID, favorites };
                res.render('profile', templateVars);
              });
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      });
  });
  return router;
};



