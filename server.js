// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var axios = require("axios")
// var config = require("config.js")
const db = require("./models/user");
//session and passport are required for authentication
var session = require("express-session");
var passport = require("passport");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// C:\Users\Manuel\EvenMoreFootballLessCOVID\config.js
// Create an instance of the express app.
var app = express();

app.use(express.static(path.join(__dirname, "assets")));
// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;
// We need to use sessions to keep track of our user's login status
app.use(session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set Handlebars as the default templating engine.
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");



app.get("/", function (req, res) {
  res.render("index", {});
});

// app.get("/teams", function (req, res) {
//   res.render("index", ...[1]);
// });


app.get("/teaminfo", function (req, res) {

    axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=6306de6ffce1432bae3dc370a38a8de3`)
      .then(function (response) {
        // handle success
        console.log(response);
        res.json(response)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  })

  // app.get("/", function (req, res) {
  //       // Grab the selected parameter
  //       var chosen = req.params.selectedTeam;
  //       console.log(chosen);
  // })

  
// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
});