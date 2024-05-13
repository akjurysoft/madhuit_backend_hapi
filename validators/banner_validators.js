const Joi = require("joi");

const add_to_banner_payload = Joi.object({
  banner_name: Joi.string().required(),
  // banner_type: Joi.string().valid('product', 'category').allow(null),
  category_id: Joi.number().integer().positive().allow(null),
  sub_category_id: Joi.number().integer().positive().allow(null),
  product_ids: Joi.string().allow(null).allow(""),
  banner_url: Joi.any().required(),
});

module.exports = {
  add_to_banner_payload,
};
