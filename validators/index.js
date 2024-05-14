const joi = require("joi");
module.exports = {
  headerValidator: joi
    .object({
      Authorization: joi.string().allow(null),
      authorization: joi.string().allow(null),
    })
    .options({ allowUnknown: true }),
  imageValidator: joi.object({
    image: joi.string(),
    path: joi.string(),
  }),
  AuthValidators: require("./auth_validators"),
  UserValidators: require("./user_validators"),
  SchoolValidators: require("./school_validators"),
  StudentValidators: require("./student_validators"),
  CategoryValidators: require("./category_validator"),
  SubCategoryValidators: require("./sub_categories_validators"),
  UserAddressValidators: require("./user_address_validator"),
  ProductValidators: require("./product_validators"),
  CartValidators: require("./cart_validators"),
  WishlistValidators: require("./wishlist_validators"),
  OrdersValidators: require("./orders_validators"),
  BannersValidators: require("./banner_validators"),
  AttributeValidators: require("./attribute_validators"),
  DeliveryTypesValidators: require("./deliveryTypes_validators"),
};
