const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { error } = require("../validations/userSchema");
const { propagation, trace, SpanStatusCode, context } = require('@opentelemetry/api');

class UserService {
      async createUser(userData, carrier) {
        const parentContext = propagation.extract(context.active(), carrier);
        const tracer = trace.getTracer('user-service');
        const span = tracer.startSpan('Create User', {
            attributes: { 'http.method': 'POST' },
        }, parentContext);
        return context.with(trace.setSpan(context.active(), span), async () => {
            try {
                const userExists = await User.findOne({
                    where: { email_id: userData.email, status: 1 },
                });
                
                if (userExists) {

                    throw new Error("User already exists");
                }
    
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const newUser = await User.create({
                    email_id: userData.email,
                    password: hashedPassword,
                    role: userData.role,
                    status: 1,
                });
    
                span.addEvent('New user created');
                span.setStatus({ code: SpanStatusCode.OK });
                return { result: true, data: newUser.toJSON() };
            } catch (error) {
                span.recordException(error);
                span.setStatus({ code: SpanStatusCode.ERROR });
                throw error;
            } finally {
                span.end();
            }
        });
    }
    

    async getAllUsers() {
      const tracer = trace.getTracer('user-service');
      const span = tracer.startSpan('getAllUsers');
      const returnData = {
          result: "",
          data: "",
      };
  
      try {
          const user = await User.findAll({
              attributes: ["id", "email_id", "role"],
          });
  
          if (user.length === 0) {
              returnData.result = false;
              returnData.data = "User does not exist!";
              span.setStatus({ code: SpanStatusCode.ERROR, message: 'No users found' });
              span.end();
              return returnData;
          } else {
              returnData.result = true;
              returnData.data = user;
              span.setStatus({ code: SpanStatusCode.OK });
              span.end();
              return returnData;
          }
      } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          span.end();
          throw new Error(error.message);
      }
  }
  
  async getUserById(id) {
    const returnData = {
      result: "",
      data: "",
    };
    try {
      const user = await User.findAll({
        attributes: ["id", "email_id", "role"],
        where: {
          id: id,
        },
      });
      if (user.length === 0) {
        returnData.result = false;
        returnData.data = "User is not exist !";
        return returnData;
      } else {
        returnData.result = true;
        returnData.data = user;
        return returnData;
      }
    } catch {
      throw new Error(error.message);
    }
  }
  async logoutUser(id) {
    req.session.destroy((err) => {
      return res;
    });
  }
}

module.exports = new UserService();
