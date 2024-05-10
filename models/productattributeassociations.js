'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    product_attribute_associations,
  },
  sequelize
} = require('../config');
const Products = require('./products');

class ProductAttributeAssociations extends Model { }

ProductAttributeAssociations.init({
  combination: DataTypes.STRING,
  price: DataTypes.DOUBLE,
  stock: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: product_attribute_associations,
});

Products.hasMany(ProductAttributeAssociations, { foreignKey: 'product_id' });

ProductAttributeAssociations.belongsTo(Products, { foreignKey: 'product_id' });

module.exports = ProductAttributeAssociations;