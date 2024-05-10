'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    order_statuses,
  },
  sequelize
} = require('../config');


class OrderStatuses extends Model { }

OrderStatuses.init({
  status_name: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: order_statuses,
});

module.exports = OrderStatuses;