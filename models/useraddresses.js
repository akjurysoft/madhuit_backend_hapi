'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    user_addresses,
  },
  sequelize
} = require('../config')
class UserAddresses extends Model { }
UserAddresses.init({
  
  user_id: DataTypes.INTEGER,
  fullname: DataTypes.STRING,
  mobile: DataTypes.STRING,
  add1: DataTypes.STRING,
  add2: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  pincode: DataTypes.STRING,
  area: DataTypes.STRING,
  landmark: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: user_addresses,
});

module.exports = UserAddresses;