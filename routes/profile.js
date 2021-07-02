/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const timeago = require('timeago.js');

module.exports = (db) => {
  let templateVars = {};
  router.get('/', (req, res) => {
    const userID = req.session.user_id;
    // const mapID = req.params.map;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        db.query(`SELECT maps.name as map_name, users_id, maps.id, users.name, maps.description, maps.city, maps.thumbnail_url, maps.date_created FROM maps JOIN users ON users.id = users_id WHERE users.id = $1`,[userID])
          .then(data => {
            const maps = data.rows;
            maps.forEach((map) => {
              map.date_created = timeago.format(map.date_created);
            });
            db.query(`SELECT maps.name, maps_id, maps.description, maps.city, maps.thumbnail_url, maps.description, maps.date_created
            FROM favorites JOIN users on users.id = users_id JOIN maps on maps.id = maps_id WHERE users.id = $1`, [userID])
            .then(data => {
              console.log(`great success`, data.rows);
              const favorites = data.rows;
              favorites.forEach((map) => {
                map.date_created = timeago.format(map.date_created);
              });
              templateVars =  {maps, user, userID, favorites }
              res.render('profile', templateVars);
            });

          })
          .catch(err => {
            console.log(`FAIL`);
            res
            .status(500)
            .json({ error: err.message });
          });
        });
      });
      return router;
    };



