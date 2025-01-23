"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("answers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull:false,
        primaryKey: true,
      },
      reportId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'reports',  
          key: 'id'
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'   
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
      selectedOptionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'options',  
          key: 'id'
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'   
      },
      markedForReview: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull: false,
      },
      providedAnswer: {
        type: Sequelize.TEXT,
        defaultValue:'',
        allowNull: true,
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
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
    await queryInterface.dropTable("answers");
  },
};
