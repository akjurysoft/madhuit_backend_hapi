const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid } = require("../helpers");
const {
    Users, UserRoles
} = require("../models");



const register = async (req, res) => {
    try {
        const {
            fullname,
            email,
            mobile,
            password,
        } = req.payload
        if (!validateEmail(email)) {
            return sendError(res, 400, `${email} is NOT a valid email address.`);
        }
        if (!validatePhoneNumber(mobile)) {
            return sendError(res, 400, `${mobile} is NOT a valid mobile number.`);
        }
        const user_role = await UserRoles.findOne({
            where: {
                name: 'USER',
            },
            raw: true
        })
        if (!user_role) return sendError(res, 400, 'Registration is not available as user now.')
        const avl_user = await Users.findOne({
            where: {
                [Op.or]: {
                    email: email,
                    mobile: mobile
                },
                role_id: user_role.id
            },
            raw: true
        })
        if (avl_user && avl_user.email == email) return sendError(res, 409, 'Email is already registered. Try to login.')
        if (avl_user && avl_user.mobile == mobile) return sendError(res, 409, 'Mobile number is already registered. Try to login.')
        const created_user = await Users.create({
            fullname,
            email,
            mobile,
            password: make_hash(password),
            role_id: user_role.id
        })
        return sendSuccess(res, 'User registered successfully.', created_user)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}


const getUser = async (req, res) => {
    try {
        const user = await checkToken(req.headers['auth_token'] ? req.headers['auth_token'] : req.headers['Auth_token'])
        // const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['Authorization'])
        console.log(user)
        const allowed_user = ['ADMIN', 'USER']
        // const allowed_user = ['USER']

        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            return sendSuccess(res, 'User verified successfully.', user)
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
            console.log(avl_user);
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

const adminLogin = async (req, res) => {
    try {

        const {
            username,
            password
        } = req.payload

        const role = await UserRoles.findOne({
            where: {
                name: 'ADMIN'
            }
        })
        if (!role) {
            return sendError(res, 400, 'Registration is not available as admin now.')
        }

        const user = await Users.findOne({
            where: {
                [Op.or]: {
                    email: username,
                    mobile: username
                },
                role_id: role.id
            },
            raw: true
        })
        if (!user) return sendError(res, 404, 'User not found.')
        if (!check_hash(password, user.password)) return sendError(res, 401, 'Incorrect password.')

        const access_token = await makeToken({
            id: user.id,
            role: 'ADMIN',
            application: 'Chimmi Garments',
            email: user.email,
            mobile: user.mobile
        })
        const refresh_token = await makeRefreshToken({
            id: user.id,
            role: 'ADMIN',
            application: 'Chimmi Garments',
            email: user.email,
            mobile: user.mobile
        })

        await Users.update({
            access_token,
            refresh_token
        }, {
            where: {
                id: user.id
            }
        })

        return sendSuccess(res, 'Admin logged in successfully.', {
            access_token,
            refresh_token
        })

    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}


const login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.payload
        const user_role = await UserRoles.findOne({
            where: {
                name: 'USER',
            },
            raw: true
        })
        if (!user_role) return sendError(res, 400, 'Registration is not available as user now.')

        const user = await Users.findOne({
            where: {
                [Op.or]: {
                    email: username,
                    mobile: username
                },
                role_id: user_role.id
            },
            raw: true
        })
        if (!user) return sendError(res, 404, 'User not found.')
        if (!check_hash(password, user.password)) return sendError(res, 401, 'Incorrect password.')
        const access_token = await makeToken({
            id: user.id,
            role: 'USER',
            application: 'Chimmi Garments',
            email: user.email,
            mobile: user.mobile
        })
        const refresh_token = await makeRefreshToken({
            id: user.id,
            role: 'USER',
            application: 'Chimmi Garments',
            email: user.email,
            mobile: user.mobile
        })
        await Users.update({
            access_token,
            refresh_token
        }, {
            where: {
                id: user.id
            }
        })
        return sendSuccess(res, 'User logged in successfully.', {
            access_token,
            refresh_token
        })
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}


module.exports = {
    register,
    adminLogin,
    login,
    getUser,
    resetPassword
}