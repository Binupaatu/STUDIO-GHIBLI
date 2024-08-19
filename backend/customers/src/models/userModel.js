const Sequelize = require("sequelize");
const dB = require("../config/database");

const User = dB.define(
  "users",
  {
    //Define attributes
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    email_id: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255],
      },
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
