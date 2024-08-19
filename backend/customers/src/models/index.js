const Sequelize = require("sequelize");
const dB = require("../config/database");

// Directly require your models without invoking them as functions
const User = require("./userModel");
const Customer = require("./customerModel");

// Assuming your models are correctly defined and exported in userModel.js and customerModel.js
// e.g., const User = dB.define('User', {...});

// Setup associations
Customer.belongsTo(User, { foreignKey: "user_id", as: "user" });

const db = {
  dB,
  Sequelize,
  User,
  Customer,
};

module.exports = db;
