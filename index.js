const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.listen(port, () => {
  console.log(`Starting server and listening at port ${port}`);
});

app.use("/user/walo", (req, res) => {
  console.log(`The request's HTTP Method is: ${req.method}`);
  res.send("Got a GET request at /user/walo from the use method");
});

app.use(express.static(path.join(__dirname, "public")));

// Virtually expose the files from certain node_modules
app.use("/css/bulma/bulma.min.css", express.static(path.join(__dirname, "node_modules/bulma/css/bulma.min.css")));
app.use("/js/d3.js", express.static(path.join(__dirname, "node_modules/d3/dist/d3.min.js")));
app.use("/js/d3-sankey/sankey.js", express.static(path.join(__dirname, "node_modules/d3-sankey/dist/d3-sankey.min.js")));

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
