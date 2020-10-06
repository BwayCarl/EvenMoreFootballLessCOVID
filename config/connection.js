const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", //Insert your MySQL password here.
  database: "covidCounties"
});

connection.connect(function(err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as ID " + connection.threadId);
});

module.exports = connection;