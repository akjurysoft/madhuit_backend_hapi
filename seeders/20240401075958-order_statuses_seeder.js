'use strict';
const {
  databases: {
    order_statuses
  }
} = require('../config')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(order_statuses, [
      {
        status_name: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'CONFIRMED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'OUT FOR DELIVERY',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'DELIVERED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'CANCELLED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(order_statuses, null, {});
  }
};

