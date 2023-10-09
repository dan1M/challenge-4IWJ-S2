const express = require("express");
const bodyParser = require("body-parser");

const scheme = require("./util/scheme");
const authRoutes = require("./routes/auth");

const port = 3000;

const app = express();

app.listen(port, () => {
  console.log(`Challenge S2 app listening on port ${port}`);
});

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}); 

app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use(bodyParser.urlencoded({ extended: false }));
