const Joi = require("joi");

const userValidationSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required(),
});

module.exports = userValidationSchema;
