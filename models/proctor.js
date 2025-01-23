const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Proctor = sequelize.define(
    "Proctor",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      tabSwitched: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      outOfFrame: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      externalMonitorDetected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      fullScreenExited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      videoChunks: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      candidatePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      multiplePeople: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bannedObjects: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      faceVerification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      headPoseDetection: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      eyeTracking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      proctored: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "proctors",
      timestamps: true,
    }
  );
  return Proctor;
};
