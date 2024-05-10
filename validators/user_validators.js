const Joi = require('joi')

const reset_password_from_profile = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
})


module.exports = {
    reset_password_from_profile
}