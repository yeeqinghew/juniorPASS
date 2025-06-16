CREATE DATABASE juniorPASS;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS ageGroups CASCADE;
DROP TABLE IF EXISTS categoriesListings CASCADE;
DROP TABLE IF EXISTS packageTypes CASCADE;
DROP TABLE IF EXISTS outlets CASCADE;
DROP TABLE IF EXISTS listingOutlets CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS partnerForms CASCADE;
DROP TABLE IF EXISTS passwordResets CASCADE;
DROP TABLE IF EXISTS otpRequests CASCADE;

DROP TYPE IF EXISTS user_types CASCADE;
DROP TYPE IF EXISTS methods CASCADE;
DROP TYPE IF EXISTS genders CASCADE;
DROP TYPE IF EXISTS categories CASCADE;
DROP TYPE IF EXISTS package_types CASCADE;
DROP TYPE IF EXISTS transaction_types CASCADE;
DROP TYPE IF EXISTS age_groups CASCADE;

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
CREATE TYPE methods AS ENUM('email', 'gmail');
CREATE TYPE genders AS ENUM('M', 'F');
CREATE TYPE categories AS ENUM('Sports', 'Music');
CREATE TYPE package_types AS ENUM('pay-as-you-go', 'short-term', 'long-term');
CREATE TYPE transaction_types AS ENUM('CREDIT', 'DEBIT');
CREATE TYPE age_groups AS ENUM ('infant', 'toddler', 'preschooler', 'above-7');

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone_number VARCHAR(8) UNIQUE,
    user_type user_types,
    method methods NOT NULL DEFAULT 'email', -- login method used
    credit INTEGER DEFAULT 0,
    display_picture VARCHAR(255),
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parents (
    parent_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE children (
    child_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id uuid REFERENCES parents(parent_id) ON DELETE CASCADE,
    name VARCHAR(100),
    age BIGINT,
    gender genders NOT NULL
);

-- PARTNER PORTAL
CREATE TABLE partners (
    partner_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(244) NOT NULL,
    description VARCHAR(1000),
    website VARCHAR(1000),
    rating BIGINT DEFAULT 0,
    picture VARCHAR(1000),
    address VARCHAR(1000) NOT NULL,
    region VARCHAR(50) NOT NULL, 
    contact_number VARCHAR(8),
    categories categories[] NOT NULL,
    created_on TIMESTAMP DEFAULT NOW()
);

INSERT INTO partners(partner_name, email, password, description, website, picture, address, region, contact_number, categories, created_on)
    VALUES
    ('SG Basketball', 'admin@sgbasketball.com', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'SG Basketball Pte Ltd is the leading service provider for basketball in Singapore. Our programs and events cater for players of all ages, from beginner to advanced levels. Our coaches and tournament organizers are passionate about ensuring that every participant has a positive experience - and that their sport experience enriches their lives.', 
     'https://www.sgbasketball.com/', 'https://images.squarespace-cdn.com/content/v1/5ad0064b31d4df14309baeb5/1561030353172-ES8S0PN75WS044UIWCDT/SGBASKETBALL.png?format=1500w', '750B Chai Chee Rd #01-02 S(469002)', 'Kembangan', '98763456', '{"Sports"}', CURRENT_TIMESTAMP)
 
    , ('Swim Werks', 'sales@swimwerks.com.sg', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'Swimwerks is a trusted provider of lifeguard services for various organisations in Singapore, playing a key role in ensuring the safety of thousands of swimmers across a multitude of contexts, from the open seas to hotel swimming pools.', 
     'https://swimwerks.com.sg/', 'https://swimwerks.com.sg/wp-content/uploads/2023/04/Swimwerks-Logo.png', '3 Gambas Cres, #07-11 Nordcom 1, Singapore 757088', 'Sembawang', '66986645', '{"Sports"}',CURRENT_TIMESTAMP)

    , ('Aureus Academy', 'contact@areusacademy.com', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'Aureus Academy is Singapore''s fastest growing music school with over 18,000 students enrolled between all our schools.', 
     'https://www.aureusacademy.com/', 'https://w7.pngwing.com/pngs/949/42/png-transparent-aureus-academy-at-northpoint-city-music-lesson-aureus-academy-at-eastpoint-others-text-trademark-logo.png', '23 Serangoon Central, #04-01A/02 NEX, Singapore 556083', 'Serangoon', '65742231', '{"Music"}', CURRENT_TIMESTAMP)

    , ('Little Kickers', 'Singapore@littlekickers.sg', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO', 'The home of pre-school football we believe in something we call "Play not Push". It means teaching football in a fun, pressure-free environment. We want to give children a positive introduction to sport as a whole and have FUN along the way', 
     'https://www.littlekickers.sg/', 'https://pbs.twimg.com/profile_images/1205502044741742592/aA3NOOhs_400x400.jpg', '16 Raffles Quay, Hong Leong Building Singapore, Singapore 48581', 'City Hall', '67890987', '{"Sports"}', CURRENT_TIMESTAMP)
    ;

CREATE TABLE listings (
    listing_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id uuid REFERENCES partners(partner_id) NOT NULL,
    listing_title VARCHAR(1000) NOT NULL,
    price INTEGER,
    credit INTEGER,
    package_types package_types[] NOT NULL,
    description VARCHAR(5000),
    rating BIGINT NOT NULL DEFAULT 0, 
    -- rating ON UPDATE CASCADE
    age_groups age_groups[] NOT NULL,
    images JSONB,
    registered_parents VARCHAR(500),
    short_term_start_date TIMESTAMP,
    long_term_start_date TIMESTAMP,
    active BOOLEAN,
    created_on TIMESTAMP DEFAULT NOW(),
    last_updated_on TIMESTAMP
);

CREATE TABLE outlets (
    outlet_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id uuid REFERENCES partners(partner_id) ON DELETE CASCADE,
    address VARCHAR(1000),
    nearest_mrt VARCHAR(200),
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listingOutlets (
    listing_outlet_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid REFERENCES listings(listing_id) ON DELETE CASCADE,
    outlet_id uuid REFERENCES outlets(outlet_id) ON DELETE CASCADE,
    UNIQUE (listing_id, outlet_id)
);

CREATE TABLE schedules (
    schedule_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_outlet_id uuid REFERENCES listingOutlets(listing_outlet_id) ON DELETE CASCADE,
    day TEXT CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    timeslot TEXT[],
    frequency TEXT CHECK (frequency IN ('Biweekly', 'Weekly', 'Monthly', 'Yearly')),
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    transaction_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id uuid REFERENCES parents(parent_id) NOT NULL,     
    child_id uuid REFERENCES children(child_id) NOT NULL,
    listing_id uuid REFERENCES listings(listing_id) NOT NULL,
    used_credit INTEGER NOT NULL,
    transaction_type transaction_types NOT NULL,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    review_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid REFERENCES listings(listing_id) NOT NULL,
    partner_id uuid REFERENCES partners(partner_id) NOT NULL,
    user_id uuid REFERENCES users(user_id) NOT NULL,
    rating INTEGER NOT NULL,
    comment VARCHAR(5000) NOT NULL,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categoriesListings (
    id SERIAL PRIMARY KEY,
    name categories
);

INSERT INTO categoriesListings (name) 
    VALUES
    ('Music'),
    ('Sports');

CREATE TABLE packageTypes (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100),
    package_type package_types
);

INSERT INTO packageTypes (name, package_type) 
    VALUES
    ('Pay-as-you-go', 'pay-as-you-go'),
    ('Short term package', 'short-term'),
    ('Long term package', 'long-term');

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
    ('above-7', 7, null);

-- ADMIN PORTAL
CREATE TABLE admins (
    admin_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(20),
    password VARCHAR(200)
);

INSERT INTO admins(username, password)
    VALUES('superadmin', '$2b$10$tk2dxadGFGRMGsj3mjJr2OQ4VpsxvS7cSvajbTUbRJIchUOvYOAGO');

CREATE TABLE partnerForms (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    created_on TIMESTAMP DEFAULT NOW(),
    responded BOOLEAN DEFAULT FALSE
);

CREATE TABLE passwordResets (
    reset_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE otpRequests (
    otp_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    parent_id uuid REFERENCES parents(parent_id) ON DELETE SET NULL,
    listing_id uuid REFERENCES listings(listing_id) ON DELETE SET NULL,
    partner_id uuid REFERENCES partners(partner_id) ON DELETE SET NULL, 
    child_id uuid REFERENCES children(child_id) ON DELETE SET NULL,

    parent_name VARCHAR(100),
    parent_user_id uuid,        
    listing_title VARCHAR(1000),     
    child_name VARCHAR(100),         
    child_age BIGINT,                
    child_gender genders,            

    read BOOLEAN DEFAULT false,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_partner_created_on
ON notifications (partner_id, created_on DESC);
