// models/index.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');


// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

//Associations
//Product.hasMany(Customer, { foreignKey: 'purchasedInventoryId' });
//Customer.belongsTo(Product, { foreignKey: 'purchasedInventoryId' });

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('../models/userModel');        // Import user model
db.Product = require('../models/productModel');  // Import product model
db.Review = require('../models/reviewModel');    // Import review model
db.Customer = require('../models/customerModel');// Import customer model
db.Sales = require('../models/salesModel');      // Import sales model
db.Employee = require('../models/employeeModel');      // Import sales model
db.Salary = require('../models/salaryModel');
db.Supplier = require('../models/supplierModel');

// Export the db object
module.exports = db;
