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

const Banners = require("../models/banners");

const BannerProductsAssociations = require("../models/bannerproductsassociations");

const getAllBannersCustomer = async (req, res) => {
  try {
    const banners = await Banners.findAll({
      where: {
        status: true,
      },
      raw: true,
    });
    return sendSuccess(res, "Banners fetched successfully.", banners);
  } catch (error) {
    console.log(error);
    return sendError(res, 500, error);
  }
};
const createBanner = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"]
    );
    let newUser = [...user];
    console.log("newUser", newUser);
    const allowed_user = ["ADMIN"];
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      const {
        banner_name,
        banner_type,
        category_id,
        sub_category_id,
        product_ids,
        image_url,
      } = req.payload;

      const { file_url } = await uploadFile(req, image_url, "uploads/banners/");

      if (banner_type === "category") {
        const newBanner = await Banners.create({
          banner_name,
          banner_type,
          category_id,
          sub_category_id,
          status: true,
          image_url: file_url,
        });
        return sendSuccess(res, "Banner created successfully.", newBanner);
      }

      if (banner_type === "product") {
        const products = JSON.parse(product_ids);

        const newBanner = await Banners.create({
          banner_name,
          banner_type,
          status: true,
          image_url: file_url,
        });

        const associationsData = products.map((productId) => ({
          banner_id: newBanner.id,
          product_id: productId,
          status: true,
        }));

        const associations = await BannerProductsAssociations.bulkCreate(
          associationsData
        );

        return sendSuccess(res, "Banner created successfully.", associations);
      }

      const newBanner = await Banners.create({
        banner_name,
        status: true,
        image_url: file_url,
      });
      return sendSuccess(res, "Banner created successfully.", newBanner);
    } else if (user == "Session expired") {
      return sendError(res, 404, user);
    } else {
      return sendError(res, 403, "You dont have permission for this action.");
    }
  } catch (error) {
    console.log(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

module.exports = {
  createBanner,
  getAllBannersCustomer,
};
