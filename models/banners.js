"use strict";
const { Model, DataTypes } = require("sequelize");
const {
  databases: { banners },
  sequelize,
} = require("../config");

class Banners extends Model {}

Banners.init(
  {
    banner_name: DataTypes.STRING,
    banner_type: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    banner_url: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    paranoid: true,
    modelName: banners,
  }
);

module.exports = Banners;
