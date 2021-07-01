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
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    //const mapID = req.params.map;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        let query = `SELECT * FROM maps`;
        db.query(query)
          .then(data => {
            const maps = data.rows;
            maps.forEach((map) => {
              map.date_created = timeago.format(map.date_created);
            })
            const templateVars = {maps, user, userID};
            res.render('maps', templateVars);
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


