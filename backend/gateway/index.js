require('./tracing'); // Make sure this is the first line
const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const { trace, context, propagation,SpanStatusCode } = require('@opentelemetry/api');
const { createProxyMiddleware } = require('http-proxy-middleware');
const client = require('prom-client'); // Prometheus client library

const {
  USER_SERVICE_END_POINT,
  CUSTOMER_SERVICE_END_POINT,
  ENROLLMENT_SERVICE_END_POINT,
  COURSE_SERVICE_END_POINT,
  GATEWAY_SERVICE_END_POINT,
  GATEWAY_SERVICE_PORT,
  USER_SERVICE_PORT,
  CUSTOMER_SERVICE_PORT,
  ENROLLMENT_SERVICE_PORT,
  COURSE_SERVICE_PORT,
  APPLICATION_PORT,
  _ENV_USER_SERVICE_PORT,
  _ENV_CUSTOMER_SERVICE_PORT,
  _ENV_ENROLLMENT_SERVICE_PORT,
  _ENV_COURSE_SERVICE_PORT,
} = require("./config");
const app = express();

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });


// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10] // Define your buckets based on expected request duration
});


// CORS options
const corsOptions = {
  origin: "*", // or use a function to dynamically set the origin
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
};

app.use(cors());
app.use(express.json());

/*
 * The Proxy Package will route requests coming to these -
 * end point to respective microservices
 */
 // Tracing Middleware
app.use((req, res, next) => {
  const tracer = trace.getTracer('gateway-service');
  const span = tracer.startSpan(`HTTP ${req.method} ${req.url}`);
  // Attach the span to the request for further use
  req.span = span;
  res.on('finish', () => {
    span.end(); // End the span when the response is sent
  });
  next();
});

// Expose metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


app.use(
  "/api/users",
  async (req, res, next) => {
    // Extract trace context from the incoming request
    const parentContext = propagation.extract(context.active(), req.headers);
    const tracer = trace.getTracer('gateway-service');
    // Start a new span for the gateway's part of the processing
    const span = tracer.startSpan('Gateway: /api/users', {
      attributes: { 'http.method': req.method },
    }, parentContext);
    // Set the span in the context for the rest of the middleware chain
    req.span = span;
    try {
      // Proceed with the proxying
      next();
    } catch (error) {
      // Record any error in the span
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      // End the span after the response is sent
      res.on('finish', () => {
        span.setStatus({ code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR });
        span.end();
      });
    }
  },
  proxy(USER_SERVICE_END_POINT, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // Inject the updated trace context into the outgoing request headers
      const activeContext = trace.setSpan(context.active(), srcReq.span);
      propagation.inject(activeContext, proxyReqOpts.headers, {
        set: (carrier, key, value) => {
          carrier[key] = value;
        },
      });
      return proxyReqOpts;
    },
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      // You can inspect or modify the proxy response here if needed
      return proxyResData;
    }
  })
);
app.use(
  "/api/customers",
  async (req, res, next) => {
    // Extract trace context from the incoming request
    const parentContext = propagation.extract(context.active(), req.headers);
    const tracer = trace.getTracer('gateway-service');
    // Start a new span for the gateway's part of the processing
    const span = tracer.startSpan('Gateway: /api/customers', {
      attributes: { 'http.method': req.method },
    }, parentContext);
    // Set the span in the context for the rest of the middleware chain
    req.span = span;
    try {
      // Proceed with the proxying
      next();
    } catch (error) {
      // Record any error in the span
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      // End the span after the response is sent
      res.on('finish', () => {
        span.setStatus({ code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR });
        span.end();
      });
    }
  },
  proxy(`${CUSTOMER_SERVICE_END_POINT}`, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // Inject trace context into headers
      const activeContext = trace.setSpan(context.active(), srcReq.span);
      propagation.inject(activeContext, proxyReqOpts.headers, {
        set: (carrier, key, value) => {
          carrier[key] = value;
        },
      });
      return proxyReqOpts;
    },
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      // You can inspect or modify the proxy response here if needed
      return proxyResData;
    }
  }

  )
);
app.use(
  "/api/enrollment",
  async (req, res, next) => {
    // Extract trace context from the incoming request
    const parentContext = propagation.extract(context.active(), req.headers);
    const tracer = trace.getTracer('gateway-service');
    // Start a new span for the gateway's part of the processing
    const span = tracer.startSpan('Gateway: /api/enrollment', {
      attributes: { 'http.method': req.method },
    }, parentContext);
    // Set the span in the context for the rest of the middleware chain
    req.span = span;
    try {
      // Proceed with the proxying
      next();
    } catch (error) {
      // Record any error in the span
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      // End the span after the response is sent
      res.on('finish', () => {
        span.setStatus({ code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR });
        span.end();
      });
    }
  },
  proxy(`${ENROLLMENT_SERVICE_END_POINT}`, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // Inject trace context into headers
      const activeContext = trace.setSpan(context.active(), srcReq.span);
      propagation.inject(activeContext, proxyReqOpts.headers, {
        set: (carrier, key, value) => {
          carrier[key] = value;
        },
      });
      return proxyReqOpts;
    },
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      // You can inspect or modify the proxy response here if needed
      return proxyResData;
    }
  }

  )
);
app.use(
  "/api/courses",
  async (req, res, next) => {
    // Extract trace context from the incoming request
    const parentContext = propagation.extract(context.active(), req.headers);
    const tracer = trace.getTracer('gateway-service');
    // Start a new span for the gateway's part of the processing
    const span = tracer.startSpan('Gateway: /api/courses', {
      attributes: { 'http.method': req.method },
    }, parentContext);
    // Set the span in the context for the rest of the middleware chain
    req.span = span;
    try {
      // Proceed with the proxying
      next();
    } catch (error) {
      // Record any error in the span
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      // End the span after the response is sent
      res.on('finish', () => {
        span.setStatus({ code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR });
        span.end();
      });
    }
  },
  proxy(`${COURSE_SERVICE_END_POINT}`, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // Inject trace context into headers
      const activeContext = trace.setSpan(context.active(), srcReq.span);
      propagation.inject(activeContext, proxyReqOpts.headers, {
        set: (carrier, key, value) => {
          carrier[key] = value;
        },
      });
      return proxyReqOpts;
    },
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      // You can inspect or modify the proxy response here if needed
      return proxyResData;
    }
  }

  )
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade"); // Or another policy as needed
  next();
});

const APP_PORT = APPLICATION_PORT || 8880;

app.listen(APP_PORT, () => {
  console.log(`IP ||   ${COURSE_SERVICE_END_POINT}`);
  console.log(`PORT ||  31900  `);
  console.log(`Gateway running on ${APP_PORT}`);
});
