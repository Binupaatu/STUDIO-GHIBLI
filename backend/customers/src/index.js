require('../tracing'); // Make sure this is the first line
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { error } = require("winston");
const customerRoutes = require("./api/routes/customerRoutes");
const { CUSTOMER_SERVICE_PORT, APPLICATION_PORT } = require("./config");
//const logger = require('../logger'); // Import the logger
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

app.use(customerRoutes);

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

const APP_PORT = APPLICATION_PORT || 8882;

app.listen(APP_PORT, () => {
  console.log(`Customer Service running on #${APP_PORT}`);
});
