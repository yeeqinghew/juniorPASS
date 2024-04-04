CREATE DATABASE juniorPASS;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS child CASCADE;
DROP TABLE IF EXISTS parent CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS cartItem CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS ageGroups CASCADE;
DROP TABLE IF EXISTS categories_listing CASCADE;

CREATE OR REPLACE FUNCTION trigger_set_timestamp ()
    RETURNS TRIGGER
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TYPE user_types AS ENUM ('parent', 'child');
CREATE TYPE methods AS ENUM('normal', 'gmail');
CREATE TYPE genders AS ENUM('M', 'F');
CREATE TYPE categories AS ENUM('Sports', 'Music');
CREATE TYPE transaction_types AS ENUM('CREDIT', 'DEBIT');
CREATE TYPE age_groups AS ENUM ('infant', 'toddler', 'preschooler', 'above 7');

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    user_type user_types,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_on TIMESTAMP,
    phone_number VARCHAR(8),
    method methods,
    credit INTEGER,
    display_picture VARCHAR(255)
);

ALTER TABLE users ALTER COLUMN credit SET DEFAULT 0;

CREATE TABLE child (
    child_id uuid REFERENCES users(user_id) NOT NULL UNIQUE,
    gender genders
);

CREATE TABLE parent (
    parent_id uuid REFERENCES users(user_id) NOT NULL UNIQUE
);

-- PARTNER PORTAL
CREATE TABLE partners (
    partner_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(244) NOT NULL,
    description VARCHAR(1000),
    category categories NOT NULL,
    website VARCHAR(1000),
    rating BIGINT,
    picture VARCHAR(1000),
    address VARCHAR(1000) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL, 
    phone_number VARCHAR(8),
    age_group VARCHAR(50),
    created_on TIMESTAMP
);

ALTER TABLE partners ALTER COLUMN rating SET DEFAULT 0;

INSERT INTO partners(partner_name, email, password, description, category, website, rating, picture, address, latitude, longitude, region, phone_number, created_on)
    VALUES
    ('SG Basketball', 'admin@sgbasketball.com', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'SG Basketball Pte Ltd is the leading service provider for basketball in Singapore. Our programs and events cater for players of all ages, from beginner to advanced levels. Our coaches and tournament organizers are passionate about ensuring that every participant has a positive experience - and that their sport experience enriches their lives.', 
    'Sports', 'https://www.sgbasketball.com/', 5, 'https://images.squarespace-cdn.com/content/v1/5ad0064b31d4df14309baeb5/1561030353172-ES8S0PN75WS044UIWCDT/SGBASKETBALL.png?format=1500w', '750B Chai Chee Rd #01-02 S(469002)', '1.3235', '103.9207', 'Kembangan', '98763456', CURRENT_TIMESTAMP)
 
    , ('Swim Werks', 'sales@swimwerks.com.sg', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'Swimwerks is a trusted provider of lifeguard services for various organisations in Singapore, playing a key role in ensuring the safety of thousands of swimmers across a multitude of contexts, from the open seas to hotel swimming pools.', 
    'Sports', 'https://swimwerks.com.sg/', 5, 'https://swimwerks.com.sg/wp-content/uploads/2023/04/Swimwerks-Logo.png', '3 Gambas Cres, #07-11 Nordcom 1, Singapore 757088', '1.4442', '103.8139', 'Sembawang', '66986645', CURRENT_TIMESTAMP)

    , ('Aureus Academy', 'contact@areusacademy.com', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'Aureus Academy is Singapore''s fastest growing music school with over 18,000 students enrolled between all our schools.', 
    'Music', 'https://www.aureusacademy.com/', 5, 'https://w7.pngwing.com/pngs/949/42/png-transparent-aureus-academy-at-northpoint-city-music-lesson-aureus-academy-at-eastpoint-others-text-trademark-logo.png', '23 Serangoon Central, #04-01A/02 NEX, Singapore 556083', '1.3506', '103.8718', 'Serangoon', '65742231', CURRENT_TIMESTAMP)

    , ('Little Kickers', 'Singapore@littlekickers.sg', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'The home of pre-school football we believe in something we call "Play not Push". It means teaching football in a fun, pressure-free environment. We want to give children a positive introduction to sport as a whole and have FUN along the way', 
    'Sports', 'https://www.littlekickers.sg/', 5, 'https://pbs.twimg.com/profile_images/1205502044741742592/aA3NOOhs_400x400.jpg', '16 Raffles Quay, Hong Leong Building Singapore, Singapore 48581', '1.281308', '103.850939', 'City Hall', '67890987', CURRENT_TIMESTAMP)
    ;

CREATE TABLE listings (
    listing_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id uuid REFERENCES partners(partner_id) NOT NULL,
    listing_title VARCHAR(1000) NOT NULL,
    price INTEGER,
    category categories NOT NULL,
    description VARCHAR(1000),
    rating BIGINT NOT NULL,
    address VARCHAR(1000) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    age_group VARCHAR(50) NOT NULL,
    pictures VARCHAR(5000),
    created_on TIMESTAMP,
    registeredParents VARCHAR(500)
);

CREATE TABLE transactions (
    transaction_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id uuid REFERENCES parent(parent_id) NOT NULL,     
    child_id uuid REFERENCES child(child_id)NOT NULL,
    done_by VARCHAR(50) NOT NULL,
    listing_id uuid REFERENCES listings(listing_id) NOT NULL,
    used_credit INTEGER NOT NULL,
    transaction_type transaction_types NOT NULL,
    created_on TIMESTAMP
);

CREATE TABLE cart (
    cart_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id uuid REFERENCES parent(parent_id) NOT NULL,
    created_on TIMESTAMP,
    last_updated TIMESTAMP
);

CREATE TABLE cartItem (
    item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4()
);

CREATE TABLE categories_listing (
    id SERIAL PRIMARY KEY,
    name categories
);

INSERT INTO categories_listing (name) 
    VALUES
    ('Music'),
    ('Sports');

CREATE TABLE ageGroups (
    id SERIAL PRIMARY KEY,
    name age_groups,
    min_age INTEGER,
    max_age INTEGER
);

INSERT INTO ageGroups (name, min_age, max_age) 
    VALUES
    ('infant', 0, 1),
    ('toddler', 1, 2),
    ('preschooler', 3, 6),
    ('above 7', 7, null);

-- ADMIN PORTAL
CREATE TABLE admins (
    admin_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(20),
    password VARCHAR(200)
);

INSERT INTO admins(username, password)
    VALUES('superadmin', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO');


