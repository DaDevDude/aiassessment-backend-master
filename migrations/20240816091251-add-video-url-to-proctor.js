'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('proctors', 'videoUrl', {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if you want the column to be NOT NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proctors', 'videoUrl');
  }
};
