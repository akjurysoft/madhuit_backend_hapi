'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    categories,
  },
  sequelize
} = require('../config');


class Categories extends Model { }

Categories.init({
  category_name: DataTypes.STRING,
  image_url: DataTypes.STRING,
  status: DataTypes.BOOLEAN
}, {
  sequelize,
  paranoid: true,
  modelName: categories,
});

module.exports = Categories;