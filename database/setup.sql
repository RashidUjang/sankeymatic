-- Command to create the Database
CREATE DATABASE budgetapp;

-- Command to create the Records table
CREATE TABLE record(
    record_id SERIAL PRIMARY KEY,
    record_type SMALLINT NOT NULL,
    amount INT NOT NULL,
    category_id INT REFERENCES category
);

-- Command to create the Category table
CREATE TABLE category(
    category_id SERIAL PRIMARY KEY,
    category_type SMALLINT NOT NULL,
    category_name VARCHAR(255),
    parent_category_id SMALLINT
);

-- Insert dummy data into category table
INSERT INTO category (category_type, category_name, parent_category_id)
VALUES (0, 'Salary', NULL);