const Joi = require("joi");

const type_of_user = Joi.object({
    type: Joi.string().valid("CUSTOMER", "DEALER").required(),
});

const add_to_wishlist_payload = Joi.object({
    product_id: Joi.number().integer().required()
});

const remove_from_wishlist_payload = Joi.object({
    product_id: Joi.number().integer().required(),
});


module.exports = {
    type_of_user,
    add_to_wishlist_payload,
    remove_from_wishlist_payload
};