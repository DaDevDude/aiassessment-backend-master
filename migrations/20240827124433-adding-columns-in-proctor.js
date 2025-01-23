"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("proctors", "candidatePicture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("proctors", "multiplePeople", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("proctors", "bannedObjects", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("proctors", "faceVerification", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("proctors", "headPoseDetection", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("proctors", "eyeTracking", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("proctors", "proctored", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("proctors", "candidatePicture");
    await queryInterface.removeColumn("proctors", "multiplePeople");
    await queryInterface.removeColumn("proctors", "bannedObjects");
    await queryInterface.removeColumn("proctors", "faceVerification");
    await queryInterface.removeColumn("proctors", "headPoseDetection");
    await queryInterface.removeColumn("proctors", "eyeTracking");
    await queryInterface.removeColumn("proctors", "proctored");
  },
};
