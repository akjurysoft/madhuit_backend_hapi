// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Deliver Types"];

const { DeliverTypesControllers } = require("../controllers");

const { headerValidator, DeliveryTypesValidators } = require("../validators");

const delivery_type_routes = [
  {
    method: "GET",
    path: "/v1/delivery-types",
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
  {
    method: "POST",
    path: "/v1/delivery-types/:id",
    options: {
      description: "Create delivery types by admin.",
      tags,
      validate: {
        headers: headerValidator,
        payload: DeliveryTypesValidators.addDeliveryTypes,
      },
      handler: DeliverTypesControllers.fetchDeliveryTypes,
    },
  },
];

module.exports = delivery_type_routes;
