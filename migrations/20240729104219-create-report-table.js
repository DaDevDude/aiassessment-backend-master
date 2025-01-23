"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reports", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull:false,
        primaryKey: true,
      },
      candidateId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'candidates',  
          key: 'id'
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'   
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
      proctorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'proctors',  
          key: 'id'
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'   
      },
      status: {
        type: Sequelize.ENUM("completed", "inprogress"),
        allowNull: false,
        defaultValue:'inprogress'
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
    await queryInterface.dropTable("reports");
  },
};
