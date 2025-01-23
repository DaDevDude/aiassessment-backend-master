'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename columns
    await queryInterface.renameColumn('questions', 'questionText', 'question');
    await queryInterface.renameColumn('questions', 'difficulty', 'difficultyLevel');
    await queryInterface.renameColumn('questions', 'type', 'questionType');

  },

  async down(queryInterface, Sequelize) {
    // Rename columns back to original names
    await queryInterface.renameColumn('questions', 'question', 'questionText');
    await queryInterface.renameColumn('questions', 'difficultyLevel', 'difficulty');
    await queryInterface.renameColumn('questions', 'questionType', 'type');
  }
};
