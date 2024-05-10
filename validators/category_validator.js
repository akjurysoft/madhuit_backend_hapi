const Joi = require('joi')

const create_category_payload = Joi.object({
    category_name: Joi.string().required(),
    image: Joi.any().required(),
})


const fetch_single_category_param = Joi.object({
    id: Joi.number().integer().allow(null),
    category_name: Joi.string().allow(null),
})



module.exports = {
    create_category_payload,
    fetch_single_category_param
}