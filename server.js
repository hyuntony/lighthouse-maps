// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const bcrypt     = require('bcrypt');
const cookieSession = require('cookie-session');

// cookie-session settings
app.use(cookieSession({
  name: 'session',
  keys: [ 'key1', 'key2' ],
  maxAge: 24 * 60 * 60 * 1000
}));

// Bcrypt variables
const saltRounds = 10;

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// helper functions
const { generateRandomString } = require('./helpers/helperfunc');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const api_mapsRoutes = require("./routes/api_maps");
const mapsRoutes = require("./routes/maps");
const mapRoutes = require("./routes/map");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/login", loginRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/api/maps", api_mapsRoutes(db));
app.use("/maps", mapsRoutes(db));
app.use('/map', mapRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    db.query(`SELECT * FROM users
    WHERE id = $1`, [userID])
      .then(data => {
        const user = data.rows[0].name;
        const templateVars = { user };
        return res.render("index", templateVars);
      });
  } else {
    const user = "";
    const templateVars = { user };
    return res.render("index", templateVars);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
