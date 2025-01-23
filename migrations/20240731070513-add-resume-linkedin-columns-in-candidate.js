'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('candidates', 'linkedin', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '',
    });

    await queryInterface.addColumn('candidates', 'resume', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('candidates', 'linkedin');
    await queryInterface.removeColumn('candidates', 'resume');
  }
};
