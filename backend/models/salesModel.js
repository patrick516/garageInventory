/*const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/tests');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Customers',
      key: 'id',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products', // Assuming you have a Products table
      key: 'id',
    },
    allowNull: false,
  },
  quantityPurchased: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Sales',
  timestamps: true,
});

module.exports = Sale;
*/