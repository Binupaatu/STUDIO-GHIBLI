const { search } = require("../routes/courseRoutes");
const CourseService = require("../services/courseService");
const courseService = require("../services/courseService");
const courseValidationSchema = require("../validations/courseSchema");
const service = new courseService();
const { propagation, context,trace, SpanStatusCode } = require('@opentelemetry/api');
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


const CourseController = {
  /**
   * This function validate the given request and trigger the Course Service
   * @param {*} req
   * @param {*} res
   * @returns JsonResponse
   */

  async getCourseDetails(req, res) {
    const tracer = trace.getTracer('course-service');
    const span = tracer.startSpan('getAllCourse');

    const end = httpRequestDurationMicroseconds.startTimer();

    const courseId = req.params.id;
    try {
      const courseInfo = await service.getCourseDetails(courseId);
      res.status(201).send({
        message: "Course has been fetched successfully",
        data: courseInfo,
      });
      span.setStatus({ code: SpanStatusCode.OK });

    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ message: error.message });
    }finally {
      const responseStatus = res.statusCode;
      httpRequestCounter.inc({ method: req.method, route: req.route.path, status_code: responseStatus });
      end({ method: req.method, route: req.route.path, status_code: responseStatus });
      span.end();
    }
  },

  async getAllCourses(req, res) {
    let tracer;
    let span;
    let courses;

    const end = httpRequestDurationMicroseconds.startTimer();

    try {
    tracer = trace.getTracer('course-service');

    if(!req.headers.traceparent){
      span = tracer.startSpan('getAllcourses');
      courses = await service.getAllCourses(
        req.query.search,
        req.query.order_by,
        req.query.sort
        );
      }else{
        const parentContext = propagation.extract(context.active(), req.headers);
        span = tracer.startSpan('customer Fetch', undefined, parentContext);
        courses = await service.getAllCoursesUser(
          req.query.search,
          req.query.order_by,
          req.query.sort,
          req.headers
          );
      }
      if (courses) { console.log("Course has been fetched successfully");
          res.status(201).send({
            message: "Course has been fetched successfully",
            data: courses,
          });
          span.setStatus({ code: SpanStatusCode.OK });
      } else {
          res.status(500).send({
            message: "Unable to fetch the courses",
            data: [],
          });
      }
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ message: "Error in Fetching Courses" , error: error.message });
    }finally {
      const responseStatus = res.statusCode;
      httpRequestCounter.inc({ method: req.method, route: req.route.path, status_code: responseStatus });
      end({ method: req.method, route: req.route.path, status_code: responseStatus });
    span.end();
  }
  },

};

module.exports = CourseController;
