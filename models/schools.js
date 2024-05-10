'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    schools,
  },
  sequelize
} = require('../config')
class Schools extends Model {}
Schools.init({
  name: DataTypes.STRING,
  unique_id: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: schools,
});

module.exports = Schools;