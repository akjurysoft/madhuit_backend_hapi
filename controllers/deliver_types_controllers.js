const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");
const Products = require("../models/products");
const Carts = require("../models/carts");
const ProductImages = require("../models/productimages");
const DeliveryTypes = require("../models/deliverytypes");

const fetchDeliveryTypes = async (req, res) => {
    try {
        const delivery_types = await DeliveryTypes.findAll({
            raw: true
        })
        return sendSuccess(res, 'Delivery Types fetched successfully.', delivery_types)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}

module.exports = {
    fetchDeliveryTypes
}