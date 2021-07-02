const express = require('express');
const router  = express.Router();
// Favorites API
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
  // User's Favorited Maps
  router.get("/:userID/:mapID", (req,res)=> {
    db.query(`SELECT * FROM favorites
              WHERE users_id = $1 AND maps_id = $2`,[req.params.userID,req.params.mapID])
      .then(data => {
        res.json(data.rows);
      });

  });
  // User unfavorites a map, delete row
  router.post("/delete", (req,res)=> {
    const {mapID} = req.body;
    const user = req.session.user_id;
    db.query(`DELETE FROM favorites
    WHERE users_id = $1 AND maps_id = $2`,[user,mapID])
      .then(res.json({ sucess : true }))
      .catch(e => console.log(e));
  });
  // User favorites a map, add row
  router.post("/", (req,res)=> {
    const {mapID} = req.body;
    const user = req.session.user_id;
    db.query(`INSERT INTO favorites (users_id, maps_id) VALUES ( $1, $2) `,[user, mapID])
      .then(res.json({ sucess : true }))
      .catch(console.log);
  });
  return router;
};
