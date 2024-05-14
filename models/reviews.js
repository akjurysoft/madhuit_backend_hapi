"use strict"; // Adding 'use strict' at the beginning to enforce stricter parsing and error handling

const { Model, DataTypes } = require("sequelize");
const {
  databases: { reviews },
  sequelize,
} = require("../config");

class Reviews extends Model {}

Reviews.init(
  {
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER, // Corrected from products_id to product_id
    review: DataTypes.STRING,
  },
  {
    sequelize,
    paranoid: true,
    modelName: reviews,
  }
);

// Importing the Users and Products models
const Users = require("./users");
const Products = require("./products");

// Establishing associations
Reviews.belongsTo(Users, { foreignKey: "user_id" });
Reviews.belongsTo(Products, { foreignKey: "product_id" });

module.exports = Reviews;
