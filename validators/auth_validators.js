const Joi = require('joi')


const user_register_payload = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().required()
})
const user_login_payload = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})


module.exports = {
    user_register_payload,
    user_login_payload
}