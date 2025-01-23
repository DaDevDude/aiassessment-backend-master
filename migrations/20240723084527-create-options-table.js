'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("options", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull:false,
        primaryKey: true,
      },
      questionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'questions',  
          key: 'id'
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'   
      },
      optionText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        default:false,
        allowNull: false,
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
    await queryInterface.dropTable("options");
  },
};