/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:profile", (req, res) => {
    console.log(`**************`);
    const userID = req.session.user_id;
    const mapID = req.params.map;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        //console.log(`!!!!!!`, data.rows);
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name
        }
        let query = `SELECT * FROM maps JOIN users ON users.id = users_id WHERE users.id = ${userID}`
        console.log(userID)
        db.query(`SELECT users_id, maps.id, users.name, maps.description, maps.city, maps.thumbnail_url FROM maps JOIN users ON users.id = users_id WHERE users.id = $1`,[userID])
          .then(data => {
            console.log(`!!!!!!`, data.rows);

            const maps = data.rows;
            const templateVars = {maps, user, userID};
            console.log(`MAPS`,maps);
            res.render('profile', templateVars)
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
