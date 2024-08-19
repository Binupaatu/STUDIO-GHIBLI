const HttpStatus = require("../../utils/HttpStatus");
const enrollmentService = require("../services/enrollmentService");
const enrollmentValidationSchema = require("../validations/enrollmentSchema");
const service = new enrollmentService();
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

const EnrollmentController = {
  /**
   * This function validate the given request and trigger the Enrollment Service
   * @param {*} req
   * @param {*} res
   * @returns JsonResponse
   */
  async enrollUser(req, res) {
    const tracer = trace.getTracer('enroll-service');
    const span = tracer.startSpan('enroll into course');
    const end = httpRequestDurationMicroseconds.startTimer();

    const { error } = enrollmentValidationSchema.validate(req.body);
    if (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.details[0].message });
    } else {
      try {
        const activeContext = trace.setSpan(context.active(), span);
      
        const carrier = {};
        propagation.inject(activeContext, carrier, {
            set: (carrier, key, value) => carrier[key] = value,
        });
        const userInfo = await service.getUserInfo(
          req.headers.authorization.split(" ")[1],
          carrier
        );
        const course = await service.enrollUser(req.body, userInfo.data);
        res.status(HttpStatus.CREATED).send({
          message: "User has been enrolled successfully",
          data: course,
        });
        span.setStatus({ code: SpanStatusCode.OK });

      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        res
          .status(500)
          .send({ message: "Error in enrollment", error: error.message });
      }finally {
        span.end();
      }
    }
  },

  async listEnrollments(req, res) {
    const tracer = trace.getTracer('enroll-service');
    const span = tracer.startSpan('getAllEnrollments');
    const end = httpRequestDurationMicroseconds.startTimer();

    try {
      if (req.headers["auth"]) {
        // Replace 'auth' with 'Authorization'
        req.headers["authorization"] = req.headers["auth"];
        // Delete the 'auth' header
        delete req.headers["auth"];
      }

      const enrollmentListing = await service.getEnrollments();
      res.status(200).send({
        message: "Data fetched successfully",
        data: enrollmentListing,
      });
      span.setStatus({ code: SpanStatusCode.OK });

    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
      res
        .status(500)
        .send({ message: "Error in enrollment listing", error: error.message });
    }finally {
      span.end();
    }
  },
};

module.exports = EnrollmentController;
