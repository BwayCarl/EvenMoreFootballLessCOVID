
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var axios = require("axios")
var config = require("config.js")

// Create an instance of the express app.
var app = express();

app.use(express.static(path.join(__dirname, "assets")));
// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Set Handlebars as the default templating engine.
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// Data

app.get("/", function (req, res) {
  res.render("index", {});
});

// app.get("/teams", function (req, res) {
//   res.render("index", ...[1]);
// });

const express = require("express");
const exphbs = require("express-handlebars");
const db = require("./models/user");

const axios = require('axios');



var PORT = process.env.PORT || 8080;
var app = express();

// Static directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);


app.get("/teaminfo", function(req, res){

  axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=${config.apikey1}`)
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


// app.get("/", function (req, res) {
//   res.render("all-games", {

//   });
// });

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

// Routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);


// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

// Team news api call
app.get('/teaminfo', function(req, res){
  axios.get('/userID=12345')
  .then(function(response){
    // handle sucess
    res.json(response);
    console.log(response);
  }
  )
  .catch(function (error){
    // handle error
    console.log(error)
  })
})

// League news API Call

// Game Vegas money line api call

