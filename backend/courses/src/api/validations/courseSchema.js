const Joi = require("joi");

const courseValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  learning_outcomes: Joi.any(),
  course_inclusions: Joi.any(),
  is_certified: Joi.any(),
  author: Joi.string().required(),
  price: Joi.string().required(),
  status: Joi.number().max(1).required(),
  rating: Joi.number().min(0).required(),
  total_enrollments: Joi.number().min(0).required(),
  course_content: Joi.string().required(),
});

module.exports = courseValidationSchema;
