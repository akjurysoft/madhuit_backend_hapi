const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid } = require("../helpers");
const {
    Users, UserRoles
} = require("../models");


const resetPassword = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                old_password,
                new_password,
                confirm_password
            } = req.payload
            const avl_user = await Users.findOne({
                where: {
                    id: user.id,
                },
                raw: true
            })
            if (avl_user && !check_hash(old_password, avl_user.password)) return sendError(res, 404, 'Enter a valid old password.')
            if (old_password === new_password) return sendError(res, 400, 'Old and new password cannot be same.')
            if (new_password !== confirm_password) return sendError(res, 400, 'New password and confirm password not matched.')
            await Users.update({ password: make_hash(new_password) }, {
                where: {
                    id: user.id
                }
            })
            return sendSuccess(res, 'User password updated successfully.')
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
    resetPassword
}