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


const similarProducts = async (req, res) => {
    try {
        const { product_id } = req.query;

        const { category_id, sub_category_id } = await Products.findByPk(product_id, {
            attributes: ['category_id', 'sub_category_id']
        });
        const products = await Products.findAll({
            where: {
                id: {
                    [Op.ne]: product_id
                },
                category_id,
                sub_category_id
            },
            include: [
                {
                    model: Categories,
                }
            ],
            raw: true,
            nest: true,
            mapToModel: true
        });

        const images = await ProductImages.findAll({
            where: {
                product_id: products.map(product => product.id),
            },
            attributes: ['id', 'product_id', 'image_url'],
            raw: true,
        });

        const imagesMap = images.reduce((acc, image) => {
            const { product_id } = image;
            if (!acc[product_id]) {
                acc[product_id] = [];
            }
            acc[product_id].push(image);
            return acc;
        }, {});

        products.forEach(product => {
            const productId = product.id;
            product.images = imagesMap[productId] || [];
        });
        return sendSuccess(res, 'Products fetched successfully.', products)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}

module.exports = {
    similarProducts
}