const express = require('express');
const router  = express.Router();
//maps API resource
module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM maps`;
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Get specific map
  router.get("/:map_id", (req, res) => {
    const mapID = req.params.map_id;
    db.query(`SELECT * FROM maps
              WHERE id = ${mapID}`)
      .then(data => {
        const map = data.rows;
        res.json({ map });
      });
  });

  // Get points for specific map
  router.get("/:map_id/points", (req, res) => {
    let query = `SELECT * FROM maps
    LEFT JOIN map_points on map_points.maps_id = maps.id
    WHERE maps.id = $1`;
    db.query(query,[req.params.map_id])
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
