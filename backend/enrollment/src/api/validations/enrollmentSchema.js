const Joi = require("joi");

const enrollmentValidationSchema = Joi.object({
  course_id: Joi.number().min(0).required(),
  payment_method: Joi.string().required(),
});

module.exports = enrollmentValidationSchema;
