CREATE DATABASE juniorPASS;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS child CASCADE;
DROP TABLE IF EXISTS parent CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS vendor_outlet CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

CREATE OR REPLACE FUNCTION trigger_set_timestamp ()
    RETURNS TRIGGER
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TYPE userTypes AS ENUM ('parent', 'child');
CREATE TYPE methods AS ENUM('normal', 'gmail');
CREATE TYPE genders AS ENUM('M', 'F');
CREATE TYPE categories AS ENUM('Sports', 'Music');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_type userTypes,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    phone_number VARCHAR(50),
    method methods
);

CREATE TABLE child (
    child_id SERIAL PRIMARY KEY,
    user_id SERIAL,
    gender genders,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE parent (
    parent_id SERIAL PRIMARY KEY
);

CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(1000),
    category categories NOT NULL,
    website VARCHAR(1000),
    password VARCHAR(50) NOT NULL,
    reviews BIGINT NOT NULL,
    picture VARCHAR(1000),
    address VARCHAR(1000) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    done_by VARCHAR(50) NOT NULL,
    created_at VARCHAR(10) NOT NULL
);

INSERT INTO vendors (vendor_name, email, description, category, website, password, reviews, picture, address, latitude, longitude, created_at)
    VALUES('SG Basketball', 'admin@sgbasketball.com', '123', 'Sports', 'https://www.sgbasketball.com/', 'password', 5, 'https://images.squarespace-cdn.com/content/v1/5ad0064b31d4df14309baeb5/1561030353172-ES8S0PN75WS044UIWCDT/SGBASKETBALL.png?format=1500w', '750B Chai Chee Rd #01-02 S(469002)', '1.3235', '103.9207', '2024-1-1');

    
INSERT INTO vendors (vendor_name, email, description, category, website, password, reviews, picture, address, latitude, longitude, created_at)
    VALUES('Swim Werks', 'sales@swimwerks.com.sg', '123', 'Sports', 'https://swimwerks.com.sg/', 'password', 5, 'https://swimwerks.com.sg/wp-content/uploads/2023/04/Swimwerks-Logo.png', '3 Gambas Cres, #07-11 Nordcom 1, Singapore 757088', '1.4442', '103.8139', '2024-1-1');

    
INSERT INTO vendors (vendor_name, email, description, category, website, password, reviews, picture, address, latitude, longitude, created_at)
    VALUES('Aureus Academy', 'contact@areusacademy.com', '123', 'Music', 'https://www.aureusacademy.com/', 'password', 5, 'https://w7.pngwing.com/pngs/949/42/png-transparent-aureus-academy-at-northpoint-city-music-lesson-aureus-academy-at-eastpoint-others-text-trademark-logo.png', '23 Serangoon Central, #04-01A/02 NEX, Singapore 556083', '1.3506', '103.8718', '2024-1-1');