const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid } = require("../helpers");
const {
    Users, UserRoles, School, 
} = require("../models");


const createSchool = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                name,
                unique_id
            } = req.payload
            const avl_school_id = await School.findOne({
                where: {
                    unique_id
                },
                raw: true
            })
            if (avl_school_id) return sendError(res, 409, 'School with same unique id already exists.')
            await School.create({
                name,
                unique_id
            })
            return sendSuccess(res, 'School created successfully.',)
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}
const updateSchool = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                name
            } = req.payload
            const {
                school_id
            } = req.params
            const avl_school = await School.findOne({
                where: {
                    id: school_id
                },
                raw: true
            })
            if (!avl_school) return sendError(res, 404, 'School not found.')
            const avl_school_name = await School.findOne({
                where: {
                    name,
                    id: {
                        [Op.ne]: school_id
                    }
                },
                raw: true
            })
            if (avl_school_name) return  sendError(res, "409", "School with same name already exists.")
            await School.update({
                name
            }, {
                where: {
                    id: school_id
                }
            })
            return sendSuccess(res, 'School updated successfully.',)
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}
const fetchSchools = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN', 'USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const schools = await School.findAll({
                raw: true,
            })
            return sendSuccess(res, 'School fetched successfully.', schools)
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}
const fetchSingleSchool = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN', 'USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                school_id
            } = req.params
            const school = await School.findOne({
                where: {
                    id: school_id
                },
                raw: true,
            })
            return sendSuccess(res, 'School fetched successfully.', school)
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}
const deleteSingleSchool = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                school_id
            } = req.params
            const school = await School.findOne({
                where: {
                    id: school_id
                },
                raw: true,
            })
            if (!school) return sendError(res, 404, 'School not found.')
            await School.destroy({
                where: {
                    id: school_id
                }
            })
            return sendSuccess(res, 'School deleted successfully.',)
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}





module.exports = {
    createSchool,
    updateSchool,
    fetchSchools,
    deleteSingleSchool,
    fetchSingleSchool
}