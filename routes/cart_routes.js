// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Cart"];
const {
    SchoolControllers, CategoryControllers, CartsControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators, CartValidators } = require('../validators');

const cart_routes = [
    {
        method: "POST",
        path: "/cart/add",
        options: {
            description: "Add to cart by user.",
            tags,
            validate: {
                headers: headerValidator,
                payload: CartValidators.add_to_cart_payload
            },
            handler: CartsControllers.addToCart,
        },
    },
    {
        method: "GET",
        path: "/carts",
        options: {
            description: "Get all carts items by user.",
            tags,
            validate: {
                headers: headerValidator,
                // payload: CartValidators.add_to_cart_payload
            },
            handler: CartsControllers.getCart,
        },
    },

    {
        method: "POST",
        path: "/carts/increment",
        options: {
            description: "Handle Increment cart by user.",
            tags,
            validate: {
                headers: headerValidator,
                payload: CartValidators.handle_increament_payload
            },
            handler: CartsControllers.handleIncrement,
        },
    },

    {
        method: "POST",
        path: "/carts/decrement",
        options: {
            description: "Handle Decrement cart by user.",
            tags,
            validate: {
                headers: headerValidator,
                payload: CartValidators.handle_decrement_payload
            },
            handler: CartsControllers.handleDecrement,
        },
    },

    {
        method: "POST",
        path: "/carts/remove",
        options: {
            description: "Product Remove from cart by user.",
            tags,
            validate: {
                headers: headerValidator,
                payload: CartValidators.remove_from_cart_payload
            },
            handler: CartsControllers.removeFromCart,
        },
    },
]

module.exports = cart_routes