/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM favorites`;
    console.log(query);
    db.query(query)
      .then(data => {
        const favorites = data.rows;
        res.json({ favorites });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req,res)=> {
    const {mapID} = req.body;
    const userID = req.session.user_id;
    console.log(`!!!!!!`, mapID, userID);
    db.query(`insert into favorites (users_id, maps_id) VALUES ($1, $2) `, [Number(userID), Number(mapID)])
    .then(res.send(`ok`))
    .catch(console.log)
  })

  return router;
};
