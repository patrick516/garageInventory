const { DataTypes } = require('sequelize');
const sequelize = require('../config/tests').sequelize; // Assuming the same config setup as employee.js
const Employee = require('./employeeModel'); // Import Employee model for relationships

const Salary = sequelize.define('Salary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee, // Linking the Employee model
      key: 'id', // Refers to the Employee primary key
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // Ensures cascading deletion on employee removal
  },
  grossSalary: {
    type: DataTypes.FLOAT,
    allowNull: false, // Employee's base gross salary
  },
  allowances: {
    type: DataTypes.FLOAT,
    allowNull: true, // Optional field for allowances
    defaultValue: 0.0, // Default is no allowance
  },
  deductions: {
    type: DataTypes.FLOAT,
    allowNull: true, // Optional field for deductions
    defaultValue: 0.0, // Default is no deductions
  },
  netSalary: {
    type: DataTypes.FLOAT,
    allowNull: false, // This will be calculated
    validate: {
      isFloat: true,
      min: 0, // Ensure net salary is non-negative
    },
  },
  payDate: {
    type: DataTypes.DATE,
    allowNull: false, // Date of payment
    defaultValue: DataTypes.NOW, // Defaults to the current date
  },
}, {
  tableName: 'salaries',
  timestamps: true, // Enable timestamps
});

// Relationship: One Employee has Many Salaries
Employee.hasMany(Salary, { foreignKey: 'employeeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Salary.belongsTo(Employee, { foreignKey: 'employeeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Salary;
