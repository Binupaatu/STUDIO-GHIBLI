const Course = require("../../models/courseModel");
const Chapter = require("../../models/courseChapterModel");
const { Op } = require("sequelize");
const { propagation,context,trace, SpanStatusCode } = require('@opentelemetry/api');
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

class CourseService {
  
  // Extracts course fields from data
  extractCourseFields(data) {
    return {
      title: data.title,
      description: data.description,
      learning_outcomes: data.learning_outcomes,
      course_inclusions: data.course_inclusions,
      is_certified: data.is_certified,
      author: data.author,
      price: data.price,
      rating: data.rating,
      total_enrollments: data.total_enrollments,
      status: data.status,
      course_content: data.course_content,
    };
  }

  //Get indiviadual course details
  async getCourseDetails(courseId) {
    console.log("Get edit Course");
    const tracer = trace.getTracer('course-service');
    const span = tracer.startSpan('viewCourses');
    const end = serviceRequestDuration.startTimer({ service: 'CourseService', operation: 'FetchCourse' });

    try {
      let courseInfo = await Course.findByPk(courseId);
      const chapters = await Chapter.findAll({
        where: {
          course_id: courseId,
        },
      });
      courseInfo = courseInfo.get({ plain: true });

      courseInfo.chapters = chapters;
      span.setStatus({ code: SpanStatusCode.OK });
      return courseInfo;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw new Error("Course not found");
    }finally {
      span.end();
    }
  }
  //Fetch all courses those are not deleted
  async getAllCourses(searchTerm, order, sort) {
    const tracer = trace.getTracer('course-service');
    const span = tracer.startSpan('viewCourses');
    const end = serviceRequestDuration.startTimer({ service: 'CourseService', operation: 'FetchCourse' });
    let options = {
      where: {
        status: {
          [Op.ne]: "-1",
        },
      },
    };

    if (searchTerm) {
      options.where.title = {
        [Op.like]: `%${searchTerm}%`,
      };
    }

    if (order && sort) {
      options.order = [[order, sort]];
    }

    try {
      const courses = await Course.findAll(options);
      span.setStatus({ code: SpanStatusCode.OK });
      return courses;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw new Error(error);
    }finally {
      span.end();
    }
  }
  
  async getAllCoursesUser(searchTerm, order, sort, carrier) {
  const parentContext = propagation.extract(context.active(), carrier);
  const tracer = trace.getTracer('course-service');
  const span = tracer.startSpan('fetchCourseDetail', {
      attributes: { 'http.method': 'get' },
  }, parentContext);
  const end = serviceRequestDuration.startTimer({ service: 'CourseService', operation: 'FetchCourse' });

  return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
          const options = {
              where: {
                  status: { [Op.ne]: "-1" },
              },
          };

          if (searchTerm) {
              options.where.title = {
                  [Op.like]: `%${searchTerm}%`,
              };
          }

          if (order && sort) {
              options.order = [[order, sort]];
          }

          console.log("test connection - before query execution");
          const start = Date.now();
          const courses = await Course.findAll(options);
          const end = Date.now();
          console.log(`Query execution time: ${end - start}ms`);
          console.log("test connection - after query execution");

          span.setStatus({ code: SpanStatusCode.OK });
          return courses;
      } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw error;
      } finally {
          span.end();
      }
  });
  }


}

module.exports = CourseService;
