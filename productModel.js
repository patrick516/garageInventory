const { DataTypes } = require('sequelize');
const sequelize = require('../config/tests').sequelize; // Adjust this path if needed

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  costPricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  anyCostIncurred: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  descriptionOfCost: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalCosts: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  salePricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalCostOfSales: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'products', // Ensure this matches your table name
  timestamps: true,
});

Product.associate = (models) => {
  Product.hasMany(models.Customer, { foreignKey: 'purchasedInventoryId' });
};

module.exports = Product;
