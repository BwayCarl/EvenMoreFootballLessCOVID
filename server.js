// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var axios = require("axios");
var config = require("./config.js")
var db = require("./models");
//session and passport are required for authentication
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
var bodyParser = require('body-parser');
// var CircularJSON = require("circular-json")
require('dotenv').config();

// C:\Users\Manuel\EvenMoreFootballLessCOVID\config.js
// Create an instance of the express app.
var app = express();

app.use(express.static(path.join(__dirname,"/public")));
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

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.urlencoded({extended: true}))



// Set Handlebars as the default templating engine.
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// Require routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

app.get("/", function (req, res) {
  res.render("login.handlebars", {});
});



// app.get("/signup", function (req, res) {
//   res.render("signup.handlebars", {});
// });

app.get("/schedules", function (req, res) {
  console.log('getting schedule************')
  axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=6306de6ffce1432bae3dc370a38a8de3`)
    .then(function (response) {
      // handle success
      res.json(response.data)
    }).catch((err)=> res.json(err))
})

app.get("/teams", function (req, res) {
console.log('getting teams')
  axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=6306de6ffce1432bae3dc370a38a8de3`)
    .then(function (response) {
      // handle success
      res.json(response.data)
    }).catch(err => {      
      console.log(err)
      res.json(err)
    })
})

// app.get("/teaminfo", function (req, res) {

//     axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=6306de6ffce1432bae3dc370a38a8de3`)
//       .then(function (response) {
//         // handle success
//         console.log(response);
//         res.json(response)
//       })
//       .catch(function (error) {
//         // handle error
//         console.log(error);
//       })
//   })

  // app.get("/", function (req, res) {
  //       // Grab the selected parameter
  //       var chosen = req.params.selectedTeam;
  //       console.log(chosen);
  // })

  
// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});