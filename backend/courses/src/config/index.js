const dotEnv = require("dotenv");
if (process.env.NODE_ENV != "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  COURSE_SERVICE_PORT: process.env.COURSE_SERVICE_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  APP_SECRET: process.env.APP_SECRET,
  APPLICATION_PORT: process.env.APPLICATION_PORT,
};
