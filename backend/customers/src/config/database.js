const Sequelize = require("sequelize");
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = require("./index");

const dB = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT,
});

module.exports = dB;
