// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Sub Categories"];
const {
    SchoolControllers, CategoryControllers, SubCategoryControllers
} = require('../controllers')
const { headerValidator, SchoolValidators, CategoryValidators, SubCategoryValidators } = require('../validators');

const sub_category_routes = [
    {
        method: "POST",
        path: "/sub-category/add",
        options: {
            description: "Create a new Sub Category by Admin.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: SubCategoryValidators.create_sub_category_payload
            },
            handler: SubCategoryControllers.createSubCategory,
        },
    },

    {
        method: "GET",
        path: "/sub-category-admin",
        options: {
            description: "Get all Sub Category for Admin.",
            tags,
            validate: {
                headers: headerValidator,
                // query: SubCategoryValidators.fetch_single_sub_category_param
            },
            handler: SubCategoryControllers.fetchSubCategoryAdmin,
        },
    },
   
    {
        method: "GET",
        path: "/sub-category",
        options: {
            description: "Get all Sub Category for User.",
            tags,
            validate: {
                // headers: headerValidator,
                query: SubCategoryValidators.fetch_single_sub_category_param
            },
            handler: SubCategoryControllers.fetchSubCategory,
        },
    },

    {
        method: "POST",
        path: "/sub-category/update",
        options: {
            description: "Get all Sub Category for User and Admin.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: SubCategoryValidators.edit_sub_category_payload
            },
            handler: SubCategoryControllers.updateSubcategory,
        },
    },

    {
        method: "POST",
        path: "/sub-category/delete/{sub_category_id}",
        options: {
            description: "Delete particular Sub Category by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                params: SubCategoryValidators.delete_sub_category_param
            },
            handler: SubCategoryControllers.deleteSubcategory,
        },
    },

    {
        method: "POST",
        path: "/sub-category/toggle-status/{sub_category_id}",
        options: {
            description: "Toggle Sub Category status by Admin.",
            tags,
            validate: {
                headers: headerValidator,
                params: SubCategoryValidators.toggle_sub_category_status_param
            },
            handler: SubCategoryControllers.toggleSubCategoryStatus,
        },
    },
]

module.exports = sub_category_routes