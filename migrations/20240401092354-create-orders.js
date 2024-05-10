'use strict';
const {
  databases: {
    orders
  }
} = require('../config')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(orders, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING
      },
      address_id: {
        type: Sequelize.INTEGER
      },
      delivery_type_id: {
        type: Sequelize.INTEGER
      },
      order_status_id: {
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.STRING
      },
      total_paid_amount: {
        type: Sequelize.DOUBLE
      },
      total_gst_amount: {
        type: Sequelize.DOUBLE
      },
      total_product_amount: {
        type: Sequelize.DOUBLE
      },
      pending_amountL: {
        type: Sequelize.DOUBLE
      },
      total_amount: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable(orders);
  }
};