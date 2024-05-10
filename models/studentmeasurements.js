'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    student_measurements,
  },
  sequelize
} = require('../config')

const Students = require('./schoolstudents')

class StudentMeasurements extends Model {}
StudentMeasurements.init({
  student_id: DataTypes.INTEGER,
  bottom_size: DataTypes.INTEGER,
  upper_size: DataTypes.INTEGER
}, {
  sequelize,
  paranoid: true,
  modelName: student_measurements,
});


Students.hasOne(StudentMeasurements, {
  foreignKey: 'student_id',
  
})

StudentMeasurements.belongsTo(Students, {
  foreignKey: 'student_id',
})

module.exports = StudentMeasurements;