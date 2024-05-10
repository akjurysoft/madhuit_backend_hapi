// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Products"];
const {
    SchoolControllers, ProductControllers, SimilarProductControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, ProductValidators } = require('../validators');

const product_routes = [
    {
        method: "POST",
        path: "/product/add",
        options: {
            description: "Create a new Product by Admin.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: ProductValidators.create_product_payload
            },
            handler: ProductControllers.createProduct,
        },
    },
    {
        method: "GET",
        path: "/product-admin",
        options: {
            description: "Get Products by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                query: ProductValidators.fetch_all_product,
            },
            handler: ProductControllers.fetchProductsAdmin,
        },
    },
    {
        method: "GET",
        path: "/product",
        options: {
            description: "Get Products by User.",
            tags,
            validate: {
                // headers: headerValidator,
                query: ProductValidators.fetch_all_product,
            },
            handler: ProductControllers.fetchProductsCustomer,
        },
    },

    {
        method: "GET",
        path: "/product/similar",
        options: {
            description: "Get similar Products by User.",
            tags,
            validate: {
                // headers: headerValidator,
                query: ProductValidators.get_similar_products,
            },
            handler: SimilarProductControllers.similarProducts,
        },
    },

    {
        method: "GET",
        path: "/product/featured",
        options: {
            description: "Get featured Products by User.",
            tags,
            validate: {
                // headers: headerValidator,
                // query: ProductValidators.get_featured_products,
            },
            handler: ProductControllers.getFeatureProduct,
        },
    },

    {
        method: "POST",
        path: "/product/add-to-feature",
        options: {
            description: "Add to featured Products by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                query: ProductValidators.add_product_to_feature
            },
            handler: ProductControllers.addProductToFeature,
        },
    },
    {
        method: "POST",
        path: "/product/delete/",
        options: {
            description: "Deleting Product by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                query: ProductValidators.delete_product_param,
            },
            handler: ProductControllers.deleteProduct,
        },
    },
    {
        method: "POST",
        path: "/product/toggle-status",
        options: {
            description: "Toggle Product Status by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                query: ProductValidators.toggle_product_status_param
            },
            handler: ProductControllers.toggleProductStatus,
        },
    }
    // {
    //     method: "GET",
    //     path: "/school/{school_id}",
    //     options: {
    //         description: "Fetching single school.",
    //         tags,
    //         validate: {
    //             headers: headerValidator,
    //             params: SchoolValidators.single_school_param,
    //         },
    //         handler: SchoolControllers.fetchSingleSchool,
    //     },
    // },
    // {
    //     method: "GET",
    //     path: "/school",
    //     options: {
    //         description: "Fetching all schools.",
    //         tags,
    //         validate: {
    //             headers: headerValidator,
    //         },
    //         handler: SchoolControllers.fetchSchools,
    //     },
    // },
]

module.exports = product_routes