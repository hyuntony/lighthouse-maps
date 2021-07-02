const express = require('express');
const router  = express.Router();
// Users API
module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  // Easter Egg Route
  router.get("/hello", (req, res) => {
    res.json({hello: 'world'});
  });
  return router;
};
