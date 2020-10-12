-- Create EMFLC Schema
DROP DATABASE IF EXISTS emflcDB;

CREATE DATABASE emflcDB;

USE emflcDB;

CREATE TABLE user (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR (100),
    pword VARCHAR (128),
    faveTeam VARCHAR (50)
);

CREATE TABLE team (
	id INT NOT NULL AUTO_INCREMENT,
    teamName VARCHAR (50),
    city VARCHAR (50),
    state VARCHAR (5),
    county VARCHAR(50),
    fips INT,
    PRIMARY KEY (id)
);

CREATE TABLE game (
	game_id INT,
    team_id INT,
	date DATE
);

CREATE TABLE news (
	text VARCHAR(255),
    team_id INT
);