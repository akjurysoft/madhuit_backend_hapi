'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    attributes,
  },
  sequelize
} = require('../config');
const AttributeCombinations = require('./attributecombinations');


class Attributes extends Model { }

Attributes.init({
  attribute_name: DataTypes.STRING,
  status: DataTypes.BOOLEAN
}, {
  sequelize,
  paranoid: true,
  modelName: attributes,
});


Attributes.hasMany(AttributeCombinations, { foreignKey: 'attribute_id' });

AttributeCombinations.belongsTo(Attributes, { foreignKey: 'attribute_id' });

module.exports = Attributes;