const Joi = require('joi')

const create_school_payload = Joi.object({
    name: Joi.string().required(),
    unique_id: Joi.string().required(),
})


const update_school_payload = Joi.object({
    name: Joi.string().required(),
})


const single_school_param = Joi.object({
    school_id: Joi.string().required(),
})


module.exports = {
    create_school_payload,
    single_school_param,
    update_school_payload
}