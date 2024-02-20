CREATE DATABASE juniorPASS;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS child CASCADE;
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
    gender genders,
    FOREIGN KEY (child_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    reviews BIGINT NOT NULL,
    picture VARCHAR(1000),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    done_by VARCHAR(50) NOT NULL,
    created_at VARCHAR(10) NOT NULL
);

INSERT INTO vendors (vendor_name, email, password, reviews, picture, created_at)
    VALUES('SG Basketball', 'admin@sgbasketball.com', 'password', 5, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.sgbasketball.com%2Fcontact&psig=AOvVaw1LrvZwK-V0eOPs19xFDtNz&ust=1708520181001000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKDSz-77uYQDFQAAAAAdAAAAABAE', '2024-1-1');

    
INSERT INTO vendors (vendor_name, email, password, reviews, picture, created_at)
    VALUES('Swim Werks', 'sales@swimwerks.com.sg', 'password', 5, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fswimwerks.com.sg%2F&psig=AOvVaw3gnJ24f25OkRmPz0rDbE3w&ust=1708520290214000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPjkvKL8uYQDFQAAAAAdAAAAABAE', '2024-1-1');

    
INSERT INTO vendors (vendor_name, email, password, reviews, picture, created_at)
    VALUES('SG Basketball', 'contact@areusacademy.com', 'password', 5, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-kpntw&psig=AOvVaw1d1_veH_Lw7O8hPbhqu9QN&ust=1708520339175000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJiW77n8uYQDFQAAAAAdAAAAABAE', '2024-1-1');