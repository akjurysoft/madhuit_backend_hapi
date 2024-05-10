'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    user_roles,
  },
  sequelize
} = require('../config')

class UserRoles extends Model {}
UserRoles.init({
  name: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: user_roles,
});

module.exports = UserRoles;