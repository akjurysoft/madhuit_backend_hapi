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
    // let newUser = [...user];
    // console.log("newUser", newUser);
    const allowed_user = ["ADMIN"];
    if (allowed_user.includes(user.role)) {
      const {
        banner_name,
        banner_type,
        category_id,
        sub_category_id,
        product_ids,
        banner_url,
      } = req.payload;

      const { file_url } = await uploadFile(
        req,
        banner_url,
        "uploads/banners/"
      );

      if (banner_type === "category") {
        const newBanner = await Banners.create({
          banner_name,
          banner_type,
          category_id,
          sub_category_id,
          status: true,
          banner_url: file_url,
        });
        return sendSuccess(res, "Banner created successfully.", newBanner);
      }

      if (banner_type === "product") {
        const products = JSON.parse(product_ids);

        const newBanner = await Banners.create({
          banner_name,
          banner_type,
          status: true,
          banner_url: file_url,
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
        banner_url: file_url,
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

const editBanner = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"]
    );

    const allowed_user = ["ADMIN"];
    if (allowed_user.includes(user.role)) {
      const {
        banner_id,
        banner_name,
        banner_type,
        category_id,
        sub_category_id,
        product_ids,
        banner_url,
      } = req.payload;

      // Retrieve the banner from the database
      let banner = await Banners.findOne({ where: { id: banner_id } });

      // Check if the banner exists
      if (!banner) {
        return sendError(res, 404, "Banner not found.");
      }

      // Update the banner fields
      banner.banner_name = banner_name;
      banner.banner_type = banner_type;
      banner.category_id = category_id;
      banner.sub_category_id = sub_category_id;

      // Handle image update if provided
      if (image_url) {
        const { file_url } = await uploadFile(
          req,
          image_url,
          "uploads/banners/"
        );
        banner.image_url = file_url;
      }

      // Save the changes
      await banner.save();

      return sendSuccess(res, "Banner updated successfully.", banner);
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

const deleteBanner = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"]
    );

    const allowed_user = ["ADMIN"];
    console.log(user.role, "role");
    console.log(user.application, "application");
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      const { banner_id } = req.query;
      console.log(banner_id);

      // Find the banner by ID
      const banner = await Banners.findOne({ where: { id: banner_id } });

      // Check if the banner exists
      if (!banner) {
        return sendError(res, 404, "Banner not found.");
      }

      // Delete the banner
      await banner.destroy();

      return sendSuccess(res, "Banner deleted successfully.");
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
  editBanner,
  deleteBanner,
};
