TRUNCATE record, category;

SELECT SETVAL((SELECT pg_get_serial_sequence('category', 'category_id')), 1, false);
SELECT SETVAL((SELECT pg_get_serial_sequence('record', 'record_id')), 1, false);


-- Insert dummy data into category table
INSERT INTO category (category_type, category_name, parent_category_id)
VALUES (0, 'Salary', NULL),
(0, 'Allowances', NULL),
(0, 'Transportation Allowance', 2),
(0, 'Communication Allowance', 2),
(1, 'Food', NULL),
(1, 'Housing', NULL),
(1, 'Housing Loan', 6),
(1, 'Maintenance', 6);


-- Insert dummy data into record table
INSERT INTO record (record_type, amount, category_id)
VALUES (0, '9000', 1),
    (0, '1000', 2),
    (0, '500', 3),
    (0, '500', 4),
    (1, '1200', 5),
    (1, '8800', 6),
    (1, '6800', 7),
    (1, '2000', 8);