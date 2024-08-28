const { search } = require("../routes/courseRoutes");
const CourseService = require("../services/courseService");
const courseService = require("../services/courseService");
const courseValidationSchema = require("../validations/courseSchema");
const service = new courseService();
const { propagation, context,trace, SpanStatusCode } = require('@opentelemetry/api');
const client = require('prom-client');


// Define custom metrics
const courseserviceAttempts = new client.Counter({
  name: 'courseservice_attempts_total',
  help: 'Total number of course service attempts'
});

const courseserviceSuccess = new client.Counter({
  name: 'courseservice_success_total',
  help: 'Total number of successful course service attempts'
});

const courseserviceFailures = new client.Counter({
  name: 'courseservice_failures_total',
  help: 'Total number of failed course service attempts'
});


const courseserviceDuration = new client.Histogram({
  name: 'auth_duration_seconds',
  help: 'Duration of course service process in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10] // Adjust the buckets as needed
});



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
      span.end();
    }
  },

  async getAllCourses(req, res) {
    let tracer;
    let span;
    let courses;

    courseserviceAttempts.inc(); // Increment the signup attempts counter
    const startTime = Date.now();
    
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
          courseserviceSuccess.inc(); // Increment the success counter
          span.setStatus({ code: SpanStatusCode.OK });
      } else {
          res.status(500).send({
            message: "Unable to fetch the courses",
            data: [],
          });
      }
    } catch (error) {
      courseserviceFailures.inc(); // Increment the failures counter

      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ message: "Error in Fetching Courses" , error: error.message });
    }finally {
      const duration = (Date.now() - startTime) / 1000;
      courseserviceDuration.observe(duration); // Record the duration of the signup process

      const responseStatus = res.statusCode;
      span.end();
  }
  },

};

module.exports = CourseController;
