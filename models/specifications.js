"use strict"; // Adding 'use strict' at the beginning to enforce stricter parsing and error handling

const { Model, DataTypes } = require("sequelize");
const {
  databases: { specifications },
  sequelize,
} = require("../config");

class Specifications extends Model {}

Specifications.init(
  {
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER, // Corrected from products_id to product_id
    rating: DataTypes.INTEGER,
  },
  {
    sequelize,
    paranoid: true,
    modelName: ratings,
  }
);

// Importing the Users and Products models
const Users = require("./users");
const Products = require("./products");

// Establishing associations
Ratings.belongsTo(Users, { foreignKey: "user_id" });
Ratings.belongsTo(Products, { foreignKey: "product_id" });

module.exports = Ratings;
