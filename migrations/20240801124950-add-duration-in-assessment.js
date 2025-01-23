'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assessments', 'duration', {
      type: Sequelize.INTEGER, // Storing duration in seconds
      allowNull: false,
      defaultValue: 3600, // Default to 1 hour (3600 seconds)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assessments', 'duration');
  }
};
