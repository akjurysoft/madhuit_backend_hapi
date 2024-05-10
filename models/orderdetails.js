'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    order_details,
  },
  sequelize
} = require('../config');
const Orders = require('./orders');
const Products = require('./products');


class OrderDetails extends Model { }

OrderDetails.init({
  order_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: order_details,
});

OrderDetails.belongsTo(Products, { foreignKey: 'product_id' });

module.exports = OrderDetails;