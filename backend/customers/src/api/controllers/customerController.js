//const logger = require('../../../logger'); // Import the logger
const HttpStatus = require("../../utils/HttpStatus");
const userService = new (require("../services/userService"))();
const customerService = new (require("../services/customerService"))();
const customerValidationSchema = require("../validations/customerSchema");
const Joi = require("joi");
const { trace, context, propagation, SpanStatusCode } = require('@opentelemetry/api');
const client = require('prom-client');


// Define custom metrics
const signupAttempts = new client.Counter({
  name: 'signup_attempts_total',
  help: 'Total number of signup attempts'
});

const signupSuccess = new client.Counter({
  name: 'signup_success_total',
  help: 'Total number of successful signup'
});

const signupFailures = new client.Counter({
  name: 'signup_failures_total',
  help: 'Total number of failed signup attempts'
});


const signupDuration = new client.Histogram({
  name: 'auth_duration_seconds',
  help: 'Duration of signup process in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10] // Adjust the buckets as needed
});


// Utility function to send responses
const sendResponse = (res, status, message, data = null) => {
  const responseData = { message, data };
  res.status(status).json(responseData);
};

const CustomerController = {
async createCustomer(req, res) {
  const tracer = trace.getTracer('customer-service');
  const span = tracer.startSpan('Create Customer');
  signupAttempts.inc(); // Increment the signup attempts counter
  const startTime = Date.now();

  try {
    // Log the incoming request
     // logger.info('Creating a new customer', { requestData: req.body });
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
     // logger.info('Customer created successfully', { customerId: userId });
     signupSuccess.inc(); // Increment the success counter

      span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
     // logger.error('Error creating customer', { error: error.message });
     signupFailures.inc(); // Increment the failures counter

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, `Error: ${error.message}`);
  } finally {
    const duration = (Date.now() - startTime) / 1000;
    signupDuration.observe(duration); // Record the duration of the signup process

      span.end();
  }
},

  async listCustomers(req, res) {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('getAllCustomers');
    

    try {
            // Log the request
     /// logger.info('Fetching all customers');

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
   //   logger.info('Customers fetched successfully');

      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
    //logger.error('Error fetching customers', { error: error.message });

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }finally {
      const responseStatus = res.statusCode;

      span.end();
    }
  },

  async viewCustomer(req, res) {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('getAllCustomers');

    const customer_id = req.params.id;
    try {
            // Log the request
           // logger.info('Fetching customers by ID');

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
   //   logger.info('Customers fetched successfully');

      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
    //  logger.error('Error fetching customers', { error: error.message });

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }finally {
      const responseStatus = res.statusCode;
     
      span.end();
    }
  },

  async viewCustomerByUserId(req, res) {
  const user_id = req.params.id;
  const parentContext = propagation.extract(context.active(), req.headers);
  const tracer = trace.getTracer('customer-service');
  const span = tracer.startSpan('Create User', undefined, parentContext);


    try {
            // Log the request
   //   logger.info('Fetching customers By User ID');

      const customerInfo = await customerService.viewCustomerByUserId(user_id,req.headers);
      if (null != customerInfo) {
        sendResponse(
          res,
          HttpStatus.OK,
          "Customer details have been fetched successfully.",
          customerInfo
        );
     //   logger.info('Customers fetched successfully');

        span.setStatus({ code: SpanStatusCode.OK });
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "Customer not found!");
      }
    } catch (error) {
   //   logger.error('Error fetching customers', { error: error.message });

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
      span.end();
  }
  },
};

module.exports = CustomerController;