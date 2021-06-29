const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:map", (req, res) => {
    const userID = req.session.user_id;
    const mapID = req.params.map;
    db.query(`SELECT * FROM users
              WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
        .then((data => {
          const map = data.rows[0];
          console.log(map);
          const templateVars = { user, map };
          return res.render("map", templateVars);

        }))
      });

  });


  router.post("/new", (req, res) => {
    res.status(200).send(`ok`);
  });
  return router;

};



