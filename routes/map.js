const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/new", (req, res) => {
    const userID = req.session.user_id;
    db.query(`SELECT * FROM users
            WHERE id = $1`, [userID])
      .then(data => {
        let user = '';
        if (data.rows.length > 0) {
          user = data.rows[0].name;
        }
        const templateVars = { user };
        return res.render("new_map", templateVars);
      });
  });

  router.post("/new", (req, res) => {
    console.log(req.body);
    res.status(200).send(`ok`);
  });

  router.get("/:map", (req, res) => {

    const mapID = req.params.map;

    db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
      .then((data => {
        const map = data.rows[0];
        const templateVars = {map};
        res.render('map', templateVars);
      }));
  });


  return router;

};



