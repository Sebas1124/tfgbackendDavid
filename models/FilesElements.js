const { DataTypes } = require('sequelize')
const sequelize = require('../config/database');

const FilesElements = sequelize.define('FilesElements', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    elementId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position_x: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position_y: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    scaleX: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    scaleY: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rotation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fontSize: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fill: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stroke: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    strokeWidth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    width: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    height: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fontFamily: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    textAlign: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fontWeight: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})

module.exports = FilesElements;
