'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    carts,
  },
  sequelize
} = require('../config');
const Users = require('./users');
const Products = require('./products');


class Carts extends Model { }

Carts.init({
  user_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  attribute_id: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: carts,
});

Carts.belongsTo(Users, { foreignKey: 'user_id' });
Carts.belongsTo(Products, { foreignKey: 'product_id' });

module.exports = Carts;