'use strict';
const {
  databases: {
    delivery_types
  }
} = require('../config')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(delivery_types, [
      {
        delivery_type_name: 'COD',
        status:true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        delivery_type_name: 'ADVANCE PAYMENT',
        status:true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        delivery_type_name: 'FULL PAYMENT',
        status:true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(delivery_types, null, {});
  }
};

