const Joi = require('joi')

const create_product_payload = Joi.object({
    product_name: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    sub_category_id: Joi.number().integer().allow(null),
    price: Joi.number().integer().required(),
    stock: Joi.number().integer().required(),
    description: Joi.string().required(),
    image_count: Joi.number().integer().allow(null),
    combinations: Joi.string().allow('')
}).unknown()


const fetch_all_product = Joi.object({
    category_id: Joi.number().integer().positive().allow(''),
    sub_category_id: Joi.number().integer().positive().allow(''),
    product_name: Joi.string().max(255).allow(''),
    product_id: Joi.number().integer().positive().allow(''),
})

const get_similar_products = Joi.object({
    product_id: Joi.number().integer().positive().required(),
})

const add_product_to_feature = Joi.object({
    product_id: Joi.number().integer().positive().required(),
})


const delete_product_param = Joi.object({
    product_id: Joi.number().integer().positive().required(),
})

const toggle_product_status_param = Joi.object({
    product_id: Joi.number().integer().positive().required(),
})


module.exports = {
    create_product_payload,
    fetch_all_product,
    get_similar_products,
    add_product_to_feature,
    delete_product_param,
    toggle_product_status_param
}