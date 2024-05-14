const { Op } = require("sequelize");
const {
  sendError,
  sendSuccess,
  make_hash,
  validatePhoneNumber,
  validateEmail,
  check_hash,
  makeToken,
  makeRefreshToken,
  checkToken,
  isValid,
  uploadFile,
} = require("../helpers");
const { Users, UserRoles, School } = require("../models");
const Categories = require("../models/categories");
const Products = require("../models/products");
const Carts = require("../models/carts");
const ProductImages = require("../models/productimages");
const Wishlists = require("../models/wishlists");

const addToWishList = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["authorization"]
        ? req.headers["authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["USER"];
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      const { product_id } = req.payload;

      const available_product = await Products.findOne({
        where: {
          id: product_id,
          // status: true,
        },
        raw: true,
      });

      if (!available_product) {
        return sendError(res, 404, "Product not found.");
      }

      const isUserRole = await UserRoles.findOne({
        where: {
          name: "USER",
        },
        raw: true,
      });

      const isAvailableUser = await Users.findOne({
        where: {
          id: user.id,
          role_id: isUserRole.id,
        },
      });

      if (!isAvailableUser) {
        return sendError(res, 400, "User not found.");
      }

      const existingProduct = await Wishlists.findOne({
        where: {
          user_id: user.id,
          product_id,
        },
      });

      if (existingProduct) {
        return sendError(res, 400, "Product already in wishlist");
      } else {
        await Wishlists.create({
          user_id: user.id,
          product_id,
        });
      }

      return sendSuccess(res, "Product added to wishlist");
    } else if (user == "Session expired") {
      return sendError(res, 401, user);
    } else {
      return sendError(res, 403, "You dont have permission for this action.");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

const getWishList = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["USER"];
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      const isUserRole = await UserRoles.findOne({
        where: {
          name: "USER",
        },
        raw: true,
      });
      const isAvailableUser = await Users.findOne({
        where: {
          id: user.id,
          role_id: isUserRole.id,
        },
      });
      if (!isAvailableUser) {
        return sendError(res, 400, "User not found.");
      }

      const wishList = await Wishlists.findAll({
        where: {
          user_id: user.id,
        },
        include: [
          {
            model: Products,
            include: [
              {
                model: ProductImages,
                attributes: ["id", "image_url"],
                as: "images",
              },
            ],
          },
        ],
      });

      // const wishListWithImages = await Promise.all(wishList.map(async (item) => {
      //     const product = item.product;
      //     const images = await ProductImages.findAll({
      //         where: {
      //             product_id: product.id
      //         },
      //         attributes: ['id', 'image_url'],
      //         raw: true
      //     });
      //     return {
      //         id: item.id,
      //         product: {
      //             id: product.id,
      //             name: product.product_name,
      //             images: images
      //         }
      //     };
      // }));

      const wishListCount = wishList.length;

      return sendSuccess(res, "Wishlist fetched successfully.", {
        wishListCount,
        wishList,
      });
    } else if (user == "Session expired") {
      return sendError(res, 401, user);
    } else {
      return sendError(res, 403, "You dont have permission for this action.");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["authorization"]
        ? req.headers["authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["USER"];
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      const isUserRole = await UserRoles.findOne({
        where: {
          name: "USER",
        },
      });

      const isAvailableUser = await Users.findOne({
        where: {
          id: user.id,
          role_id: isUserRole.id,
        },
      });

      if (!isAvailableUser) {
        return sendError(res, 400, "User not found.");
      }

      const { product_id } = req.payload;

      const existingWishlist = await Wishlists.findOne({
        where: {
          user_id: user.id,
          product_id,
        },
      });

      if (!existingWishlist) {
        return sendError(res, 400, "Product not found in wishlist");
      }

      await Wishlists.destroy({
        where: {
          user_id: user.id,
          product_id,
        },
      });

      return sendSuccess(res, "Product removed from wishlist successfully.");
    } else if (user == "Session expired") {
      return sendError(res, 401, user);
    } else {
      return sendError(res, 403, "You dont have permission for this action.");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

module.exports = {
  addToWishList,
  getWishList,
  removeFromWishlist,
};
