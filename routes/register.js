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
//check if user already exists. Otherwise render register form.
module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    if (userID) {
      return res.redirect('/');
    }
    const user = userID;
    const templateVars = { user };
    db.query(`SELECT * FROM users;`)
      .then(
        res.render('urls_register', templateVars)
      )
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  // Validate user input, assign an ID, forward accordingly
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
            res.redirect('/maps')
          );

      });
  });
  return router;
};
