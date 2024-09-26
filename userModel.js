// models/userModel.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/tests'); // Adjust path as needed

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validates email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users', // Ensure table name matches exactly
  timestamps: true,
});

module.exports = User;
