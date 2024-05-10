const Joi = require('joi')

const productSchema = Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().integer().min(1).required(),
});

const createOrderSchema = Joi.object({
    address_id: Joi.number().integer().allow(null),
    delivery_type_id: Joi.number().integer().required(),
    payment_id: Joi.string().allow(null),
    total_product_amount: Joi.number().required(),
    advance_payment: Joi.number().allow(null),
    products: Joi.array().items(productSchema).min(1).required(),
    total_amount: Joi.number().required(),
});




module.exports = {
    createOrderSchema,
}