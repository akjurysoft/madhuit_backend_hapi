'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    attribute_combinations,
  },
  sequelize
} = require('../config');
const Products = require('./products');
const ProductAttributeAssociations = require('./productattributeassociations');


class AttributeCombinations extends Model { }

AttributeCombinations.init({
  combination_id: DataTypes.INTEGER,
    attribute_id: DataTypes.INTEGER,
    attribute_value: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: attribute_combinations,
});

ProductAttributeAssociations.hasMany(AttributeCombinations, { foreignKey: 'combination_id' });

AttributeCombinations.belongsTo(ProductAttributeAssociations, { foreignKey: 'combination_id' });

module.exports = AttributeCombinations;