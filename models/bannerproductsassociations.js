'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    banner_product_associations,
  },
  sequelize
} = require('../config');


class BannerProductsAssociations extends Model { }

BannerProductsAssociations.init({
  banner_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: banner_product_associations,
});

module.exports = BannerProductsAssociations;