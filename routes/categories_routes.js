// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Categories"];
const {
    SchoolControllers, CategoryControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators } = require('../validators');

const category_routes = [
    {
        method: "POST",
        path: "/category/add",
        options: {
            description: "Create a new Category by Admin.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: CategoryValidators.create_category_payload
            },
            handler: CategoryControllers.createCategory,
        },
    },
   
    {
        method: "GET",
        path: "/category",
        options: {
            description: "Get all Category for User and Admin.",
            tags,
            validate: {
                // headers: headerValidator,
                query: CategoryValidators.fetch_single_category_param
            },
            handler: CategoryControllers.fetchCategory,
        },
    }
]

module.exports = category_routes