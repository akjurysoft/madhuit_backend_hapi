// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Deliver Types"];
const {
    SchoolControllers, CategoryControllers, CartsControllers, DeliverTypesControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators, CartValidators } = require('../validators');

const delivery_type_routes = [
    {
        method: "GET",
        path: "/deliver-types",
        options: {
            description: "Get All Delivery Types.",
            tags,
            validate: {
                // headers: headerValidator,
                // payload: CartValidators.add_to_cart_payload
            },
            handler: DeliverTypesControllers.fetchDeliveryTypes,
        },
    },
]

module.exports = delivery_type_routes