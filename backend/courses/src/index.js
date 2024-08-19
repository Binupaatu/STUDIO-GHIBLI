require("newrelic");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { error } = require("winston");
const courseRoutes = require("./api/routes/courseRoutes");
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
const APP_PORT = APPLICATION_PORT || 8884;

app.listen(APP_PORT, () => {
  console.log(`Course Service running on #${APP_PORT}`);
});
