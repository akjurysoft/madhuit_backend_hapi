// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Orders"];
const {
    SchoolControllers, CategoryControllers, OrdersControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators, OrdersValidators } = require('../validators');

const orders_routes = [
    {
        method: "GET",
        path: "/order/get-order-admin",
        options: {
            description: "Get Orders by Admin.",
            tags,
            validate: {
                headers: headerValidator,
            },
            handler: OrdersControllers.getAllOrdersAdmin,
        },
    },
    {
        method: "GET",
        path: "/order/get-order",
        options: {
            description: "Get Orders by User.",
            tags,
            validate: {
                headers: headerValidator,
            },
            handler: OrdersControllers.getAllOrdersUser,
        },
    },
    {
        method: "POST",
        path: "/order/place",
        options: {
            description: "Place order by User",
            tags,
            validate: {
                headers: headerValidator,
                payload: OrdersValidators.createOrderSchema
            },
            handler: OrdersControllers.createOrder,
        },
    },

    {
        method: "GET",
        path: "/order/status",
        options: {
            description: "Get all order status.",
            tags,
            validate: {
                // headers: headerValidator,
            },
            handler: OrdersControllers.getAllOrderStatus,
        },
    }
   
]

module.exports = orders_routes