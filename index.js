const express = require("express");
const app = express();
const path = require("path");
// Need to use destructuring syntax here, or else would need to access it with pool.pool
const { pool } = require("./db");
const port = 3000;

// Enables the use of methods on req such as req.body
app.use(express.json());

app.listen(port, () => {
  console.log(`Starting server and listening at port ${port}`);
});

// Return the list at /budget
app.get("/budget", async (req, res) => {
  try {
    console.log(req.body);
    res.send("woopwoop");
  } catch(err) {
    console.error(err.message);
  }
});

// Post the received records into record
app.post("/budget", async (req, res) => {
  try {
    const {record_type, amount, category_id} = req.body;
    const newRecord = await pool.query(`INSERT INTO record (record_type, amount, category_id) VALUES (${record_type}, ${amount}, ${category_id});`);
    res.json(newRecord);
  } catch(err) {
    console.error(err.message);
  }
});

app.use("/user/walo", async (req, res) => {
  console.log(`The request's HTTP Method is: ${req.method}`);
  console.log(req);
  res.send("Got a GET request at /user/walo from the use method");
  console.log(await pool.query("SELECT * FROM category"));
});

app.use(express.static(path.join(__dirname, "public")));

// Virtually expose the files from certain node_modules
app.use("/css/bulma/bulma.min.css", express.static(path.join(__dirname, "node_modules/bulma/css/bulma.min.css")));

app.get("/user/walo", (req, res) => {
  console.log("Got a request at /user/walo!");
  // TODO: What is .send()? What other ways can we send the response back?
  res.send("Got a GET request at /user/walo from the get method");
});

// TODO: In what form is req and res?
app.get("/user", (req, res) => {
  console.log("Got a request at /user!");
  // TODO: What is .send()? What other ways can we send the response back?
  res.send("Got a GET request at /user");
});
