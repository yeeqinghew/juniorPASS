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

CREATE TYPE user_type AS ENUM ('parent', 'child');
CREATE TYPE method AS ENUM('normal', 'gmail');
CREATE TYPE gender AS ENUM('M', 'F');

CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    userType user_type,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    phoneNumber VARCHAR(50),
    method method,
);

CREATE TABLE child (
    childId SERIAL PRIMARY KEY,
    gender gender,
    FOREIGN KEY (parentId) REFERENCES users(userId),
);

CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    reviews BIGINT NOT NULL,
    picture VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    by VARCHAR(50) NOT NULL,
    to VARCHAR(50) NOT NULL,
    creditUsed VARCHAR(10) NOT NULL,
);