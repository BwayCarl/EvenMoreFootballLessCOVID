// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var axios = require("axios")
var config = require("./config.js")

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



app.get("/", function (req, res) {
  res.render("index", {});
});



app.get("/teaminfo", function (req, res) {

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


app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});