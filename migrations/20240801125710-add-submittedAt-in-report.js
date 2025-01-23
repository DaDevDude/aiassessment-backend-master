'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reports', 'submittedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reports', 'submittedAt');
  }
};
