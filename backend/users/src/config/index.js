const dotEnv = require("dotenv");
dotEnv.config();
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile, override: true });
} else {
  dotEnv.config();
}

module.exports = {
  USER_SERVICE_PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  APP_SECRET: process.env.APP_SECRET,
  APPLICATION_PORT: process.env.APPLICATION_PORT,
  CUSTOMER_SERVICE_END_POINT : process.env.CUSTOMER_SERVICE_END_POINT
};
