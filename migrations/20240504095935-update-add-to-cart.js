'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'carts',
          'attribute_id',
          {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true, // Adjust this based on your requirements
            defaultValue: null, // Adjust this based on your requirements
          },
          { transaction: t },
        ),
      ]);
    });
  },


  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('carts', 'attribute_id', { transaction: t }),
      ]);
    });
  },
}
