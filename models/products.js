'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    products,
  },
  sequelize
} = require('../config');
const Categories = require('./categories');
const SubCategories = require('./subcategories');
const ProductImages = require('./productimages');

class Products extends Model { }

Products.init({
  
  category_id: DataTypes.INTEGER,
  sub_category_id: DataTypes.INTEGER,
  product_name: DataTypes.STRING,
  description: DataTypes.STRING,
  size: DataTypes.STRING,
  color: DataTypes.STRING,
  status: DataTypes.BOOLEAN,
  price: DataTypes.DOUBLE,
  stock: DataTypes.INTEGER,
  tags: DataTypes.STRING,
  highlights: DataTypes.STRING,
  specifications: DataTypes.STRING,
  is_featured: DataTypes.BOOLEAN, 
}, {
  sequelize,
  paranoid: true,
  modelName: products,
});

Products.belongsTo(Categories, { foreignKey: 'category_id' });
Products.belongsTo(SubCategories, { foreignKey: 'sub_category_id' });
Products.hasMany(ProductImages, { foreignKey: 'product_id' , as: 'images' });

module.exports = Products;