const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");
const UserAddresses = require("../models/useraddresses");


const addAddress = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                fullname,
                mobile,
                add1,
                add2,
                city,
                state,
                country,
                pincode,
                area,
                landmark,
            } = req.payload

            const isUserAvailable = await Users.findOne({
                where: {
                    id: user.id,
                },
                raw: true
            });
            if (!isUserAvailable) return sendError(res, 409, 'User not found.');

            const newAddress = await UserAddresses.create({
                user_id: user.id,
                fullname,
                mobile,
                add1,
                add2,
                city,
                state,
                country,
                pincode,
                area,
                landmark
            });

            return sendSuccess(res, 'Address saved successfully.', newAddress)
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

const fetchAllAddress = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const isUserAvailable = await Users.findOne({
                where: {
                    id: user.id,
                },
                raw: true
            })
            if (!isUserAvailable) return sendError(res, 409, 'User not found.')

            const address = await UserAddresses.findAll({
                where: {
                    user_id: user.id
                },
                raw: true
            })
            return sendSuccess(res, 'Address fetched successfully.', address)
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        }
        else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}

const editAddress = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                address_id
            } = req.params
            const {
                full_name,
                mobile,
                add1,
                add2,
                city,
                state,
                country,
                pincode,
                area,
                landmark
            } = req.payload
            const isUserAvailable = await Users.findOne({
                where: {
                    id: user.id,
                },
                raw: true
            });
            if (!isUserAvailable) return sendError(res, 409, 'User not found.');

            await UserAddresses.update({
                fullname:full_name,
                mobile,
                add1,
                add2,
                city,
                state,
                country,
                pincode,
                area,
                landmark
            }, {
                where: {
                    id: address_id
                }
            });
            return sendSuccess(res, 'Address updated successfully.')
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

const deleteAddress = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                address_id
            } = req.params
            const isUserAvailable = await Users.findOne({
                where: {
                    id: user.id,
                },
                raw: true
            });
            if (!isUserAvailable) return sendError(res, 409, 'User not found.');
            await UserAddresses.destroy({
                where: {
                    id: address_id
                }
            });
            return sendSuccess(res, 'Address deleted successfully.')
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
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAddress
}