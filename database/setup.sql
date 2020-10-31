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
VALUES (0, 'Salary', NULL),
(0, 'Allowances', NULL),
(1, 'Transportation', NULL);
(1, 'Car Loan', 3);
(1, 'Food', NULL);
(1, 'Gas', 3);


-- Insert dummy data into record table
INSERT INTO record (record_type, amount, category_id)
VALUES (0, '5000', 1),
    (0, '3000', 3),
    (1, '1200', 6),
    (1, '6800', 4);