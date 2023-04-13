const Joi = require('joi').extend(require('@joi/date'));

const post = {
  body: Joi.object().keys({
    confidence: Joi.number().required(),
    hub_id: Joi.number().required(),
    camera_id: Joi.number().required(),
    image: Joi.string().required(),
    class_id: Joi.number().required(),
    created_at: Joi.number().required(),
  }),
};

const getEvent = {
  body: Joi.object().keys({
    limit: Joi.number(),
    page: Joi.number(),
    class_id: Joi.number(),
    camera_id: Joi.number(),
    hub_id: Joi.number(),
    confidence: Joi.number(),
    date: Joi.array().items(Joi.date().format('YYYY-MM-DD')).length(2),
  }),
};

const getDaily = {
  body: Joi.object().keys({
    date: Joi.array().items(Joi.date().format('YYYY-MM-DD')).length(2).required(),
  }),
};
module.exports = {
  post,
  getEvent,
  getDaily,
};
