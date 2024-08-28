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

const register = client.register;

// Create a Histogram metric to track HTTP request durations
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
});

// Middleware to track request duration for all routes
app.use((req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const durationInSeconds = seconds + nanoseconds / 1e9;

        httpRequestDurationMicroseconds
            .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
            .observe(durationInSeconds);
    });

    next();
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
