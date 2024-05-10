'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    delivery_types,
  },
  sequelize
} = require('../config');


class DeliveryTypes extends Model { }

DeliveryTypes.init({
  delivery_type_name: DataTypes.STRING,
  status: DataTypes.BOOLEAN
}, {
  sequelize,
  paranoid: true,
  modelName: delivery_types,
});



module.exports = DeliveryTypes;