const Joi = require("joi");

const customerValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  full_name: Joi.string().required(),
  phone_no: Joi.any(),
  area_of_interests: Joi.any(),
  status: Joi.number().max(1).required(),
  role: Joi.string(),
});

module.exports = customerValidationSchema;
