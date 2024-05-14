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
const { Users, UserRoles } = require("../models");

const DeliveryTypes = require("../models/deliverytypes");

const fetchDeliveryTypes = async (req, res) => {
  try {
    const delivery_types = await DeliveryTypes.findAll({
      raw: true,
    });
    return sendSuccess(
      res,
      "Delivery Types fetched successfully.",
      delivery_types
    );
  } catch (error) {
    console.log(error);
    return sendError(res, 400, "Something went wrong.");
  }
};

const createDeliveryTypes = async (req, res) => {
  try {
    //validate the admin token
    const user = await checkToken(
      req.headers["authorization"]
        ? req.headers["authorization"]
        : req.headers["Authorization"]
    );

    const allowed_user = ["ADMIN"];

    if (allowed_user.includes(user.role)) {
      const { delivery_type_name } = req.payload;

      const isUserAvailable = await Users.findOne({
        where: {
          id: user.id,
        },
        raw: true,
      });
      if (!isUserAvailable) return sendError(res, 409, "User not found.");

      const newDeliveryTypes = await DeliveryTypes.create({
        user_id: user.id,
        delivery_type_name,
      });

      return sendSuccess(
        res,
        "Delivery Types created successfully",
        newDeliveryTypes
      );
    } else if (user === "Session expired") {
      return sendError(res, 404, user);
    } else {
      return sendError(res, 403, "you dont have permission for this action");
    }
  } catch (err) {
    console.log(err);
    return sendError(res, 400, "somethings went wrong");
  }
};

module.exports = {
  fetchDeliveryTypes,
};
