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
const Categories = require("../models/categories");

const createCategory = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"]
    );
    const allowed_user = ["ADMIN"];
    if (allowed_user.includes(user.role)) {
      const { category_name, image } = req.payload;
      const existingCategory = await Categories.findOne({
        where: {
          category_name,
        },
        raw: true,
      });
      if (existingCategory)
        return sendError(res, 409, "Category already exists.");

      const { file_url } = await uploadFile(req, image, "uploads/categories/");

      const newCategory = await Categories.create({
        category_name,
        image_url: file_url,
        status: true,
      });
      return sendSuccess(res, "Category created successfully.", newCategory);
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

const fetchCategory = async (req, res) => {
  try {
    const { id, category_name } = req.query;
    let filter = {
      status: true,
    };
    if (id)
      filter = {
        ...filter,
        id,
      };
    if (category_name)
      filter = {
        ...filter,
        category_name,
      };
    const categories = await Categories.findAll({
      where: filter,
      raw: true,
    });
    return sendSuccess(res, "Categories fetched successfully.", categories);
  } catch (error) {
    console.log(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

const editCategory = async (req, res) => {
  try {
    // Check user authentication and authorization
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"]
    );
    const allowed_user = ["ADMIN"];
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      // Extract category_id from request parameters and category_name, image from payload
      const { id } = req.params;
      const { category_name, image } = req.payload;

      // Check if the category exists
      const existingCategory = await Categories.findByPk(id);
      if (!existingCategory) {
        return sendError(res, 404, "Category not found.");
      }

      // Update category details if provided
      if (category_name) {
        existingCategory.category_name = category_name;
      }
      if (image) {
        const { file_url } = await uploadFile(
          req,
          image,
          "uploads/categories/"
        );
        existingCategory.image_url = file_url;
      }

      // Save the updated category
      await existingCategory.save();

      return sendSuccess(
        res,
        "Category updated successfully.",
        existingCategory
      );
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

const deleteCategory = async (req, res) => {
  try {
    // Check user authentication and authorization
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"]
    );
    const allowed_user = ["ADMIN"];
    if (
      allowed_user.includes(user.role) &&
      user.application === "Chimmi Garments"
    ) {
      // Extract category_id from request parameters
      const { id } = req.params;

      // Check if the category exists
      const existingCategory = await Categories.findByPk(id);
      if (!existingCategory) {
        return send;
        // Check if the category exists
        const existingCategory = await Categories.findByPk(id);
        if (!existingCategory) {
          return sendError(res, 404, "Category not found.");
        }

        // Delete the category
        await existingCategory.destroy();

        return sendSuccess(res, "Category deleted successfully.");
      } else if (user == "Session expired") {
        return sendError(res, 404, user);
      } else {
        return sendError(res, 403, "You dont have permission for this action.");
      }
    }
  } catch (error) {
    console.log(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

module.exports = {
  createCategory,
  fetchCategory,
  editCategory,
  deleteCategory,
};
