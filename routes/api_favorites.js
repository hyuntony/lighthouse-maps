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

  router.get("/:userID/:mapID", (req,res)=> {
    db.query(`SELECT * FROM favorites
              WHERE users_id = $1 AND maps_id = $2`,[req.params.userID,req.params.mapID])
      .then(data => {
        res.json(data.rows);
      });

  });

  router.post("/delete", (req,res)=> {
    const map = req.body;
    const user = req.session.user_id;
    db.query(`DELETE FROM favorites
    WHERE users_id = $1 AND maps_id = $2`,[user,map])
      .then(res.json({ sucess : true }))
      .catch(console.log);
  });

  router.post("/", (req,res)=> {
    const {mapID} = req.body;
    const userID = req.session.user_id;
    db.query(`INSERT INTO favorites (users_id, maps_id) VALUES ( $1, $2) `,[userID, mapID])
      .then(res.json({ sucess : true }))
      .catch(console.log);
  });



  return router;
};
