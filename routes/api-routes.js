// $.ajax({
//     url: 'https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/sf?key=f7876577a76b4ae49e69a47f4dcdcdff',
//     method: "GET"
// }).then(function(response) {
//     let newsArray = [];
//     for (i=0; i<response.length; i++) 
//     {
//         let title = response[i].Title;
//         let content = response[i].Content;
//         newsArray.push({title,content});
//     }
// })
// console.log(newsArray);
var axios = require('axios');
var express = require('express');
var db = require("../models");
var passport = require("../config/passport");
var app = express();

app.get('/teamNewsArticle', function(req, res){
    var team = 'sf';
    axios.get('https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/' + team + '?key=f7876577a76b4ae49e69a47f4dcdcdff')
    .then(function(response){
        // handle response
        var obj = JSON.parse(response);
        console.log(obj);
        
    }).catch(function(error){
        // handle error
        console.log(error)
    })
})

//  function teamNews(team) {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (this.readyState === 4 && this.status == 200) {
//             const obj = (JSON.parse(xhttp.responseText));
//             for (i = 0; i < obj.length; i++) {
//                 const title = obj[i].Title;
//                 const content = obj[i].Content;
//                 document.getElementById('title').innerHTML = title;
//                 document.getElementById('news').innerHTML = content;
//             }

//         }
//     };
//     xhttp.open('GET', 'https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/' + team + '?key=f7876577a76b4ae49e69a47f4dcdcdff', true);
//     xhttp.send();

// }
// function leagueNews() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (this.readyState === 4 && this.status == 200) {
//             const obj = JSON.parse(xhttp.responseText);
//             console.log(obj)
//             for (i = 0; i < obj.length; i++) {
//                 const title = obj[i].Title;
//                 const content = obj[i].Content;
//                 const source = obj[i].Source;

                
                
//             }
//         }
//     };
//     xhttp.open('GET', 'https://api.sportsdata.io/v3/nfl/scores/json/News?key=f7876577a76b4ae49e69a47f4dcdcdff', true);
//     xhttp.send();
//     console.log(xhttp.responseText);

// }

// teamNews('sf');
// leagueNews();

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      faveTeam: req.body.faveTeam
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        faveTeam: req.user.faveTeam
      });
    }
  });
};
