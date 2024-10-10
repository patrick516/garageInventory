const { DataTypes } = require('sequelize');
const sequelize = require('../config/tests').sequelize; 
const Supplier = sequelize.define('Supplier', {
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  inventoryName: {  // New field
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Supplier;
