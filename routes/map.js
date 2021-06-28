const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:map", (req, res) => {

    const mapID = req.params.map;

    db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
    .then((data => {
      const map = data.rows[0];
      const templateVars = {map};
      res.render('map', templateVars);
    }))
  });


  router.post("/new", (req, res) => {
    res.status(200).send(`ok`);
  });
  return router;

};



