const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");


const createCategory = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                category_name,
                image
            } = req.payload
            const existingCategory = await Categories.findOne({
                where: {
                    category_name,
                },
                raw: true
            });
            if (existingCategory) return sendError(res, 409, 'Category already exists.');

            const { file_url } = await uploadFile(req, image, 'uploads/categories/')

            const newCategory = await Categories.create({
                category_name,
                image_url: file_url,
                status: true
            });
            return sendSuccess(res, 'Category created successfully.', newCategory)
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

const fetchCategory = async (req, res) => {
    try {
        const {
            id,
            category_name
        } = req.query
        let filter = {
            status: true
        }
        if (id) filter = {
            ...filter,
            id
        }
        if (category_name) filter = {
            ...filter,
            category_name
        }
        const categories = await Categories.findAll({
            where: filter,
            raw: true
        })
        return sendSuccess(res, 'Categories fetched successfully.', categories)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}





module.exports = {
    createCategory,
    fetchCategory
}