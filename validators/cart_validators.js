const Joi = require('joi')

const add_to_cart_payload = Joi.object({
    product_id: Joi.number().integer().required(),
    attribute_id: Joi.number().integer(),
    quantity: Joi.number().integer().required(),
})


const handle_increament_payload = Joi.object({
    product_id: Joi.number().integer().required(),
});


const handle_decrement_payload = Joi.object({
    product_id: Joi.number().integer().required(),
});

const remove_from_cart_payload = Joi.object({
    product_id: Joi.number().integer().required(),
});



module.exports = {
    add_to_cart_payload,
    handle_increament_payload,
    handle_decrement_payload,
    remove_from_cart_payload
}