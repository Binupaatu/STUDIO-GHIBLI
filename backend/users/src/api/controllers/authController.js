const authService = require("../services/authService");
const { trace, SpanStatusCode, context, propagation } = require('@opentelemetry/api');
const client = require('prom-client');
// Define custom metrics
const authAttempts = new client.Counter({
  name: 'auth_attempts_total',
  help: 'Total number of authentication attempts'
});

const authSuccess = new client.Counter({
  name: 'auth_success_total',
  help: 'Total number of successful authentications'
});

const authFailures = new client.Counter({
  name: 'auth_failures_total',
  help: 'Total number of failed authentication attempts'
});

const authDuration = new client.Histogram({
  name: 'auth_duration_seconds',
  help: 'Duration of authentication process in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10] // Adjust the buckets as needed
});


const authController = {
  async authenticateUser(req, res) {
    const parentContext = propagation.extract(context.active(), req.headers);
    const tracer = trace.getTracer('backend');
    const span = tracer.startSpan('Process Login', {
      attributes: { 'http.method': req.method },
  }, parentContext);
  authAttempts.inc(); // Increment the authentication attempts counter
  const startTime = Date.now();

    try {
      const activeContext = trace.setSpan(context.active(), span);
      const carrier = {};
      propagation.inject(activeContext, carrier, {
          set: (carrier, key, value) => carrier[key] = value,
      });
      const { email, password } = req.body;
      span.setAttribute("user.email", email); // Only if it's safe to log email
      const token = await authService.authenticateUser(email, password,carrier);
      authSuccess.inc(); // Increment the success counter

      res.status(200).json({ message: "Authentication successful", token });
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      authFailures.inc(); // Increment the failures counter

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      });
      res.status(500).json({ message: "Auth Controller: " + error.message });
    } finally {
      const duration = (Date.now() - startTime) / 1000;
      authDuration.observe(duration); // Record the duration of the authentication process
      span.end();
    }
  },
};


module.exports = authController;
