const Sequelize = require("sequelize");
const dB = require("../config/database");
const User = require("./userModel");

const Customer = dB.define(
  "customers",
  {
    //Define attributes

    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    area_of_interests: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Customer;
