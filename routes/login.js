/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');

// cookie-session settings
router.use(cookieSession({
  name: 'session',
  keys: [ 'key1', 'key2' ],
  maxAge: 24 * 60 * 60 * 1000
}));

module.exports = (db) => {
  router.get("/", (req, res) => {
    // const userID = req.session.user_id;
    // if (userID) {
    //   return res.redirect('/');
    // }
    db.query(`SELECT * FROM users;`)
      .then(
        res.render('urls_login')
      )
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    const loginAttempt = req.body;
    console.log(loginAttempt);
  });
  router.post("/logout", (req, res) => {
    req.session['user_id'] = null;
    return res.redirect('/');
  });
  return router;
};
