const Sequelize = require("sequelize");
const dB = require("../config/database");

const Enrollment = dB.define(
  "enrollments",
  {
    //Define attributes

    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    enrollment_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    payment_method: {
      type: Sequelize.CHAR(20),
      allowNull: true,
    },
    payment_status: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("-1", "1", "0"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Enrollment;
