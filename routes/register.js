/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { generateRandomString } = require('../helpers/helperfunc');
const router  = express.Router();
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');


// cookie-session settings
router.use(cookieSession({
  name: 'session',
  keys: [ 'key1', 'key2' ],
  maxAge: 24 * 60 * 60 * 1000
}));

// Bcrypt variables
const saltRounds = 10;

module.exports = (db) => {
  router.get("/", (req, res) => {
    // const userID = req.session.user_id;
    // if (userID) {
    //   return res.redirect('/');
    // }
    db.query(`SELECT * FROM users;`)
      .then(
        res.render('urls_register')
      )
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
        }
        db.query(`INSERT INTO users (id, name, email, password)
                  VALUES ('${randomId}', $1, $2, $3)`, [newUser.name, newUser.email, bcrypt.hashSync(newUser.password, saltRounds)])
          .then(
            req.session['user_id'] = randomId,
            res.render('index')
          );

      });
  });
  return router;
};
