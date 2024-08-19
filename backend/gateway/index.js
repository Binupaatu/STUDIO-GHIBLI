require("newrelic");
const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const {
  USER_SERVICE_END_POINT,
  CUSTOMER_SERVICE_END_POINT,
  ENROLLMENT_SERVICE_END_POINT,
  COURSE_SERVICE_END_POINT,
  GATEWAY_SERVICE_END_POINT,
  GATEWAY_SERVICE_PORT,
  USER_SERVICE_PORT,
  CUSTOMER_SERVICE_PORT,
  ENROLLMENT_SERVICE_PORT,
  COURSE_SERVICE_PORT,
  APPLICATION_PORT,
  _ENV_USER_SERVICE_PORT,
  _ENV_CUSTOMER_SERVICE_PORT,
  _ENV_ENROLLMENT_SERVICE_PORT,
  _ENV_COURSE_SERVICE_PORT,
} = require("./config");
const app = express();
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerJsDocs = yamljs.load("./swagger/api.yml");
swaggerJsDocs.servers[0].url = GATEWAY_SERVICE_END_POINT;
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

// CORS options
const corsOptions = {
  origin: "*", // or use a function to dynamically set the origin
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
};

app.use(cors());
app.use(express.json());

/*
 * The Proxy Package will route requests coming to these -
 * end point to respective microservices
 */

app.use(
  "/api/users",
  //proxy(`${USER_SERVICE_END_POINT}:${_ENV_USER_SERVICE_PORT}`)
  proxy(`${USER_SERVICE_END_POINT}:32424`)
);
app.use(
  "/api/customers",
  //proxy(`${CUSTOMER_SERVICE_END_POINT}:${_ENV_CUSTOMER_SERVICE_PORT}`)
  proxy(`${CUSTOMER_SERVICE_END_POINT}:30598`)
);
app.use(
  "/api/enrollment",
  //proxy(`${ENROLLMENT_SERVICE_END_POINT}:${_ENV_ENROLLMENT_SERVICE_PORT}`)
  proxy(`${ENROLLMENT_SERVICE_END_POINT}:32606`)
);
app.use(
  "/api/courses",
  //proxy(`${COURSE_SERVICE_END_POINT}:${_ENV_COURSE_SERVICE_PORT}`)
  proxy(`${COURSE_SERVICE_END_POINT}:31900`)
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade"); // Or another policy as needed
  next();
});

const APP_PORT = APPLICATION_PORT || 8880;

app.listen(APP_PORT, () => {
  console.log(`IP ||   ${COURSE_SERVICE_END_POINT}`);
  console.log(`PORT ||  31900  `);
  console.log(`Gateway running on ${APP_PORT}`);
});
