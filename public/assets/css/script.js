$(document).ready(function () {

    $("button").on("click", function () {
        $("#teamGame").empty();
        $("#teamName").empty();
    });

    //event listener for the drop-down menu
    $(".dropdown-menu a").click(function (event) {
        event.preventDefault();
        //grab the team name based on user selection
        selectedTeam = $(this).attr("id");
        // other api functions that need to be called
        // teamNews(selectedTeam);
        // leagueNews();
        // fantasyPlayers(team);

        // other api functions that need to be called
        teamNews(selectedTeam);
        leagueNews();
        fantasyPlayers(team);

        var queryURL = "https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2020?key=6306de6ffce1432bae3dc370a38a8de3"

        // use football.io Schedules API to create an array of opponents of the selected team
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //just the games where the selected team is home
            let homeTeamGames = response.filter(homeTeamGames => (homeTeamGames.HomeTeam === selectedTeam && homeTeamGames.AwayTeam != "BYE"));

            //array of the opponents' abbreviations
            let awayTeams = []
            for (let i = 0; i < homeTeamGames.length; i++) {
                awayTeams.push(homeTeamGames[i].AwayTeam);
            }

            //use football.io Teams API to obtain opponent info, state, and capacity 
            $.ajax({
                url: "https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=6306de6ffce1432bae3dc370a38a8de3",
                method: "GET"
            }).then(function (response) {
                //find the abbreviation for the selected team
                let obj = response.find(obj => (obj.Key === selectedTeam));
                //team's full name
                var homeTeamFullName = obj.FullName;
                //stadium details - capacity, name, city, state
                let stadiumCap = obj.StadiumDetails.Capacity;
                let stadium = obj.StadiumDetails.Name;
                let city = obj.StadiumDetails.City
                let teamState = obj.StadiumDetails.State;

                //array of team info for the away teams
                let awayTeamDetails = [];
                awayTeams.map(function (currentAwayTeam) {
                    awayTeamDetails.push(response.find(obj => (obj.Key === currentAwayTeam)))
                })

                //create the heading
                $("#teamName").html(homeTeamFullName + " Home Schedule");
                $("#scheduleArea").removeClass("d-none");
                //loop through opponents
                for (i = 0; i < awayTeamDetails.length; i++) {
                    $("#teamGame")
                        .append($("<li>")
                            .html('<a href="#risk-info">' + awayTeamDetails[i].FullName + " @ " + homeTeamFullName + "</a>")
                            .addClass("tablerow")
                            .attr("id", "teamRow")
                            .css("background", "linear-gradient(180deg, #" + awayTeamDetails[i].PrimaryColor + " 35%, #" + awayTeamDetails[i].SecondaryColor + " 65%")
                        );
                };


                //call Google Maps API
                const lat = obj.StadiumDetails.GeoLat
                const lon = obj.StadiumDetails.GeoLong
                console.log(lat + ", " + lon)
                var state = teamState;
                // var ApiKey = "AIzaSyCIe1mV6aksKfFkYsuJHOmQgse94B6ZHzM";
                // var oneCallApi = `https://maps.googleapis.com/maps/api/staticmap?center=${state}=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=${ApiKey}`;

                // $.ajax({
                //     url: oneCallApi,
                //     method: "GET",
                //     type: "json"
                // }).then(function () {
                //     console.log(lat);



                // Create the script tag, set the appropriate attributes
                let map;

                function initMap() {
                    map = new google.maps.StreetViewPanorama(document.getElementById("map"), {
                        position: {
                            lat: lat,
                            lng: lon
                        },
                        pov: {
                            heading: 34,
                            pitch: 10
                        }


                    });
                    map.setStreetView(panorama);

                }


                //obtain COVID case data from covidtracking API
                $.ajax({
                    url: "https://covidtracking.com/api/v1/states/current.json",
                    method: "GET"
                }).then(function (response) {
                    //find the object with the selected state
                    let obj = response.find(obj => (obj.state === teamState));
                    //num people in the state who are positive
                    let covidCases = obj.positive.toLocaleString();
                    // COVID Calculations
                    let covidRisk;
                    let covidSeats;
                    if (obj.positiveIncrease >= 1000) {
                        covidRisk = "HIGH";
                        covidSeats = stadiumCap / 4;
                        covidSeatsBtwn = "3";
                        $("#cityRisk").addClass("bg-red")
                    } else {
                        covidRisk = "AVERAGE";
                        covidSeats = stadiumCap / 3;
                        covidSeatsBtwn = "2";
                        $("#cityRisk").addClass("bg-yellow")
                    }

                    //update game location(staidum/city)
                    $("#stadium").text(stadium);
                    $("#city").text(city + ", " + teamState);
                    $("#risk-info").removeClass("d-none");
                    $("#cases").text(covidCases);
                    $("#cityRisk").text(covidRisk);
                    $("#availableSeats").text(covidSeats
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    $("#btwnSeats").text(covidSeatsBtwn);



                }) //closes COVID API
                initMap();


            }); //closes Teams API call

        }); //closes Shedules API call

    }); //closes event listener on teams in dropdown

    // this is the league news api call that I will export to the main javascript and call from there
function leagueNews() {
    // variable to make a new XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    // this is the function that is to happen after the api is called
    xhttp.onreadystatechange = function () {
        // this is a simple check that the JSON response isn't and erro
        if (this.readyState === 4 && this.status == 200) {
            // this is the object that I need parsed and don't want to type it out every time I need the JSON response text
            const res = (JSON.parse(xhttp.responseText));
            console.log(res);
            for (i=0; i<3; i++){
                // these are the elements of the article that I will need for the handlebars html
                const leagueNewsTitle = res[i].Title;
                const leagueNewsContent = res[i].Title;
                const leagueNewsTimeago = res[i].TimeAgo;
                // this is the league news div that the json resonse is to be rendered into.
                $("#leagueNewsDiv")
                    .append($('<div>')
                        .html("<h2>"+leagueNewsTitle+"</h2>\n <p>"+leagueNewsContent+"</p>\n <p>"+leagueNewsTimeago+"</p>")
                        .addClass('carousel-item section-bg')
                    );
            }
        }
    };
    xhttp.open('GET', 'https://api.sportsdata.io/v3/nfl/scores/json/News?key=f7876577a76b4ae49e69a47f4dcdcdff', true);
    xhttp.send();
}
// this is the league news api call that I will export to the main javascript and call from there
 function teamNews(team) {
    // variable to make a new XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    // this is the function that is to happen after the api is called
    xhttp.onreadystatechange = function () {
        // this is a simple check that the JSON response isn't and erro
        if (this.readyState === 4 && this.status == 200) {
            // this is the object that I need parsed and don't want to type it out every time I need the JSON response text
            const res = (JSON.parse(xhttp.responseText));
            const teamNewsTitle = res[0].Title;
            const teamNewsContent = res[0].Content;
            const teamNewsTimeAgo = res[0].TimeAgo;
                $("#teamNewsDiv")
                    .append($("<div>")
                        .html("\n<h2 class='newsTitle'>"+teamNewsTitle+"</h2>\n <p>"+teamNewsContent+"</p>\n <p>"+teamNewsTimeAgo+"</p>")
                    )
                    .addClass('section-bg')
            }
    };
    xhttp.open('GET', "https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/"+team+"?key=f7876577a76b4ae49e69a47f4dcdcdff", true);
    xhttp.send();
}
// this is the league news api call that I will export to the main javascript and call from there
function fantasyPlayers(team) {
    // variable to make a new XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    // this is the function that is to happen after the api is called
    xhttp.onreadystatechange = function () {
        // this is a simple check that the JSON response isn't and erro
        if (this.readyState === 4 && this.status == 200) {
            // this is the object that I need parsed and don't want to type it out every time I need the JSON response text
            const res = (JSON.parse(xhttp.responseText));
            //just the games where the selected team is home
            console.log(res)
            let favTeamPlayers = res.filter(favTeamPlayers => (favTeamPlayers.Team === team ));
            // team players array
            let teamPlayers =[];
            for (let i = 0; i < favTeamPlayers.length; i++) {
                let playerName = favTeamPlayers[i].Name;
                let playerPoints = favTeamPlayers[i].FantasyPoints;
                teamPlayers.push({playerName, playerPoints});
            }
            // this is what is appended to the handlebars html
            for (let i=0; i<5; i++){
                $("#fantasyPlayers")
                    .append($("<div>")
                        .html("\n <h2>"+teamPlayers[i].playerName+"</h2>\n <p>Last week fantasy points: "+teamPlayers[i].playerPoints+"</p>\n")
                    )
            }
        }
    };
    xhttp.open('GET', "https://api.sportsdata.io/v3/nfl/stats/json/DailyFantasyPoints/2020-OCT-11?key=f7876577a76b4ae49e69a47f4dcdcdff", true);
    xhttp.send();
}

}); //closes ready fcn

// Sportsdata.io API urls:

// https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=6306de6ffce1432bae3dc370a38a8de3

// https://api.sportsdata.io/v3/nfl/scores/json/Stadiums?key=6306de6ffce1432bae3dc370a38a8de3

// this is the league news api call that I will export to the main javascript and call from there
function leagueNews() {
    // variable to make a new XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    // this is the function that is to happen after the api is called
    xhttp.onreadystatechange = function () {
        // this is a simple check that the JSON response isn't and erro
        if (this.readyState === 4 && this.status == 200) {
            // this is the object that I need parsed and don't want to type it out every time I need the JSON response text
            const res = (JSON.parse(xhttp.responseText));
            console.log(res);
            for (i=0; i<3; i++){
                // these are the elements of the article that I will need for the handlebars html
                const leagueNewsTitle = res[i].Title;
                const leagueNewsContent = res[i].Title;
                const leagueNewsTimeago = res[i].TimeAgo;
                
                // this is the league news div that the json resonse is to be rendered into.
                $("#leagueNewsDiv")
                    .append($('<div>')
                        .html("<h2>"+leagueNewsTitle+"</h2>\n <p>"+leagueNewsContent+"</p>\n <p>"+leagueNewsTimeago+"</p>")
                        .addClass('carousel-item section-bg')
                    );
        
            }

        }
    };
    xhttp.open('GET', 'https://api.sportsdata.io/v3/nfl/scores/json/News?key=f7876577a76b4ae49e69a47f4dcdcdff', true);
    xhttp.send();

}



// this is the league news api call that I will export to the main javascript and call from there
 function teamNews(team) {
    // variable to make a new XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    // this is the function that is to happen after the api is called
    xhttp.onreadystatechange = function () {
        // this is a simple check that the JSON response isn't and erro
        if (this.readyState === 4 && this.status == 200) {
            // this is the object that I need parsed and don't want to type it out every time I need the JSON response text
            const res = (JSON.parse(xhttp.responseText));
            const teamNewsTitle = res[0].Title;
            const teamNewsContent = res[0].Content;
            const teamNewsTimeAgo = res[0].TimeAgo;
                $("#teamNewsDiv")
                    .append($("<div>")
                        .html("\n<h2 class='newsTitle'>"+teamNewsTitle+"</h2>\n <p>"+teamNewsContent+"</p>\n <p>"+teamNewsTimeAgo+"</p>")
                    )
                    .addClass('section-bg')

            }
    };
    xhttp.open('GET', "https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/"+team+"?key=f7876577a76b4ae49e69a47f4dcdcdff", true);
    xhttp.send();

}



// this is the league news api call that I will export to the main javascript and call from there
function fantasyPlayers(team) {
    // variable to make a new XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    // this is the function that is to happen after the api is called
    xhttp.onreadystatechange = function () {
        // this is a simple check that the JSON response isn't and erro
        if (this.readyState === 4 && this.status == 200) {
            // this is the object that I need parsed and don't want to type it out every time I need the JSON response text
            const res = (JSON.parse(xhttp.responseText));
            //just the games where the selected team is home
            console.log(res)
            let favTeamPlayers = res.filter(favTeamPlayers => (favTeamPlayers.Team === team ));
            // team players array
            let teamPlayers =[];
            for (let i = 0; i < favTeamPlayers.length; i++) {
                let playerName = favTeamPlayers[i].Name;
                let playerPoints = favTeamPlayers[i].FantasyPoints;
                teamPlayers.push({playerName, playerPoints});
            }
            // this is what is appended to the handlebars html
            for (let i=0; i<5; i++){
                $("#fantasyPlayers")
                    .append($("<div>")
                        .html("\n <h2>"+teamPlayers[i].playerName+"</h2>\n <p>Last week fantasy points: "+teamPlayers[i].playerPoints+"</p>\n")
                        
                    )
            }
        }
    };
    xhttp.open('GET', "https://api.sportsdata.io/v3/nfl/stats/json/DailyFantasyPoints/2020-OCT-11?key=f7876577a76b4ae49e69a47f4dcdcdff", true);
    xhttp.send();

}