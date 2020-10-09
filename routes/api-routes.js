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

 function teamNews(team) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            const obj = (JSON.parse(xhttp.responseText));
            for (i = 0; i < obj.length; i++) {
                const title = obj[i].Title;
                const content = obj[i].Content;
                document.getElementById('title').innerHTML = title;
                document.getElementById('news').innerHTML = content;
            }

        }
    };
    xhttp.open('GET', 'https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/' + team + '?key=f7876577a76b4ae49e69a47f4dcdcdff', true);
    xhttp.send();

}
function leagueNews() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            const obj = JSON.parse(xhttp.responseText);
            console.log(obj)
            for (i = 0; i < obj.length; i++) {
                const title = obj[i].Title;
                const content = obj[i].Content;
                const source = obj[i].Source;

                
                
            }
        }
    };
    xhttp.open('GET', 'https://api.sportsdata.io/v3/nfl/scores/json/News?key=f7876577a76b4ae49e69a47f4dcdcdff', true);
    xhttp.send();
    console.log(xhttp.responseText);

}

teamNews('sf');
leagueNews();