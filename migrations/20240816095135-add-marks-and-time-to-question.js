'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('questions', 'marks', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,  // Set a default value if required
    });
    await queryInterface.addColumn('questions', 'time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,  // Set a default value if required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('questions', 'marks');
    await queryInterface.removeColumn('questions', 'time');
  }
};
