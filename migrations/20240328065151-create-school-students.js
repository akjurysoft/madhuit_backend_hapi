'use strict';
const {
  databases: {
    students
  }
} = require('../config')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(students, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        type: Sequelize.INTEGER
      },
      student_name: {
        type: Sequelize.STRING
      },
      student_gender: {
        type: Sequelize.STRING
      },
      student_class: {
        type: Sequelize.STRING
      },
      student_section: {
        type: Sequelize.STRING
      },
      student_roll_no: {
        type: Sequelize.STRING
      },
      student_unique_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(students);
  }
};