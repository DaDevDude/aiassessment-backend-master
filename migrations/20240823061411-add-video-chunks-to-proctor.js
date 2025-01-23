'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('proctors', 'videoChunks', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('proctors', 'videoChunks');
  }
};