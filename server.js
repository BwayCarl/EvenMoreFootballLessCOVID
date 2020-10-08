// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");

// Create an instance of the express app.
var app = express();
console.log(path.join(__dirname, '/Assets'));
app.use(express.static(path.join(__dirname, '/Assets')));
// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Data


// Routes
app.get("/", function (req, res) {
  res.render("index", {});
});

// app.get("/", function (req, res) {
//   res.render("index", ...[1]);
// });

// app.get("/", function (req, res) {
//   res.render("all-games", {

//   });
// });

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});