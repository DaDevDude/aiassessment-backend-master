"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("proctors", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull:false,
        primaryKey: true,
      },
      tabSwitched: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
      },
      outOfFrame: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
      },
      externalMonitorDetected: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull: false,
      },
      fullScreenExited: {
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
    await queryInterface.dropTable("proctors");
  },
};
