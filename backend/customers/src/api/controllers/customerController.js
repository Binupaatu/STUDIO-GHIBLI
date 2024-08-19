const HttpStatus = require("../../utils/HttpStatus");
const userService = new (require("../services/userService"))();
const customerService = new (require("../services/customerService"))();
const customerValidationSchema = require("../validations/customerSchema");
const Joi = require("joi");

// Utility function to send responses
const sendResponse = (res, status, message, data = null) => {
  const responseData = { message, data };
  res.status(status).json(responseData);
};

const CustomerController = {
  async createCustomer(req, res) {
    // Validate the request body first
    const { error } = customerValidationSchema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        error.details[0].message
      );
    }

    try {
      const role =
        req.body.role && req.body.role.trim() !== ""
          ? req.body.role
          : "customer";
      const userData = {
        email: req.body.email,
        password: req.body.password,
        role,
      };

      // Create user and get userId
      const userInfo = await userService.createUser(userData);

      if (null != userInfo && userInfo.result) {
        const userId = userInfo.data.id;
        const customerData = { ...req.body, user_id: userId };
        const customer = await customerService.createCustomer(customerData);
        sendResponse(
          res,
          HttpStatus.CREATED,
          "Customer has been created successfully.",
          customer
        );
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, userInfo.message);
      }
    } catch (error) {
      console.log(error);
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }
  },

  async listCustomers(req, res) {
    try {
      const customers = await customerService.viewCustomers();
      sendResponse(
        res,
        HttpStatus.OK,
        "User details have been fetched successfully.",
        customers
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }
  },

  async viewCustomer(req, res) {
    const customer_id = req.params.id;
    try {
      const customerInfo = await customerService.viewCustomerById(customer_id);
      if (null != customerInfo) {
        sendResponse(
          res,
          HttpStatus.OK,
          "User details have been fetched successfully.",
          customerInfo
        );
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "User is Empty!");
      }
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }
  },

  async viewCustomerByUserId(req, res) {
    const user_id = req.params.id;
    try {
      const customerInfo = await customerService.viewCustomerByUserId(user_id);
      if (null != customerInfo) {
        sendResponse(
          res,
          HttpStatus.OK,
          "Customer details have been fetched successfully.",
          customerInfo
        );
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "Customer not found!");
      }
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }
  },

  async viewCustomerEnrollments(req, res) {
    try {
      const userInfo = await customerService.getUserInfo(
        req.headers.authorization.split(" ")[1]
      );
      console.l;
      const customerEnrollments = await customerService.viewCustomerEnrollments(
        userInfo[0].profile.id
      );

      if (null != customerEnrollments) {
        sendResponse(
          res,
          HttpStatus.OK,
          "Customer Enrollments have been fetched successfully.",
          customerEnrollments
        );
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "Customer not found!");
      }
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error viewCustomerEnrollments : ${error.message}`
      );
    }
  },

  async deleteCustomer(req, res) {
    const customer_id = req.params.id;

    try {
      const customerInfo = await customerService.viewCustomerById(customer_id);
      if (customerInfo.length > 0) {
        const customerResponse = await customerService.deleteCustomer(
          customer_id
        );

        if (customerResponse) {
          await userService.deleteUser(customerInfo[0].user_id);
          sendResponse(res, HttpStatus.OK, `Customer deleted successfully`);
        } else {
          sendResponse(res, HttpStatus.BAD_REQUEST, "User is Empty!");
        }
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "User is Empty!");
      }
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }
  },

  async updateCustomer(req, res) {
    const customer_id = req.params.id;
    try {
      const updateResponse = await customerService.updateCustomer(
        req.body,
        customer_id
      );

      if (updateResponse !== 409) {
        sendResponse(
          res,
          HttpStatus.OK,
          `Customer details updated successfully`,
          req.body
        );
      } else {
        sendResponse(res, HttpStatus.BAD_REQUEST, "User not exists!");
      }
    } catch (error) {
      sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error: ${error.message}`
      );
    }
  },
};

module.exports = CustomerController;
