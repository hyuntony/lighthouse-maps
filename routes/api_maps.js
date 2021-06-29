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
    let query = `SELECT * FROM maps`;
    console.log(query);
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

  router.get("/:map_id", (req, res) => {
    const mapID = req.params.map_id;
    db.query(`SELECT * FROM maps
              WHERE id = ${mapID}`)
      .then(data => {
        const map = data.rows;
        res.json({ map });
      });
  });

  router.get("/:map_id/points", (req, res) => {
    let query = `SELECT * FROM maps
    JOIN map_points on map_points.maps_id = maps.id
    WHERE maps.id = $1`;
    console.log(query);
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
