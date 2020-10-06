g-- Create Covid Schema
CREATE DATABASE covid;

USE covid;

-- Create Tables
-- Definition of 'fips': Federal Information Processing Standards - American National Standards Institute codes (ANSI codes)
-- are standardized numeric or alphabetic codes issued by the American National Standards Institute (ANSI) 
-- to ensure uniform identification of geographic entities through all federal government agencies.
-- (https://www.census.gov/quickfacts/fact/note/US/fips)
CREATE TABLE covidCounties 
(
    id INT NOT NULL AUTO_INCREMENT, 
    DATETIME,
    county VARCHAR(50),
    state VARCHAR (20),
    fips INT(11), 
    cases INT (11),
    deaths INT (11),
    PRIMARY KEY (id)
);