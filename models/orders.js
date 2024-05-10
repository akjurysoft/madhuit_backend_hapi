'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    orders,
  },
  sequelize
} = require('../config');
const OrderDetails = require('./orderdetails');
const DeliveryTypes = require('./deliverytypes');
const OrderStatuses = require('./orderstatuses');
const OrderStatusLogs = require('./orderstatuslogs');


class Orders extends Model { }

Orders.init({
  user_id: DataTypes.INTEGER,
  order_id: DataTypes.STRING,
  address_id: DataTypes.INTEGER,
  delivery_type_id: DataTypes.INTEGER,
  order_status_id: DataTypes.INTEGER,
  payment_id: DataTypes.STRING,
  total_paid_amount: DataTypes.DOUBLE,
  total_gst_amount: DataTypes.DOUBLE,
  total_product_amount: DataTypes.DOUBLE,
  pending_amountL: DataTypes.DOUBLE,
  total_amount: DataTypes.DOUBLE
}, {
  sequelize,
  paranoid: true,
  modelName: orders,
});

Orders.hasMany(OrderDetails, { foreignKey: 'order_id' });
Orders.belongsTo(DeliveryTypes, { foreignKey: 'delivery_type_id' });
Orders.belongsTo(OrderStatuses, { foreignKey: 'order_status_id' });
Orders.hasMany(OrderStatusLogs, { foreignKey: 'order_id' });

module.exports = Orders;