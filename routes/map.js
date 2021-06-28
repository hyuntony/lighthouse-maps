const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:map", (req, res) => {
                const userID = req.session.user_id;
              if (userID) {




                db.query(`SELECT * FROM users
                WHERE id = $1`, [userID])
                  .then(data => {
                    const user = data.rows[0].name;


                    const templateVars = { user };
                    return res.render("map", templateVars);
                  });
              } else {
                const user = "";
                const templateVars = { user };
                return res.render("map", templateVars);
              }
    const mapID = req.params.map;

    db.query(`SELECT * FROM maps WHERE id = $1 `, [mapID])
    .then((data => {
      const map = data.rows[0];
      const templateVars = {map};
      console.log(map);
      res.render('map', templateVars);
    }))
  });


  router.post("/new", (req, res) => {
    res.status(200).send(`ok`);
  });
  return router;

};



