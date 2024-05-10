const { Op } = require("sequelize");
const { sendError, sendSuccess, make_hash, validatePhoneNumber, validateEmail, check_hash, makeToken, makeRefreshToken, checkToken, isValid, uploadFile } = require("../helpers");
const {
    Users, UserRoles, School,
} = require("../models");
const Categories = require("../models/categories");
const Products = require("../models/products");
const Carts = require("../models/carts");
const ProductImages = require("../models/productimages");
const ProductAttributeAssociations = require("../models/productattributeassociations");
const AttributeCombinations = require("../models/attributecombinations");
const Attributes = require("../models/attributes");


// const addToCart = async (req, res) => {
//     try {
//         const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
//         const allowed_user = ['USER']
//         if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
//             const { product_id, quantity } = req.payload;

//             const available_product = await Products.findOne({
//                 where: {
//                     id: product_id,
//                     // status: true,
//                 },
//                 raw: true
//             });

//             if (!available_product) {
//                 return sendError(res, 404, 'Product not found.')
//             }

//             const isUserRole = await UserRoles.findOne({
//                 where: {
//                     name: 'USER'
//                 },
//                 raw: true
//             })

//             const isAvailableUser = await Users.findOne({
//                 where: {
//                     id: user.id,
//                     role_id: isUserRole.id
//                 }
//             })

//             if (!isAvailableUser) {
//                 return sendError(res, 404, 'User not found.')
//             }

//             const cartQuantity = quantity ? quantity : 1;

//             const existingProduct = await Carts.findOne({
//                 where: {
//                     user_id: user.id,
//                     product_id
//                 }
//             });

//             if (existingProduct) {
//                 await Carts.update({
//                     quantity: cartQuantity
//                 });
//                 return sendSuccess(res, 'Product added to cart successfully.')
//             } else {
//                 await Carts.create({
//                     user_id: user.id,
//                     product_id,
//                     quantity: cartQuantity
//                 });
//                 return sendSuccess(res, 'Product added to cart successfully.')
//             }


//         } else if (user == 'Session expired') {
//             return sendError(res, 404, user)
//         } else {
//             return sendError(res, 403, 'You dont have permission for this action.')
//         }
//     } catch (error) {
//         console.log(error);
//         return sendError(res, 400, 'Something went wrong.')
//     }
// }

const addToCart = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers['authorization'])
        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const { product_id, quantity, attribute_id } = req.payload;

            const available_product = await Products.findOne({
                where: {
                    id: product_id,
                    // status: true,
                },
                raw: true
            });

            if (!available_product) {
                return sendError(res, 404, 'Product not found.')
            }

            if (available_product.stock === 0) {
                return sendError(res, 400, 'Product out of stock.')
            }

            const isUserRole = await UserRoles.findOne({
                where: {
                    name: 'USER'
                },
                raw: true
            })

            const isAvailableUser = await Users.findOne({
                where: {
                    id: user.id,
                    role_id: isUserRole.id
                }
            })

            if (!isAvailableUser) {
                return sendError(res, 404, 'User not found.')
            }

            const cartQuantity = quantity ? quantity : 1;

            const existingProduct = await Carts.findOne({
                where: {
                    user_id: user.id,
                    product_id,
                }
            });

            if (existingProduct) {
                const newQuantity = existingProduct.quantity + cartQuantity;
                if (newQuantity > available_product.stock) {
                    return sendError(res, 400, 'Product out of stock.');
                }
                await Carts.update({
                    quantity: newQuantity
                }, {
                    where: {
                        user_id: user.id,
                        product_id,
                        attribute_id
                    }
                });
                return sendSuccess(res, 'Product quantity updated in cart successfully.')
            } else {
                if (cartQuantity > available_product.stock) {
                    return sendError(res, 400, 'Product out of stock.');
                }
                await Carts.create({
                    user_id: user.id,
                    product_id,
                    quantity: cartQuantity,
                    attribute_id
                });
                return sendSuccess(res, 'Product added to cart successfully.')
            }


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

const getCart = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ['USER'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {

            let products = [];
            let totalPrice = 0;




            const cartItems = await Carts.findAll({
                where: {
                    user_id: user.id
                },


                include: [
                    {
                        model: Products,
                        include: {

                            model: ProductAttributeAssociations,
                            // include: [
                            //     {
                            //         model: AttributeCombinations,
                            //         include: [
                            //             {
                            //                 model: Attributes,
                            //             }
                            //         ]
                            //     }
                            // ]

                        }
                        // where: {
                        //     status: true
                        // }
                    }
                ],
            });

            for (const cartItem of cartItems) {
                const product = await Products.findOne({
                    where: {
                        id: cartItem.product.id,
                        status: true
                    }
                });

                if (product) {
                    products.push(product);
                }
            }


            const images = await ProductImages.findAll({
                where: {
                    product_id: cartItems.map(product => product.product.id),
                    // status: 1,
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

            const cartItemsWithImages = cartItems.map(cartItem => {
                return {
                    ...cartItem.toJSON(),
                    images: imagesMap[cartItem.product.id] || []
                };
            });

            cartCount = cartItems.length;

            for (const cartItem of cartItems) {
                const product = await Products.findOne({
                    where: {
                        id: cartItem.product.id,
                        // status: true
                    }
                });

                if (product) {
                    let itemPrice = product.price;
                    totalPrice += itemPrice * cartItem.quantity;
                }
            }


            return sendSuccess(res, 'Cart fetched successfully', {
                totalPrice,
                cartCount,
                cartItems: cartItemsWithImages
            })
        } else if (user == 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, 'You dont have permission for this action.')
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 400, 'Something went wrong.')
    }
};

const handleIncrement = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ['USER'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const { product_id } = req.payload;

            const existingProduct = await Carts.findOne({
                where: {
                    user_id: user.id,
                    product_id
                }
            });
            if (!existingProduct) {
                return sendError(res, 400, "Product not found in cart");
            }

            const availableProduct = await Products.findOne({
                where: {
                    id: product_id,
                    // status: true,
                },
                raw: true
            });

            if (!availableProduct) {
                return sendError(res, 400, "Product not found");
            }

            const totalQuantityInCart = existingProduct.quantity;

            const remainingStock = availableProduct.stock - totalQuantityInCart;

            if (remainingStock <= 0) {
                return sendError(res, 400, "Product out of stock");
            }

            existingProduct.quantity += 1;
            await existingProduct.save()

            return sendSuccess(res, "Product incremented successfully");

        } else if (user == 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, "You don't have permission for this action.")
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Something went wrong");
    }
};

const handleDecrement = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ['USER'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const { product_id } = req.payload;

            const existingProduct = await Carts.findOne({
                where: {
                    user_id: user.id,
                    product_id
                }
            });

            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                    await existingProduct.save();
                    return sendSuccess(res, "Product decremented successfully");
                } else {
                    await existingProduct.destroy();
                    return sendSuccess(res, "Product removed from cart");
                }
            }



        } else if (user == 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, "You don't have permission for this action.")
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Something went wrong");
    }
};

const removeFromCart = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ['USER'];
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {

            const { product_id } = req.payload;

            const existingProduct = await Products.findOne({
                where: {
                    id: product_id
                }
            });

            if (!existingProduct) {
                return sendError(res, 400, "Product not found");
            }

            const availableProduct = await Carts.findOne({
                where: {
                    user_id: user.id,
                    product_id
                }
            });

            if (!availableProduct) {
                return sendError(res, 400, "Product not found in cart");
            }

            await Carts.destroy({
                where: {
                    user_id: user.id,
                    product_id: product_id
                }
            });

            return sendSuccess(res, "Product removed from cart");

        } else if (user === 'Session expired') {
            return sendError(res, 401, user)
        } else {
            return sendError(res, 403, "You don't have permission for this action.")
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Something went wrong");
    }
};

module.exports = {
    addToCart,
    getCart,
    handleIncrement,
    handleDecrement,
    removeFromCart
}