const { DataTypes } = require('sequelize')
const sequelize = require('../config/database');

const UserFiles = sequelize.define('UserFiles', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = UserFiles;
