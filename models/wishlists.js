'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    wishlists,
  },
  sequelize
} = require('../config');
const Users = require('./users');
const Products = require('./products');


class Wishlists extends Model { }

Wishlists.init({
  user_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: wishlists,
});

Wishlists.belongsTo(Users, { foreignKey: 'user_id' });
Wishlists.belongsTo(Products, { foreignKey: 'product_id' });

module.exports = Wishlists;