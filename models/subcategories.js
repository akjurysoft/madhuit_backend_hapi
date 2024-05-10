'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    sub_categories,
  },
  sequelize
} = require('../config');
const Categories = require('./categories');

class SubCategories extends Model { }

SubCategories.init({
  category_id: DataTypes.INTEGER,
  sub_category_name: DataTypes.STRING,
  image_url: DataTypes.STRING,
  status: DataTypes.BOOLEAN
}, {
  sequelize,
  paranoid: true,
  modelName: sub_categories,
});

SubCategories.belongsTo(Categories, { foreignKey: 'category_id' });

module.exports = SubCategories;