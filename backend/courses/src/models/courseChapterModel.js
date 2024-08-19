const Sequelize = require("sequelize");
const dB = require("../config/database");

const Chapter = dB.define(
  "course_contents",
  {
    //Define attributes

    course_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    duration: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    course_content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("1", "0", "-1"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Chapter;
