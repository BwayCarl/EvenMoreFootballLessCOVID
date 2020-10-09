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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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