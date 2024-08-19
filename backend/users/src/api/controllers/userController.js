const { APP_SECRET } = require("../../config");
const HttpStatus = require("../../utils/HttpStatus");
const userService = require("../services/userService");
const userValidationSchema = require("../validations/userSchema");
const jwt = require("jsonwebtoken");
const { propagation, trace, SpanStatusCode,context } = require('@opentelemetry/api');

const UserController = {
async createUser(req, res) {
    const parentContext = propagation.extract(context.active(), req.headers);
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('Create User', undefined, parentContext);
    const { error } = userValidationSchema.validate(req.body);
    const responseData = {
      data: [],
      message: "",
    };

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        ...responseData,
        message: error.details[0].message,
      });
    }
    try {
        const newUser = await userService.createUser(req.body, req.headers);

        if (newUser.result) {
            res.status(HttpStatus.CREATED).json({
              ...responseData,
              message: "User created successfully",
                data: newUser.data,
                result: true,
            });
        } else {
            res.status(HttpStatus.OK).json({
              ...responseData,
                message: "User already exists",
                result: false,
            });
        }

        span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
        });
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          ...responseData,

            message: `Error: ${error.message}`
        });
    } finally {
        span.end();
    }
},

async getAllUsers(req, res) {
  console.log("testing user connection");
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('getAllUsers');
    try {
      const userList = await userService.getAllUsers();
      if (!userList || userList.data.length === 0) {
        throw new Error("No users found");
      }
      res.send({
        message: "User has been fetched successfully",
        data: userList,
      });
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).send({ message: "User is empty" });
    } finally {
      span.end();
    }
  },

async getUserById(req, res) {
    try {
      const userId = req.params.id;
      //Call Service Fuunction
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(500).send({ message: "User is empty" });
      } else {
        res.send({
          message: "User has been fetched successfully",
          data: user,
        });
      }
    } catch (error) {
      res.status(500).send({ message: "User is empty" });
    }
  },
  
  async loginUser(req, res) {
    // Business logic for user login
    // Authenticate user and issue a token/session
    res
      .status(200)
      .send({ message: "Login successful", token: "your_token_here" });
  },
  
async logoutUser(id) {
  req.session.destroy((err) => {
    return res;
  });
},
async verifyUser(req, res) {
  // Create a tracer instance
  const tracer = trace.getTracer('verification-service');
  const parentContext = propagation.extract(context.active(), req.headers, {
    get: (carrier, key) => carrier[key]  // Extract from the carrier
});
  const span = tracer.startSpan('verifyUser', undefined, parentContext);

  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, APP_SECRET);

      // Extract the context from the incoming request headers
      const parentContext = propagation.extract(context.active(), req.headers, {
          get: (carrier, key) => carrier[key]  // Extract from the carrier
      });

      // Start a new span or continue with the parent context
      const span = tracer.startSpan('verifyUser', undefined, parentContext);

      // Continue the trace within the context of the new span
      await context.with(trace.setSpan(context.active(), span), async () => {
          // Business logic here
          res.status(200).json({ msg: "Profile Fetched Successfully", data: decoded });

          // Set span status to OK since the operation was successful
      span.setStatus({ code: SpanStatusCode.OK });
      });

  }
  catch (error) {
      // Handle any errors
      if (span) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
          span.recordException(error);
      }
      res.status(400).send({ message: "Invalid Data" });
  }
  finally {
      if (span) {
          span.end();  // Ensure the span is ended
      }
  }
}
};

module.exports = UserController;
