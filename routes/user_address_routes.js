// describe routes here by creating objects inside the user_routes array
const tags = ["api", "User Address"];
const {
    SchoolControllers, CategoryControllers, UserAddressControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators, UserAddressValidators } = require('../validators');

const address_routes = [
    {
        method: "POST",
        path: "/address/add",
        options: {
            description: "Add a new Address by User.",
            tags,
            validate: {
                headers: headerValidator,
                payload: UserAddressValidators.add_address_payload
            },
            handler: UserAddressControllers.addAddress,
        },
    },
    {
        method: "GET",
        path: "/address",
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
        method: "POST",
        path: "/address/edit/{address_id}",
        options: {
            description: "Edit particular address by User.",
            tags,
            validate: {
                headers: headerValidator,
                params: UserAddressValidators.single_address_param,
                payload: UserAddressValidators.edit_address_payload
            },
            handler: UserAddressControllers.editAddress,
        },
    },

    {
        method: "POST",
        path: "/address/delete/{address_id}",
        options: {
            description: "Delete particular address by User.",
            tags,
            validate: {
                headers: headerValidator,
                params: UserAddressValidators.single_address_param,
            },
            handler: UserAddressControllers.deleteAddress,
        },
    },

]

module.exports = address_routes