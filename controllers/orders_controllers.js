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
const DeliveryTypes = require("../models/deliverytypes");
const OrderStatuses = require("../models/orderstatuses");
const Orders = require("../models/orders");
const OrderStatusLogs = require("../models/orderstatuslogs");
const Carts = require("../models/carts");
const OrderDetails = require("../models/orderdetails");


const getAllOrdersAdmin = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        const allowed_user = ['ADMIN']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const allOrders = await Orders.findAll({
                include: [
                    DeliveryTypes,
                    {
                        model: OrderStatuses,
                        as: 'order_status',
                        attributes: ['id', 'status_name', 'createdAt', 'updatedAt'],
                    },
                    {
                        model: OrderStatusLogs,
                        attributes: ['id', 'order_status_id', 'createdAt', 'updatedAt'],
                        include:[
                            {
                                model: OrderStatuses,
                                required: true
                            }
                        ]
                    },
                    {
                        model: OrderDetails,
                        include: [
                            {
                                model: Products,
                                include: [
                                    {
                                        model: ProductImages,
                                        as: 'images',
                                    }
                                ]
                            }
                        ],
                    }, 
                ],
            });
            
    
            // const images = await ProductImages.findAll({
            //     where: {
            //         product_id: allOrders.map(product => product.id),
            //         status: 1,
            //     },
            //     attributes: ['id', 'product_id' , 'image_url'],
            //     raw: true,
            // });
    
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: 'All orders fetched successfully',
                    orders: allOrders,
                })
                .code(200);
        }else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
                    message: "You dont have permission for this action.",
                })
                .code(200);
        }
    } catch (error) {
        console.error(error);
        return res
            .response({
                code: 500,
                status: 'error',
                message: 'Something went wrong',
            })
            .code(200);
    }
};

const getAllOrdersUser = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        const allowed_user = ['USER']
        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const allOrders = await Orders.findAll({
                where: {
                    user_id: user.id
                },
                include: [
                    DeliveryTypes,
                    {
                        model: OrderStatuses,
                        as: 'order_status',
                        attributes: ['id', 'status_name', 'createdAt', 'updatedAt'],
                    },
                    {
                        model: OrderStatusLogs,
                        attributes: ['id', 'order_status_id', 'createdAt', 'updatedAt'],
                        include:[
                            {
                                model: OrderStatuses,
                                required: true
                            }
                        ]
                    },
                    {
                        model: OrderDetails,
                        include: [
                            {
                                model: Products,
                                include: [
                                    {
                                        model: ProductImages,
                                        as: 'images',
                                    }
                                ]
                            }
                        ],
                    }, 
                ],
            });
            
    
            // const images = await ProductImages.findAll({
            //     where: {
            //         product_id: allOrders.map(product => product.id),
            //         status: 1,
            //     },
            //     attributes: ['id', 'product_id' , 'image_url'],
            //     raw: true,
            // });
    
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: 'All orders fetched successfully',
                    orders: allOrders,
                })
                .code(200);
        }else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
                    message: "You dont have permission for this action.",
                })
                .code(200);
        }
    } catch (error) {
        console.error(error);
        return res
            .response({
                code: 500,
                status: 'error',
                message: 'Something went wrong',
            })
            .code(200);
    }
};

const createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        const allowed_user = ['USER'];

        if (allowed_user.includes(user.role) && user.application === 'Chimmi Garments') {
            const {
                address_id,
                delivery_type_id,
                payment_id,
                total_product_amount,
                products,
                total_amount,
                advance_payment
            } = req.payload;

            const isAvalibelPending = await OrderStatuses.findOne({
                where: {
                    status_name: 'PENDING'
                }
            });

            if (!isAvalibelPending) {
                return sendError(res, 400, 'Order status not found.')
            }

            const isAvailibelDeliverType = await DeliveryTypes.findOne({
                where: {
                    id: delivery_type_id
                }
            });

            if (!isAvailibelDeliverType) {
                return sendError(res, 400, 'Delivery type not found.')
            }

            let pendingPayment = total_amount;
            if (isAvailibelDeliverType.delivery_type_name === 'ADVANCE PAYMENT') {
                pendingPayment = total_amount - advance_payment;
            }

            if (isAvailibelDeliverType.delivery_type_name === 'COD') {
                pendingPayment = total_amount;
            }

            if (isAvailibelDeliverType.delivery_type_name === 'FULL PAYMENT') {
                pendingPayment = 0;
            }

            const newOrder = await Orders.create({
                user_id: user.id,
                address_id: address_id,
                delivery_type_id: isAvailibelDeliverType.id,
                order_status_id: isAvalibelPending.id,
                total_product_amount,
                payment_id: payment_id ? payment_id : null,
                total_paid_amount: total_amount,
                pending_amountL: pendingPayment,
            }, {
                transaction: t
            });

            newOrder.order_id = `chimmi-${newOrder.id}`;
            await newOrder.save({
                transaction: t
            });

            for (const product of products) {
                await OrderDetails.create({
                    order_id: newOrder.id,
                    product_id: product.product_id,
                    quantity: product.quantity
                }, {
                    transaction: t
                });
            }

            await OrderStatusLogs.create({
                order_id: newOrder.id,
                order_status_id: newOrder.order_status_id,
            }, {
                transaction: t
            });

            await Carts.destroy({
                where: {
                    user_id: user.id
                }
            }, {
                transaction: t
            });

            await t.commit();
            const createdOrder = await Orders.findByPk(newOrder.id, {
                include: [OrderDetails],
            });

            return sendSuccess(res, 'Order created successfully', createdOrder);
        } else if (user == 'Session expired') {
            return sendError(res, 404, user)
        } else {
            return sendError(res, 403, "You don't have permission for this action.")
        }
    } catch (error) {
        console.error(error);
        await t.rollback();
        return sendError(res, 500, 'Something went wrong');
    }
}

const getAllOrderStatus = async (req, res) => {
    try {
        const orderStatuses = await OrderStatuses.findAll({
            raw: true
        })
        return sendSuccess(res, 'Order Status fetched successfully.', orderStatuses)
    } catch (error) {
        console.log(error);
        return sendError(res, 400, 'Something went wrong.')
    }
}

module.exports = {
    getAllOrdersAdmin,
    getAllOrdersUser,
    createOrder,
    getAllOrderStatus
}