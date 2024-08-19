require('../tracing'); // Make sure this is the first line
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { error } = require("winston");
const courseRoutes = require("./api/routes/courseRoutes");
const client = require('prom-client');


const {
  COURSE_SERVICE_PORT,
  DB_HOST,
  DB_USER,
  APPLICATION_PORT,
} = require("./config");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Metrics collection
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(courseRoutes);

// Error handling for unsupported routes
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
const APP_PORT = APPLICATION_PORT || 8885;

app.listen(APP_PORT, () => {
  console.log(`Course Service running on #${APP_PORT}`);
});
