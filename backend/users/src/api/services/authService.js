const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const { use } = require("../routes/userRoutes");
const bcrypt = require("bcrypt");
const Op = require("sequelize");
const { APP_SECRET, CUSTOMER_SERVICE_END_POINT } = require("../../config");
const axios = require("axios");

const authService = {
  async authenticateUser(email, password) {
    const user = await User.findOne({
      where: {
        email_id: email,
        status: 1,
      },
    });

    if (user) {
      match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new Error("Invalid credentials");
      } else {
        const userDetails = await this.getCustomerProfile(user.id);
        const userData = {
          id: user.id,
          profile: userDetails.data || [],
        };
        const token = jwt.sign(userData, APP_SECRET, {
          expiresIn: "1h",
        });
        return token;
      }
    } else {
      throw new Error("User not found");
    }
  },

  async getCustomerProfile(user_id) {
    console.log(`${CUSTOMER_SERVICE_END_POINT}/user/${user_id}`);
    try {
      const customer_response = await axios.get(
        `${CUSTOMER_SERVICE_END_POINT}/user/${user_id}`
      );
      if (null != customer_response.data) {
        return customer_response.data;
      } else {
        return 404;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = authService;
