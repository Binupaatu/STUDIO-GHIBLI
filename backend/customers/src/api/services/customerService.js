const Customer = require("../../models/customerModel");
const { QueryTypes } = require("sequelize");
const axios = require("axios");
const dB = require("../../config/database");
const ApiService = require("./apiService");
const UserService = require("./userService");
const { USER_SERVICE_END_POINT } = require("../../config");

class CustomerService {
  constructor() {
    this.apiService = new ApiService(process.env.USER_SERVICE_END_POINT);
    this.userService = new UserService();
  }

  async createCustomer(data) {
    try {
      const customer = await Customer.create(this._extractCustomerFields(data));
      return customer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async viewCustomers() {
    return this._queryDB(
      "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id"
    );
  }

  async viewCustomerById(id) {
    return this._findCustomer(id);
  }

  async viewCustomerByUserId(id) {
    return this._findCustomerByUserId(id);
  }

  async deleteCustomer(id) {
    return this._deleteCustomer({ id });
  }

  async updateCustomer(customerDetail, customer_id) {
    return this._updateCustomer(customerDetail, { id: customer_id });
  }

  async viewCustomerEnrollments(id) {
    return this._findEnrollmentsByCustomer(id);
  }

  async getUserInfo(token) {
    console.log(`${USER_SERVICE_END_POINT}/verify/token`);
    try {
      const user_info = await axios.get(
        `${USER_SERVICE_END_POINT}/verify/token`,
        {
          headers: {
            Authorization: "Bearer " + token,
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

  // Private methods for internal use
  _extractCustomerFields(data) {
    return {
      user_id: data.user_id,
      full_name: data.full_name,
      phone_no: data.phone_no,
      area_of_interests: data.area_of_interests,
      status: data.status,
    };
  }

  async _queryDB(query, options = {}) {
    try {
      return await dB.query(query, { type: QueryTypes.SELECT, ...options });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _findCustomer(id) {
    try {
      return this._queryDB(
        "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id WHERE c.id=" +
          id
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _findCustomerByUserId(id) {
    console.log( "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id WHERE c.user_id=" +
          id);
    try {
      return this._queryDB(
        "SELECT c.*, u.id as user_id, u.email_id, u.role FROM `customers` c INNER JOIN `users` u ON u.id = c.user_id WHERE c.user_id=" +
          id
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _findEnrollmentsByCustomer(id) {
    try {
      return this._queryDB(
        "SELECT e.customer_id, c.title, c.course_content FROM `enrollments` e INNER JOIN customers ct on ct.id = e.customer_id INNER JOIN courses c on c.id = e.course_id WHERE e.customer_id=" +
          id
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _deleteCustomer(condition) {
    try {
      await Customer.destroy({ where: condition });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _updateCustomer(updateValues, condition) {
    try {
      const result = await Customer.update(updateValues, {
        where: condition,
        returning: true,
      });

      const updateCount = result[0];
      const updatedCustomers = result[1]; // This would be an array of updated customers

      if (updateCount === 1 && updatedCustomers.length > 0) {
        return updatedCustomers[0]; // Return the first (and should be only) updated customer
      } else {
        return null; // No customers updated, or conditions matched more than one.
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CustomerService;
