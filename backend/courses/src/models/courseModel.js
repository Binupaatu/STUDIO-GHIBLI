const Sequelize = require("sequelize");
const dB = require("../config/database");

const Course = dB.define(
  "courses",
  {
    //Define attributes

    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    learning_outcomes: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    course_inclusions: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    is_certified: {
      type: Sequelize.ENUM("1", "0"),
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    course_content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: Sequelize.TINYINT(2),
      allowNull: false,
    },
    total_enrollments: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("-1", "1", "0"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Course;
