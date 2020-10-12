-- CREATE EMFLC SCHEMA --

-- Drop existing database
DROP DATABASE IF EXISTS emflcDB;

-- Create database
CREATE DATABASE emflcDB;

-- Use datatbase created
USE emflcDB;

-- User Table for Authentication
CREATE TABLE user (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR (100),
    pword VARCHAR (128),
    faveTeam VARCHAR (50)
);

-- Team table for NFL teams and their locations
CREATE TABLE team (
	id INT NOT NULL AUTO_INCREMENT,
    teamName VARCHAR (50),
    city VARCHAR (50),
    state VARCHAR (5),
    county VARCHAR(50),
    fips INT,
    PRIMARY KEY (id)
);

-- Table for schedule of games; need more API info on this
-- to properly insert correct info?
CREATE TABLE game (
	game_id INT,
    team_id INT,
	date DATE
);

-- Table for latest news on teams and Covid news in the area.
CREATE TABLE news (
	id INT NOT NULL AUTO_INCREMENT,
	pinnedNews VARCHAR(255), -- Field used for news headlines/links.
    team INT NOT NULL REFERENCES team(id),
    PRIMARY KEY (id)
);