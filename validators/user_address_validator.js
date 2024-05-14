const Joi = require("joi");

const add_address_payload = Joi.object({
  full_name: Joi.string().required(),
  mobile: Joi.string().required(),
  add1: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.string().required(),
  area: Joi.string().required(),
  landmark: Joi.string().required(),
});

const fetch_address_payload = Joi.object({
  id: Joi.number().integer().allow(null),
  category_name: Joi.string().allow(null),
});

const single_address_param = Joi.object({
  address_id: Joi.number().integer().required(),
});

const edit_address_payload = Joi.object({
  full_name: Joi.string().required(),
  mobile: Joi.string().required(),
  add1: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.string().required(),
  area: Joi.string().required(),
  landmark: Joi.string().required(),
});

module.exports = {
  add_address_payload,
  fetch_address_payload,
  single_address_param,
  edit_address_payload,
};
