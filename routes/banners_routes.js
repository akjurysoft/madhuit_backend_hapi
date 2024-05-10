// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Banners"];
const {
    SchoolControllers, CategoryControllers, CartsControllers, BannerControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators, CartValidators, BannersValidators } = require('../validators');

const banner_routes = [
    {
        method: "POST",
        path: "/banner/add",
        options: {
            description: "Add banner by Admin.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: BannersValidators.add_to_banner_payload
            },
            handler: BannerControllers.createBanner,
        },
    },

    {
        method: "GET",
        path: "/banner",
        options: {
            description: "Get all banners for Customers.",
            tags,
            validate: {
                // headers: headerValidator,
            },
            handler: BannerControllers.getAllBannersCustomer,
        },
    }
]

module.exports = banner_routes