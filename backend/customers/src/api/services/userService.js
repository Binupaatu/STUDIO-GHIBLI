const { USER_SERVICE_END_POINT } = require("../../config");
const ApiService = require("./apiService");
const { trace, SpanStatusCode } = require('@opentelemetry/api');
const client = require('prom-client');

// Prometheus metrics setup
const register = new client.Registry();

// Custom Prometheus metrics for UserService
const userServiceRequestDuration = new client.Histogram({
  name: 'user_service_request_duration_seconds',
  help: 'Duration of UserService requests in seconds',
  labelNames: ['operation', 'status_code'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10]
});
register.registerMetric(userServiceRequestDuration);

class UserService {
  constructor() {
    this.apiService = new ApiService(USER_SERVICE_END_POINT);
  }
  // User operations
  async createUser(userData,carrier) {
  console.log("Reached user");
    const tracer = trace.getTracer('Customer-user-service');
    const span = tracer.startSpan('createUser');
    const end = userServiceRequestDuration.startTimer({ operation: 'createUser' });

    try {

      const response = await this.apiService.request("post", "", userData,carrier);

      span.setStatus({ code: SpanStatusCode.OK });
      return response;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;  // Re-throw the error after logging it to OpenTelemetry
    } finally {
      const statusCode = span.status.code === SpanStatusCode.OK ? 200 : 500;
      end({ status_code: statusCode });
      span.end();  // Ensure that the span is always closed
    }
  }
  

  async viewUsers() {
    const tracer = trace.getTracer('Customer-User-service');
    const span = tracer.startSpan('viewUsers');
    const end = userServiceRequestDuration.startTimer({ operation: 'View User' });

    try {
      const users = await this.apiService.request("get", "");
      span.setStatus({ code: SpanStatusCode.OK });
      return users;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      const statusCode = span.status.code === SpanStatusCode.OK ? 200 : 500;
      end({ status_code: statusCode });
      span.end();
    }
  }

  async viewUsersById(userId) {
    return this.apiService.request("get", userId.toString());
  }
}
module.exports = UserService;
