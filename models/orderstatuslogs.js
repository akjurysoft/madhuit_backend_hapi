'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    order_status_logs,
  },
  sequelize
} = require('../config');
const OrderStatuses = require('./orderstatuses');


class OrderStatusLogs extends Model { }

OrderStatusLogs.init({
  order_id: DataTypes.INTEGER,
  order_status_id: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: order_status_logs,
});

OrderStatusLogs.belongsTo(OrderStatuses, { foreignKey: 'order_status_id' });

module.exports = OrderStatusLogs;