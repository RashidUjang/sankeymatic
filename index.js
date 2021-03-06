const express = require("express");
const app = express();
const path = require("path");
// Need to use destructuring syntax here, or else would need to access it with pool.pool
const { pool } = require("./db");
const port = 3000;

// Enables the use of methods on req such as req.body
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Start server and listen on a part
app.listen(port, () => {
  console.log(`Starting server and listening at port ${port}`);
});

// Virtually expose the files from certain node_modules
app.use(
  "/css/bulma/bulma.min.css",
  express.static(path.join(__dirname, "node_modules/bulma/css/bulma.min.css"))
);

// Return all rows from category
app.get("/budget/category", async (req, res) => {
  try {
    const categoryList = await pool.query(`SELECT * FROM category;`);
    res.send(categoryList.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Return all rows from record
app.get("/budget/record", async (req, res) => {
  try {
    const recordList = await pool.query(`SELECT * FROM record;`);
    res.send(recordList.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Post the received records into the record table
app.post("/budget/record", async (req, res) => {
  try {
    const { record_type, amount, category_id } = req.body;
    console.log(record_type, amount, category_id);
    const newRecord = await pool.query(
      `INSERT INTO record (record_type, amount, category_id) VALUES (${record_type}, ${amount}, ${category_id}) RETURNING *;`
    );
    res.json(newRecord.rows);
  } catch (err) {
    console.error(`POST /budget/record error message: ${err.message}`);
  }
});

// Post a new category into the category table
app.post("/budget/category", async (req, res) => {
  try {
    const { category_type, category_name, parent_category_id } = req.body;
    const newCategory = await pool.query(
      `INSERT INTO category (category_type, category_name, parent_category_id) VALUES (${category_type}, '${category_name}', ${parent_category_id}) RETURNING *;`
    );
    res.json(newCategory.rows);
  } catch (err) {
    console.error(`POST /budget/category error message: ${err.message}`);
  }
});

// Get a specific record according to its id
app.get("/budget/record/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await pool.query(
      `SELECT * FROM category WHERE record_id = ${id};`
    );

    if (record.rows.length != 0) {
      res.json(record.rows);
    } else {
      res.json("Record not found.");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Get a specific category according to its id
app.get("/budget/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await pool.query(
      `SELECT * FROM category WHERE category_id = ${id};`
    );

    if (category.rows.length != 0) {
      res.json(category.rows);
    } else {
      res.json("Category not found.");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Update a record
app.put("/budget/record/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { record_type, amount, category_id } = req.body;
    const updateRecord = await pool.query(
      `UPDATE record SET record_type = ${record_type}, amount = ${amount}, category_id = ${category_id} WHERE record_id = ${id}`
    );
    res.json("Record was updated.");
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a record
app.delete("/budget/record/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recordList = await pool.query(
      `DELETE FROM record WHERE record_id = ${id};`
    );
    res.json("Record was deleted.");
  } catch (err) {
    console.error(err.message);
  }
});
