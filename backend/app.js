const path = require("path");
const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const BlogsRoutes = require("./routes/blog");
const connectToDB = require('./utils/dbsetup');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'pug');

app.get("/", (req, res) => res.status(200).send("Welcome to blog api."));

app.get("/health", (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  }
  res.status(200).send(data);
});

app.use('/blogs', BlogsRoutes);

// Establish connection with DB
connectToDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => console.log(`App is listening to port ${PORT}`));