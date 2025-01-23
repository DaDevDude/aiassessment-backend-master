'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("topics", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull:false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assessmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'assessments',  
          key: 'id'
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'   
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("topics");
  },
};