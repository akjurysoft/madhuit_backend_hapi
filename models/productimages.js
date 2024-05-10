'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    product_images,
  },
  sequelize
} = require('../config');

class ProductImages extends Model { }

ProductImages.init({
  product_id: DataTypes.INTEGER,
  image_url: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: product_images,
});


module.exports = ProductImages;