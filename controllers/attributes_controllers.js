const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");
const Products = require("../models/products");
const Carts = require("../models/carts");
const ProductImages = require("../models/productimages");
const Banners = require("../models/banners");
const BannerProductsAssociations = require("../models/bannerproductsassociations");
const Attributes = require("../models/attributes");


const getAttributes = async (req, res) => {
    try {
        const {
            id,
            attribute_name
        } = req.query
        let filter = {}
        if (id) filter = {
            ...filter,
            id
        }
        if (attribute_name) filter = {
            ...filter,
            attribute_name
        }

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            const attributes = await Attributes.findAll({
                where: filter,
                raw: true,
                order: [['createdAt', 'DESC']] 
            })
            return sendSuccess(res, 'Attributes fetched successfully.', attributes)
                
        } else if (user === 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
};

const addAttributes = async (req, res) => {
    try {
        const { attribute_name } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            const existingAttribute = await Attributes.findOne({
                where: {
                    attribute_name,
                },
                raw: true
            });

            if (existingAttribute) {
                return sendError(res, 400, 'Attribute already exists.');
            }

            const newAttribute = await Attributes.create({
                attribute_name,
                status: true
            });

            return sendSuccess(res, 'Attribute created successfully.', newAttribute)

        } else if (user === 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }

    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
};

const editAttributes = async (req, res) => {
    try {
        const { attribute_id, attribute_name } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            const existingAttribute = await Attributes.findOne({
                where: {
                    id: attribute_id,
                },
            });

            if (!existingAttribute) {
                return sendError(res, 404, 'Attribute not found');
            }

            const existingNameAttribute = await Attributes.findOne({
                where: {
                    attribute_name
                },
            });

            if (existingNameAttribute) {
                return sendError(res, 400, 'Attribute name already exists.');
            }

            if (attribute_name) {
                existingAttribute.attribute_name = attribute_name;
            }

            await existingAttribute.save();

            return sendSuccess(res, 'Attribute updated successfully.', existingAttribute)
        } else if (user === 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
}

const deleteAttribute = async (req, res) => {
    try {
        const { attribute_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            if (!Number.isInteger(attribute_id) || attribute_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid attribute_id",
                    })
                    .code(200);
            }

            const existingAttribute = await Attributes.findOne({
                where: {
                    id: attribute_id,
                },
            });

            if (!existingAttribute) {
                return sendError(res, 404, 'Attribute not found');
            }
            await existingAttribute.destroy();

            return sendSuccess(res, 'Attribute deleted successfully');
        } else if (user === 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }

    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
};

const toggleAttributeStatus = async (req, res) => {
    try {
        const { attribute_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            if (!Number.isInteger(attribute_id) || attribute_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid attribute_id",
                    })
                    .code(200);
            }

            const existingAttribute = await Attributes.findOne({
                where: {
                    id: attribute_id,
                },
            });

            if (!existingAttribute) {
                return sendError(res, 404, 'Attribute not found');
            }

            existingAttribute.status = !existingAttribute.status;

            await existingAttribute.save();

            return sendSuccess(res, 'Attribute status updated successfully');
        } else if (user === 'Session expired') {
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
    getAttributes,
    addAttributes,
    editAttributes,
    deleteAttribute,
    toggleAttributeStatus
}