// describe routes here by creating objects inside the user_routes array
const tags = ["api", "User Address"];
const {
  SchoolControllers,
  CategoryControllers,
  UserAddressControllers,
} = require("../controllers");
const {
  headerValidator,
  SchoolValidators,
  CategoryValidators,
  UserAddressValidators,
} = require("../validators");

const address_routes = [
  {
    method: "POST",
    path: "/v1/address:id",
    options: {
      description: "Add a new Address by User.",
      tags,
      validate: {
        headers: headerValidator,
        payload: UserAddressValidators.add_address_payload,
      },
      handler: UserAddressControllers.addAddress,
    },
  },
  {
    method: "GET",
    path: "/v1/address",
    options: {
      description: "Get all Address by User.",
      tags,
      validate: {
        headers: headerValidator,
      },
      handler: UserAddressControllers.fetchAllAddress,
    },
  },
  {
    method: "PUT",
    path: "/v1/address/:id",
    options: {
      description: "Edit particular address by User.",
      tags,
      validate: {
        headers: headerValidator,
        payload: UserAddressValidators.edit_address_payload,
      },
      handler: UserAddressControllers.editAddress,
    },
  },

  {
    method: "DELETE",
    path: "/v1/address/:id",
    options: {
      description: "Delete particular address by User.",
      tags,
      validate: {
        headers: headerValidator,
        payload: UserAddressValidators.single_address_param,
      },
      handler: UserAddressControllers.deleteAddress,
    },
  },
];

module.exports = address_routes;
