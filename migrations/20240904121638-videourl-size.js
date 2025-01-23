'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('proctors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      tabSwitched: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      outOfFrame: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      externalMonitorDetected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      fullScreenExited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      videoUrl: {
        type: Sequelize.TEXT, // Changed to TEXT to allow longer URLs
        allowNull: true,
      },
      videoChunks: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      candidatePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      multiplePeople: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bannedObjects: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      faceVerification: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      headPoseDetection: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      eyeTracking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      proctored: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('proctors');
  },
};
