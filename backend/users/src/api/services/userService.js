const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { error } = require("../validations/userSchema");

class UserService {
  async createUser(userData) {
    const { email, password, status, role } = userData;
    const returnData = {
      result: "",
      data: "",
    };
    try {
      const userExists = await User.findOne({
        where: {
          email_id: email,
          status: 1,
        },
      });
      if (!userExists || null == userExists) {
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          email_id: email,
          password: hashpassword,
          role: role,
          status: 1,
        });
        returnData.result = true;
        returnData.data = newUser.toJSON();
      } else {
        returnData.result = false;
        returnData.data = "User already exists !!";
      }
    } catch (error) {
      returnData.result = false;
      returnData.data = error.message;
    }
    return returnData;
  }

  async getAllUsers() {
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

  async updateUser(id, newdata) {
    const { full_name, email_id, phone_no, area_of_interests } = newdata;
    try {
      const userupdate = await User.update(
        {
          email_id: email_id,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const res = await axios.put(CUSTOMER_SERVICE_END_POINT + "/" + id, {
        full_name,
        phone_no,
        area_of_interests,
      });
      return userupdate;
    } catch {
      throw new Error(error.message);
    }
  }

  async deleteUser(id) {
    try {
      const userdelete = await User.update(
        {
          status: -1,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return userdelete;
    } catch {
      throw new Error(error.message);
    }
  }

  async logoutUser(id) {
    req.session.destroy((err) => {
      return res;
    });
  }

  async updatePassword(id, user) {
    const hashpassword = await bcrypt.hash(user.password, 10);
    const updatepwd = await User.update(
      {
        password: hashpassword,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return updatepwd;
  }
}

module.exports = new UserService();
