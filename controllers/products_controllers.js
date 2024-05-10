const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");
const Products = require("../models/products");
const ProductImages = require("../models/productimages");
const { sequelize } = require("../config");
const SubCategories = require("../models/subcategories");
const ProductAttributeAssociations = require("../models/productattributeassociations");
const AttributeCombinations = require("../models/attributecombinations");
const Attributes = require("../models/attributes");


const createProduct = async (req, res) => {
    const transact = await sequelize.transaction();
    try {
        const user = await checkToken(req.headers['authorization'] || req.headers['Authorization']);
        const allowed_user = ['ADMIN'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                product_name,
                description,
                price,
                stock,
                category_id,
                sub_category_id,
                image_count
            } = req.payload;

            const combinations = JSON.parse(req.payload.combinations)

            const existingProduct = await Products.findOne({ where: { product_name }, raw: true, order: [['createdAt', 'DESC']] });
            if (existingProduct) {
                return sendError(res, 409, 'Product already exists.');
            }

            const isAvailableCategory = await Categories.findOne({ where: { id: category_id } });
            if (!isAvailableCategory) return sendError(res, 404, 'Category not found.');

            const isAvailableSubCategory = await SubCategories.findOne({ where: { id: sub_category_id } });
            if (!isAvailableSubCategory) return sendError(res, 404, 'Sub Category not found.');

            let image_url_list = [];
            if (image_count) {
                for (let i = 1; i <= image_count; i++) {
                    const { file_url } = await uploadFile(req, req.payload[`image_${i}`], 'uploads/products/');
                    image_url_list.push({ image_url: file_url });
                }
            }

            const newProduct = await Products.create({
                product_name,
                description,
                price,
                category_id,
                sub_category_id,
                stock,
                status: true
            });

            for (const combination of combinations) {
                const createdCombination = await ProductAttributeAssociations.create({
                    price: combination.price,
                    stock: combination.stock,
                    product_id: newProduct.id,
                    combination: combination.combination_name
                }, { transaction: transact });

                for (const attributeCombination of combination.combinations) {
                    await AttributeCombinations.create({
                        combination_id: createdCombination.id,
                        attribute_id: attributeCombination.attribute_id,
                        attribute_value: attributeCombination.attribute_value
                    }, { transaction: transact });
                }
            }

            const image_url_data = image_url_list.map((e) => ({ ...e, product_id: newProduct.id }));

            const image_data = await Promise.all(image_url_data);

            await ProductImages.bulkCreate(image_data, { transaction: transact });

            await transact.commit();

            return sendSuccess(res, 'Product created successfully.', newProduct);
        } else if (user === 'Session expired') {
            return sendError(res, 404, user);
        } else {
            return sendError(res, 403, 'You dont have permission for this action.');
        }
    } catch (error) {
        console.log(error);
        await transact.rollback();
        return sendError(res, 400, 'Something went wrong.');
    }
};

const fetchProductsAdmin = async (req, res) => {
    try {
        const user = await checkToken(req.headers['authorization'] || req.headers['Authorization']);
        const allowed_user = ['ADMIN'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const products = await Products.findAll({
                include: [{
                    model: Categories,
                }, {
                    model: SubCategories,
                }],
                raw: true,
                nest: true,
                mapToModel: true
            });
            return sendSuccess(res, 'Products fetched successfully.', products)
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

const fetchProductsCustomer = async (req, res) => {
    try {

        const {
            category_id,
            sub_category_id,
            product_name,
            product_id
        } = req.query;

        let whereCondition = {};

        if (category_id) {
            whereCondition.category_id = category_id;
        }

        if (sub_category_id) {
            whereCondition.sub_category_id = sub_category_id;
        }

        if (product_name) {
            whereCondition.product_name = product_name
        }

        if (product_id) {
            whereCondition.id = product_id
        }

        const products = await Products.findAll({
            where: whereCondition,
            include: [
                {
                    model: Categories,
                }, {
                    model: SubCategories,
                },
                {
                    model: ProductAttributeAssociations,
                    include: [
                        {
                            model: AttributeCombinations,
                            include: [
                                {
                                    model: Attributes,
                                }
                            ]
                        }
                    ]
                }, {
                    model: ProductImages,
                    attributes: ['id', 'product_id', 'image_url'],
                    as: 'images'
                }
            ],
            // raw: true,
            // nest: true,
            // mapToModel: true
        });

        return sendSuccess(res, 'Products fetched successfully.', products)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}


const getFeatureProduct = async (req, res) => {
    try {
        const products = await Products.findAll({
            where: {
                is_featured: true
            },

            include: [{
                model: Categories,
            }, {
                model: SubCategories,
            }],
            order: [['id', 'DESC']],
            limit: 10,
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

        return sendSuccess(res, 'Featured Products fetched successfully.', products)

    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}

const addProductToFeature = async (req, res) => {
    try {
        const user = await checkToken(req.headers['authorization'] || req.headers['Authorization']);

        const allowed_user = ['ADMIN'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const { product_id } = req.query;
            const product = await Products.findOne({
                where: {
                    id: product_id
                }
            });
            if (!product) {
                return sendError(res, 404, 'Product not found');
            }

            if (product.is_featured) {
                product.is_featured = false;
            } else {
                product.is_featured = true;
            }
            await product.save();

            const successMessage = product.is_featured ? 'Product added to featured successfully.' : 'Product removed from featured successfully.';

            return sendSuccess(res, successMessage);

        } else if (user == 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.');
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.');
    }
}

const deleteProduct = async (req, res) => {
    try {

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            const { product_id } = req.query;
            const existingProduct = await Products.findByPk(product_id);

            if (!existingProduct) {
                return sendError(res, 404, 'Product not found');
            }

            await existingProduct.destroy();

            return sendSuccess(res, 'Product deleted successfully.');

        } else if (user == 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.');
        }

    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
};

const toggleProductStatus = async (req, res) => {
    try {

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'Chimmi Garments') {
            const { product_id } = req.query;
            if (!Number.isInteger(product_id) || product_id <= 0) {
                return sendError(res, 400, 'Invalid product id');
            }

            const existingProduct = await Products.findOne({
                where: {
                    id: product_id,
                },
            });

            if (!existingProduct) {
                return sendError(res, 404, 'Product not found');
            }

            existingProduct.status = !existingProduct.status;

            await existingProduct.save();

            return sendSuccess(res, 'Product status updated successfully.');
        } else if (user == 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.');
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.');
    }
};

module.exports = {
    createProduct,
    fetchProductsAdmin,
    fetchProductsCustomer,
    getFeatureProduct,
    addProductToFeature,
    deleteProduct,
    toggleProductStatus
}