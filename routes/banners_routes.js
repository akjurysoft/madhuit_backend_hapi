// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Banners"];
const {
  SchoolControllers,
  CategoryControllers,
  CartsControllers,
  BannerControllers,
} = require("../controllers");
const {
  headerValidator,
  SchoolValidators,
  CategoryValidators,
  CartValidators,
  BannersValidators,
} = require("../validators");

const banner_routes = [
  {
    method: "POST",
    path: "/v1/banners",
    options: {
      description: "Add banner by Admin.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true, // <-- this fixed the media type error
      },
      validate: {
        headers: headerValidator,
        payload: BannersValidators.add_to_banner_payload,
      },
      handler: BannerControllers.createBanner,
    },
  },

  {
    method: "GET",
    path: "/v1/banners",
    options: {
      description: "Get all banners for Customers.",
      tags,
      validate: {
        // headers: headerValidator,
      },
      handler: BannerControllers.getAllBannersCustomer,
    },
  },
  {
    method: "PUT",
    path: "/v1/banners",
    options: {
      description: "Edit banner by Admin.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true,
      },
      validate: {
        headers: headerValidator,
        payload: BannersValidators.edit_banner_payload,
        params: BannersValidators.edit_banner_params,
      },
      handler: BannerControllers.editBanner,
    },
  },
  {
    method: "DELETE",
    path: "/v1/banners",
    options: {
      description: "Delete banner by Admin.",
      tags,
      validate: {
        headers: headerValidator,
      },
      handler: BannerControllers.deleteBanner,
    },
  },
];

module.exports = banner_routes;
