const dotEnv = require("dotenv");
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  APP_SECRET: process.env.APP_SECRET,
  USER_SERVICE_END_POINT: process.env.USER_SERVICE_END_POINT,
  CUSTOMER_SERVICE_END_POINT: process.env.CUSTOMER_SERVICE_END_POINT,
  APPLICATION_PORT: process.env.APPLICATION_PORT,
};
