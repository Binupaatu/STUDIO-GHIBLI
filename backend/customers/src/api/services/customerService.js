const logger = require('../../../logger'); // Import the logger

const Customer = require("../../models/customerModel");
const { QueryTypes } = require("sequelize");
const axios = require("axios");
const dB = require("../../config/database");
const ApiService = require("./apiService");
const UserService = require("./userService");
const { USER_SERVICE_END_POINT } = require("../../config");
const { trace, SpanStatusCode, propagation, context  } = require('@opentelemetry/api');
const client = require('prom-client');

// Prometheus metrics setup
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Custom Prometheus metrics
const serviceRequestDuration = new client.Histogram({
  name: 'service_request_duration_seconds',
  help: 'Duration of service requests in seconds',
  labelNames: ['service', 'operation', 'status_code'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10]
});
register.registerMetric(serviceRequestDuration);

class CustomerService {
  constructor() {
    this.apiService = new ApiService(process.env.USER_SERVICE_END_POINT);
    this.userService = new UserService();
  }

  async createCustomer(data) {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('CreateCustomer');
    const end = serviceRequestDuration.startTimer({ service: 'CustomerService', operation: 'createCustomer' });

    try {
      logger.info('Creating customer in the database', { data });

      const customer = await Customer.create(this._extractCustomerFields(data));
      span.addEvent('New Customer created');
      span.setStatus({ code: SpanStatusCode.OK });
      logger.info('Customer created in database', { customerId: customer.id });

      return customer;
    } catch (error) {
     logger.error('Error creating customer in database', { error: error.message });

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw new Error(error.message);
    } finally {
      const statusCode = span.status.code === SpanStatusCode.OK ? 200 : 500;
      end({ status_code: statusCode });
      span.end();
    }
  }

  async viewCustomers() {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('viewCustomers');
    const end = serviceRequestDuration.startTimer({ service: 'CustomerService', operation: 'viewCustomers' });

    try {
      logger.info('Fetching customer from the database');

      const customers = await this._queryDB(
        "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id"
      );
      logger.info('Customer Successfully Fetched from database');

      span.setStatus({ code: SpanStatusCode.OK });
      return customers;
    } catch (error) {
      logger.error('Error Fetching customer From database', { error: error.message });

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      const statusCode = span.status.code === SpanStatusCode.OK ? 200 : 500;
      end({ status_code: statusCode });
      span.end();
    }
  }

  async viewCustomerById(id,carrier) {
    const parentContext = propagation.extract(context.active(), carrier);
    const tracer = trace.getTracer('user-service');
    
    const span = tracer.startSpan('fetch User email', {
      attributes: { 'http.method': 'get' },
    }, parentContext);
    const end = serviceRequestDuration.startTimer({ service: 'CustomerService', operation: 'viewCustomerById' });

  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      logger.info('Fetching customer from the database By ID ',id);

      const customer = await this._findCustomer(id);
      span.addEvent('user fetched');
      logger.info('Customer ', id,' Successfully Fetched from database');

      span.setStatus({ code: SpanStatusCode.OK });
      return customer;
    } catch (error) {
      logger.error('Error Fetching customer From database', { error: error.message });

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      const statusCode = span.status.code === SpanStatusCode.OK ? 200 : 500;
      end({ status_code: statusCode });
      span.end();
    }
  });
  }

  async viewCustomerByUserId(id) {
    const tracer = trace.getTracer('customer-service');
    const span = tracer.startSpan('viewCustomerByUserId');
    const end = serviceRequestDuration.startTimer({ service: 'CustomerService', operation: 'viewCustomerByUserId' });

    try {
      logger.info('Fetching customer from the database By User ID ',id);

      const customer = await this._findCustomerByUserId(id);
      logger.info('Customer ', id,' Successfully Fetched from database');

      span.setStatus({ code: SpanStatusCode.OK });
      return customer;
    } catch (error) {
      logger.error('Error Fetching customer From database', { error: error.message });

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      const statusCode = span.status.code === SpanStatusCode.OK ? 200 : 500;
      end({ status_code: statusCode });
      span.end();
    }
  }

  async getUserInfo(token) {
    try {
      const user_info = await axios.get(
        `${USER_SERVICE_END_POINT}/verify/token`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (null != user_info.data) {
        return user_info.data;
      } else {
        return 404;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Private methods for internal use
  _extractCustomerFields(data) {
    return {
      user_id: data.user_id,
      full_name: data.full_name,
      phone_no: data.phone_no,
      area_of_interests: data.area_of_interests,
      status: data.status,
    };
  }

  async _queryDB(query, options = {}) {
    try {
      return await dB.query(query, { type: QueryTypes.SELECT, ...options });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _findCustomer(id) {
    try {
      return this._queryDB(
        "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id WHERE c.id=" +
          id
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _findCustomerByUserId(id) {
    console.log( "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id WHERE c.user_id=" +
          id);
    try {
      return this._queryDB(
        "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id WHERE c.user_id=" +
          id
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _findEnrollmentsByCustomer(id) {
    try {
      return this._queryDB(
        "SELECT e.customer_id, c.title, c.course_content FROM `enrollments` e INNER JOIN customers ct on ct.id = e.customer_id INNER JOIN courses c on c.id = e.course_id WHERE e.customer_id=" +
          id
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _deleteCustomer(condition) {
    try {
      await Customer.destroy({ where: condition });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _updateCustomer(updateValues, condition) {
    try {
      const result = await Customer.update(updateValues, {
        where: condition,
        returning: true,
      });

      const updateCount = result[0];
      const updatedCustomers = result[1]; // This would be an array of updated customers

      if (updateCount === 1 && updatedCustomers.length > 0) {
        return updatedCustomers[0]; // Return the first (and should be only) updated customer
      } else {
        return null; // No customers updated, or conditions matched more than one.
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CustomerService;