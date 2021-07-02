const express = require('express');
const router  = express.Router();
const timeago = require('timeago.js');

// Check for user (display info or nay), render all maps
module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        let query = `SELECT * FROM maps
        ORDER BY date_created desc`;
        db.query(query)
          .then(data => {
            const maps = data.rows;
            maps.forEach((map) => {
              map.date_created = timeago.format(map.date_created);
            });
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


