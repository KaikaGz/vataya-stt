const Joi = require("joi");

const post = {
  body: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    fullname: Joi.string().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    faculty: Joi.number().required(),
    role: Joi.number().required(),
    // user_status: Joi.number(),
  }),
};

const logIn = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),
};

// const put = {
//   body: Joi.object().keys({
//     user_id: Joi.number().required(),
//     email: Joi.string(),
//     name: Joi.string(),
//     hospital_id: Joi.number(),
//     role: Joi.string().valid('user', 'nurse', 'admin', 'doctor'),
//   }),
// };

module.exports = {
  post,
  // put,
  logIn,
};
