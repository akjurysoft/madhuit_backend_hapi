// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Categories"];
const { CategoryControllers } = require("../controllers");
const {
  headerValidator,
  SchoolValidators,
  CategoryValidators,
} = require("../validators");

// const category_routes = [
//     {
//         method: "POST",
//         path: "/category/add",
//         options: {
//             description: "Create a new Category by Admin.",
//             tags,
//             payload: {
//                 maxBytes: 20 * 1024 * 1024,
//                 output: 'file',
//                 parse: true,
//                 multipart: true     // <-- this fixed the media type error
//             },
//             validate: {
//                 headers: headerValidator,
//                 payload: CategoryValidators.create_category_payload
//             },
//             handler: CategoryControllers.createCategory,
//         },
//     },

//     {
//         method: "GET",
//         path: "/category",
//         options: {
//             description: "Get all Category for User and Admin.",
//             tags,
//             validate: {
//                 // headers: headerValidator,
//                 query: CategoryValidators.fetch_single_category_param
//             },
//             handler: CategoryControllers.fetchCategory,
//         },
//     }
// ]
const category_routes = [
  {
    method: "POST",
    path: "/v1/categories",
    options: {
      description: "Create a new Category by Admin.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true, // <-- this fixed the media type error
      },
      validate: {
        headers: headerValidator,
        payload: CategoryValidators.create_category_payload,
      },
      handler: CategoryControllers.createCategory,
    },
  },
  {
    method: "GET",
    path: "/v1/categories",
    options: {
      description: "Get all Category for User and Admin.",
      tags,
      validate: {
        // headers: headerValidator,
        query: CategoryValidators.fetch_single_category_param,
      },
      handler: CategoryControllers.fetchCategory,
    },
  },
  {
    method: "PUT",
    path: "/v1/categories/:id",
    options: {
      description: "Edit Category by Admin.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true,
      },
      validate: {
        headers: headerValidator,
        payload: CategoryValidators.edit_category_payload,
        params: CategoryValidators.edit_category_params,
      },
      handler: CategoryControllers.editCategory,
    },
  },
  {
    method: "DELETE",
    path: "/v1/categories/:id",
    options: {
      description: "Delete Category by Admin.",
      tags,
      validate: {
        headers: headerValidator,
        params: CategoryValidators.delete_category_params,
      },
      handler: CategoryControllers.deleteCategory,
    },
  },
];

module.exports = category_routes;
