const HttpStatus = require("../../utils/HttpStatus");
const userService = new (require("../services/userService"))();
const customerService = new (require("../services/customerService"))();
const customerValidationSchema = require("../validations/customerSchema");
const Joi = require("joi");
const { trace, context, propagation, SpanStatusCode } = require('@opentelemetry/api');
const client = require('prom-client');

// Prometheus metrics setup
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Custom Prometheus metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10] // Buckets for response time duration
});
register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestCounter);


// Utility function to send responses
const sendResponse = (res, status, message, data = null) => {
  const responseData = { message, data };
  res.status(status).json(responseData);
};

const CustomerController = {
async createCustomer(req, res) {
  const tracer = trace.getTracer('customer-service');
  const span = tracer.startSpan('Create Customer');
  const end = httpRequestDurationMicroseconds.startTimer();

  try {
      const activeContext = trace.setSpan(context.active(), span);
      
      const carrier = {};
      propagation.inject(activeContext, carrier, {
          set: (carrier, key, value) => carrier[key] = value,
      });

      const role = req.body.role && req.body.role.trim() !== "" ? req.body.role : "customer";
      const userData = {
          email: req.body.email,
          password: req.body.password,
          role,
      };

      // Pass the trace context to userService through headers
      const userInfo = await userService.createUser(userData, carrier);
      
      if (userInfo?.result) {
          const userId = userInfo.data.id;
          const customerData = { ...req.body, user_id: userId };
          const customer = await customerService.createCustomer(customerData);
          sendResponse(res, HttpStatus.CREATED, "Customer has been created successfully.", customer);
      } else {
          sendResponse(res, HttpStatus.BAD_REQUEST, userInfo.message);
      }

      span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, `Error: ${error.message}`);
  } finally {
      span.end();
  }
},

  async listCustomers(req, res) {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('getAllCustomers');
    const end = httpRequestDurationMicroseconds.startTimer();

    try {
      const activeContext = trace.setSpan(context.active(), span);
      
      const carrier = {};
      propagation.inject(activeContext, carrier, {
          set: (carrier, key, value) => carrier[key] = value,
      });
      const customers = await customerService.viewCustomers();
      sendResponse(
        res,
        HttpStatus.OK,
        "User details have been fetched successfully.",
        customers
      );
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }finally {
      const responseStatus = res.statusCode;
      httpRequestCounter.inc({ method: req.method, route: req.route.path, status_code: responseStatus });
      end({ method: req.method, route: req.route.path, status_code: responseStatus });
      span.end();
    }
  },

  async viewCustomer(req, res) {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('getAllCustomers');
    const end = httpRequestDurationMicroseconds.startTimer();

    const customer_id = req.params.id;
    try {
      const customerInfo = await customerService.viewCustomerById(customer_id);
      if (null != customerInfo) {
        sendResponse(
          res,
          HttpStatus.OK,
          "User details have been fetched successfully.",
          customerInfo
        );
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "User is Empty!");
      }
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }finally {
      const responseStatus = res.statusCode;
      httpRequestCounter.inc({ method: req.method, route: req.route.path, status_code: responseStatus });
      end({ method: req.method, route: req.route.path, status_code: responseStatus });
      span.end();
    }
  },

  async viewCustomerByUserId(req, res) {
  const user_id = req.params.id;
  const parentContext = propagation.extract(context.active(), req.headers);
  const tracer = trace.getTracer('customer-service');
  const span = tracer.startSpan('Create User', undefined, parentContext);
  const end = httpRequestDurationMicroseconds.startTimer();

    try {
      
      const customerInfo = await customerService.viewCustomerByUserId(user_id,req.headers);
      if (null != customerInfo) {
        sendResponse(
          res,
          HttpStatus.OK,
          "Customer details have been fetched successfully.",
          customerInfo
        );
        span.setStatus({ code: SpanStatusCode.OK });
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "Customer not found!");
      }
    } catch (error) {
      span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
      });
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }finally {
      const responseStatus = res.statusCode;
      httpRequestCounter.inc({ method: req.method, route: req.route.path, status_code: responseStatus });
      end({ method: req.method, route: req.route.path, status_code: responseStatus });
      span.end();
  }
  },
};

module.exports = CustomerController;