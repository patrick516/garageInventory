const { DataTypes } = require('sequelize');
const sequelize = require('../config/tests').sequelize; // Adjust this path if needed

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
  purchasedInventoryId: { // Ensure this field name matches
    type: DataTypes.INTEGER,
    allowNull: true, // or false depending on your requirement
  },
  quantityPurchased: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  costPricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  salePricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalSaleAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isDebtor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Customers', // Ensure this matches your table name
  timestamps: true,
});

Customer.associate = (models) => {
  Customer.belongsTo(models.Product, { foreignKey: 'purchasedInventoryId' });
};

module.exports = Customer;
[]