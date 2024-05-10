const Joi = require('joi')

const create_sub_category_payload = Joi.object({
    category_id: Joi.number().integer().required(),
    sub_category_name: Joi.string().required(),
    image: Joi.any().required(),
})


const fetch_single_sub_category_param = Joi.object({
    id: Joi.number().integer().allow(null),
    category_id: Joi.number().integer().allow(null),
    sub_category_name: Joi.string().allow(null),
})


const edit_sub_category_payload = Joi.object({
    category_id: Joi.number().integer().required(),
    sub_category_id: Joi.number().integer().required(),
    sub_category_name: Joi.string().required(),
    image: Joi.any(),
})

const delete_sub_category_param = Joi.object({
    sub_category_id: Joi.number().integer().required(),
})

const toggle_sub_category_status_param = Joi.object({
    sub_category_id: Joi.number().integer().required(),
})



module.exports = {
    create_sub_category_payload,
    fetch_single_sub_category_param,
    edit_sub_category_payload,
    delete_sub_category_param,
    toggle_sub_category_status_param,
}