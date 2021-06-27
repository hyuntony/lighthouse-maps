/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { generateRandomString } = require('../helpers/helperfunc');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.render('urls_register');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    const newUser = req.body;
    const randomId = generateRandomString();
    if (newUser.email === "" | newUser.password === "" | newUser.name === "") {
      return res.status(400).send("Email, name, or password is entered empty");
    }
    db.query(`SELECT email FROM users
              WHERE email = $1`, [newUser.email])
      .then(data => {
        if (data.rows.length > 0) {
          return res.status(400).send("Registered user with that email address already exists");
        } else {
          db.query(`INSERT INTO users (id, name, email, password)
                    VALUES ('${randomId}', $1, $2, $3)
                    RETURNING *`, [newUser.name, newUser.email, newUser.password])
            .then(res.render('index'));
        }
      });
  });
  return router;
};
