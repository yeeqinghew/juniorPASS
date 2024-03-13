CREATE DATABASE juniorPASS;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS child CASCADE;
DROP TABLE IF EXISTS parent CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
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
CREATE TYPE transactionType AS ENUM('CREDIT', 'DEBIT');

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    user_type userTypes,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_on DATE,
    phone_number VARCHAR(8),
    method methods,
    credit INTEGER,
    display_picture VARCHAR(255)
);

ALTER TABLE users ALTER COLUMN credit SET DEFAULT 0;

CREATE TABLE child (
    child_id VARCHAR(200) UNIQUE,
    gender genders,
    FOREIGN KEY (child_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE parent (
    parent_id VARCHAR(200) UNIQUE,
    FOREIGN KEY (parent_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE vendors (
    vendor_id PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(1000),
    category categories NOT NULL,
    website VARCHAR(1000),
    password VARCHAR(244) NOT NULL,
    rating BIGINT NOT NULL,
    picture VARCHAR(1000),
    address VARCHAR(1000) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL, 
    created_on DATE
);

ALTER TABLE vendors ALTER COLUMN rating SET DEFAULT 0;

CREATE TABLE listings {
    listing_id PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id SERIAL,
    listing_title VARCHAR(1000) NOT NULL,
    price INTEGER,
    category categories NOT NULL,
    description VARCHAR(1000),
    rating BIGINT NOT NULL,
    picture VARCHAR(1000),
    address VARCHAR(1000) NOT NULL,
    latitude VARCHAR(50) NOT NULL,
    longitude VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    age_group VARCHAR(50) NOT NULL,
    pictures VARCHAR(5000) NOT NULL,
    created_on DATE,
    registeredParents VARCHAR(500),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
}

CREATE TABLE transactions (
    transaction_id PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id VARCHAR(200) NOT NULL,
    child_id VARCHAR(200) NOT NULL,
    done_by VARCHAR(50) NOT NULL,
    listing_id VARCHAR(200) NOT NULL,
    used_credit INTEGER NOT NULL,
    transaction_type transactionType NOT NULL,
    created_on DATE
);

INSERT INTO vendors (vendor_name, email, description, category, website, password, rating, picture, address, latitude, longitude, region, created_on)
    VALUES('SG Basketball', 'admin@sgbasketball.com', 'SG Basketball Pte Ltd is the leading service provider for basketball in Singapore. Our programs and events cater for players of all ages, from beginner to advanced levels. Our coaches and tournament organizers are passionate about ensuring that every participant has a positive experience - and that their sport experience enriches their lives.', 'Sports', 'https://www.sgbasketball.com/', 'password', 5, 'https://images.squarespace-cdn.com/content/v1/5ad0064b31d4df14309baeb5/1561030353172-ES8S0PN75WS044UIWCDT/SGBASKETBALL.png?format=1500w', '750B Chai Chee Rd #01-02 S(469002)', '1.3235', '103.9207', 'Kembangan', '2024-1-1');
    
INSERT INTO vendors (vendor_name, email, description, category, website, password, rating, picture, address, latitude, longitude, region, created_on)
    VALUES('Swim Werks', 'sales@swimwerks.com.sg', 'Swimwerks is a trusted provider of lifeguard services for various organisations in Singapore, playing a key role in ensuring the safety of thousands of swimmers across a multitude of contexts, from the open seas to hotel swimming pools.', 'Sports', 'https://swimwerks.com.sg/', 'password', 5, 'https://swimwerks.com.sg/wp-content/uploads/2023/04/Swimwerks-Logo.png', '3 Gambas Cres, #07-11 Nordcom 1, Singapore 757088', '1.4442', '103.8139', 'Sembawang', '2024-1-1');

INSERT INTO vendors (vendor_name, email, description, category, website, password, rating, picture, address, latitude, longitude, region, created_on)
    VALUES('Aureus Academy', 'contact@areusacademy.com', 'Aureus Academy is Singapore''s fastest growing music school with over 18,000 students enrolled between all our schools.', 'Music', 'https://www.aureusacademy.com/', 'password', 5, 'https://w7.pngwing.com/pngs/949/42/png-transparent-aureus-academy-at-northpoint-city-music-lesson-aureus-academy-at-eastpoint-others-text-trademark-logo.png', '23 Serangoon Central, #04-01A/02 NEX, Singapore 556083', '1.3506', '103.8718', 'Serangoon', '2024-1-1');

INSERT INTO vendors (vendor_name, email, description, category, website, password, rating, picture, address, latitude, longitude, region, created_on)
    VALUES('Little Kickers', 'Singapore@littlekickers.sg', 'The home of pre-school football we believe in something we call "Play not Push". It means teaching football in a fun, pressure-free environment. We want to give children a positive introduction to sport as a whole and have FUN along the way', 'Sports', 'https://www.littlekickers.sg/', 'password', 5, 'https://pbs.twimg.com/profile_images/1205502044741742592/aA3NOOhs_400x400.jpg', '16 Raffles Quay, Hong Leong Building Singapore, Singapore 48581', '1.281308', '103.850939', 'City Hall', '2024-1-1');