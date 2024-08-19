const Enrollment = require("../../models/enrollmentModel");
const Course = require("../../models/enrollmentModel");
const { QueryTypes } = require("sequelize");
const Joi = require("joi");
const axios = require("axios");
const dB = require("../../config/database");
const { trace, SpanStatusCode } = require('@opentelemetry/api');
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

const {
  CUSTOMER_SERVICE_END_POINT,
  USER_SERVICE_END_POINT,
} = require("../../config");

class EnrollmentService {
  async enrollUser(data, user) {
    const tracer = trace.getTracer('enroll-service');
    const span = tracer.startSpan('createEnroll');
    const end = serviceRequestDuration.startTimer({ service: 'EnrollmentService', operation: 'CourseEnroll' });

    try {
      const insertData = this.extractEnrollFields(data);
      insertData.customer_id = user.profile[0].id;
      const enrollment = await Enrollment.create(insertData);
      span.setStatus({ code: SpanStatusCode.OK });
      return enrollment;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw new Error(error.message);
    }finally {
      span.end();  // Ensure that the span is always closed
    }
  }
  
  async getEnrollments() {
    const tracer = trace.getTracer('enrollment-service');
    const span = tracer.startSpan('viewEnrollments');
    try {
      const enrollments = await this._queryDB(
        "SELECT e.*, c.title, c.total_enrollments, ct.id as customer_id, ct.full_name, ct.phone_no, u.email_id FROM `enrollments` e LEFT JOIN `customers` ct ON ct.id = e.customer_id LEFT JOIN courses c ON c.id = e.course_id LEFT JOIN users u on u.id = ct.user_id ORDER by id DESC"
      );
      span.setStatus({ code: SpanStatusCode.OK });
      return enrollments;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw new Error(error.message);
    }finally {
      span.end();
    }
  }
 
  extractEnrollFields(data) {
    return {
      course_id: data.course_id,
      payment_method: data.payment_method,
      payment_status: 1,
      status: 1,
    };
  }

  async getUserInfo(token, carrier) {
    try {
      const user_info = await axios.get(
        `${USER_SERVICE_END_POINT}/verify/token`,
        {
          headers: {
            Authorization: "Bearer " + token,
            ...carrier  // Spread the carrier's key-value pairs into the headers
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
/*
  async getUserDetails(id, token) {
    try {
      const user_info = await axios.get(`${USER_SERVICE_END_POINT}/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (null != user_info.data) {
        return user_info.data;
      } else {
        return 404;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
*/
  async _queryDB(query, options = {}) {
    try {
      return await dB.query(query, { type: QueryTypes.SELECT, ...options });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
module.exports = EnrollmentService;
