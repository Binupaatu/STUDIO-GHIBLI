require('../tracing'); // Make sure this is the first line
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { error } = require("winston");
const userRoutes = require("./api/routes/userRoutes");
const { USER_SERVICE_PORT, APPLICATION_PORT } = require("./config");
const client = require('prom-client');

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
// Enable collection of default metrics
collectDefaultMetrics();

const customCounter = new client.Counter({
  name: 'custom_counter_total',
  help: 'Example of a custom counter for tracking events'
});

// Create a /metrics endpoint to expose the metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example route that increments the custom counter
app.get('/example', (req, res) => {
  customCounter.inc(); // Increment the custom counter
  res.send('Hello World!');
});

app.use(userRoutes);

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

const APP_PORT = APPLICATION_PORT || 8881;

app.listen(APP_PORT, () => {
  console.log(`User Service running on #${APP_PORT}`);
});
