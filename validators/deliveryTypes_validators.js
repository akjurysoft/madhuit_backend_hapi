const Joi = require("joi");

const addDeliveryTypes = Joi.object({
  delivery_type_name: Joi.string().required(),
});

module.exports = {
  addDeliveryTypes,
};
