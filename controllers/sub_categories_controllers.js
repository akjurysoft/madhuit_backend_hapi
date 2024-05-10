const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");
const SubCategories = require("../models/subcategories");


const createSubCategory = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                category_id,
                sub_category_name,
                image
            } = req.payload

            const category = await Categories.findOne({
                where: {
                    id: category_id,
                    status: true
                }
            })

            if (!category) return sendError(res, 404, 'Category not found.')

            const existingSubCategory = await SubCategories.findOne({
                where: {
                    sub_category_name,
                },
                raw: true
            });
            if (existingSubCategory) return sendError(res, 409, 'Sub Category already exists.');

            const { file_url } = await uploadFile(req, image, 'uploads/subcategories/')

            const newSubCategory = await SubCategories.create({
                category_id,
                sub_category_name,
                image_url: file_url,
                status: true
            });
            return sendSuccess(res, 'Sub Category created successfully.', newSubCategory)
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

const fetchSubCategoryAdmin = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const subCategories = await SubCategories.findAll({
                include: [{
                    model: Categories,
                }],
                raw: true,
                nest: true,
                mapToModel: true
            })
            return sendSuccess(res, 'Sub Categories fetched successfully.', subCategories)
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

const fetchSubCategory = async (req, res) => {
    try {
        const {
            id,
            category_id,
            sub_category_name
        } = req.query
        let filter = {
            status: true
        }
        if (id) filter = {
            ...filter,
            id
        }
        if (category_id) filter = {
            ...filter,
            category_id
        }
        if (sub_category_name) filter = {
            ...filter,
            sub_category_name
        }
        const subCategories = await SubCategories.findAll({
            where: filter,
            include: [{
                model: Categories,
            }],
            raw: true,
            nest: true,
            mapToModel: true
        })
        return sendSuccess(res, 'Sub Categories fetched successfully.', subCategories)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}

const updateSubcategory = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {

            const {
                sub_category_id,
                sub_category_name,
                category_id,
                image
            } = req.payload

            const existingSubcategory = await SubCategories.findOne({
                where: {
                    id: sub_category_id,
                },
            });

            if (!existingSubcategory) {
                return sendError(res, 404, 'Subcategory not found');
            }
            const existingCategory = await Categories.findOne({
                where: {
                    id: category_id
                }
            })

            if (!existingCategory) return sendError(res, 404, 'Category not found.')

            if (sub_category_name) {
                existingSubcategory.sub_category_name = sub_category_name;
            }
            if (category_id) {
                existingSubcategory.category_id = category_id;
            }
            if (image) {
                const { file_url } = await uploadFile(req, image, 'uploads/subcategories/')
                existingSubcategory.image_url = file_url;
            }else {
                existingSubcategory.image_url = existingSubcategory.image_url;
            }


            await existingSubcategory.save();
            return sendSuccess(res, 'Subcategory updated successfully', existingSubcategory)


        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
}


const deleteSubcategory = async (req, res) => {
    try {
        const { sub_category_id } = req.params;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            const existingSubcategory = await SubCategories.findOne({
                where: {
                    id: sub_category_id,
                },
            });

            if (!existingSubcategory) {
                return sendError(res, 404, 'Subcategory not found');
            }

            await existingSubcategory.destroy();

            return sendSuccess(res, 'Subcategory deleted successfully');

        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }

    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
};

const toggleSubCategoryStatus = async (req, res) => {
    try {
        const { sub_category_id } = req.params;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            if (!Number.isInteger(sub_category_id) || sub_category_id <= 0) {
                return sendError(res, 400, 'Invalid sub category id');
            }

            const existingSubCategory = await SubCategories.findOne({
                where: {
                    id: sub_category_id,
                },
            });

            if (!existingSubCategory) {
                return sendError(res, 404, 'Subcategory not found');
            }

            existingSubCategory.status = !existingSubCategory.status;

            await existingSubCategory.save();

            return sendSuccess(res, 'Subcategory status updated successfully');
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }

    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
};


module.exports = {
    createSubCategory,
    fetchSubCategoryAdmin,
    fetchSubCategory,
    updateSubcategory,
    deleteSubcategory,
    toggleSubCategoryStatus
}