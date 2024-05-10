'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const {
  databases: {
    students,
  },
  sequelize
} = require('../config')

const School = require('./schools')

class SchoolStudents extends Model {}
SchoolStudents.init({
  school_id: DataTypes.INTEGER,
  student_name: DataTypes.STRING,
  student_gender: DataTypes.STRING,
  student_class: DataTypes.STRING,
  student_section: DataTypes.STRING,
  student_roll_no: DataTypes.STRING,
  student_unique_id: DataTypes.STRING
}, {
  sequelize,
  paranoid: true,
  modelName: students,
});

School.hasMany(SchoolStudents, {
  foreignKey: 'school_id',
})

SchoolStudents.belongsTo(School, {
  foreignKey: 'school_id',
})

module.exports = SchoolStudents;