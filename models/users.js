'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    users,
  },
  sequelize
} = require('../config')

class Users extends Model {}
Users.init({
  fullname: DataTypes.STRING,
  email: DataTypes.STRING,
  mobile: DataTypes.STRING,
  access_token: DataTypes.STRING,
  refresh_token: DataTypes.STRING,
  password: DataTypes.STRING,
  role_id: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: users,
});
module.exports = Users;