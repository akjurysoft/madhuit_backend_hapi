const Joi = require('joi')

const single_student_param = Joi.object({
    school_id: Joi.string().required(),
    student_id: Joi.string().required(),
})

const single_school_students_param = Joi.object({
    school_id: Joi.string().required(),
})


const student_adding_payload = Joi.object({
    school_id: Joi.number().integer().required(),
    student_name: Joi.string().required(),
    student_gender: Joi.string().required(),
    student_class: Joi.string().required(),
    student_section: Joi.string().required(),
    student_roll_no: Joi.string().required(),
    student_unique_id: Joi.string().required(),
})

module.exports = {
    single_student_param,
    single_school_students_param,
    student_adding_payload
}