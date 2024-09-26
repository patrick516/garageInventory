// models/reviewModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/tests'); // Correctly import the Sequelize instance

const Reviews = (sequelize, DataTypes) => {
  return sequelize.define('Reviews', {
    // Define your columns here
  }, {
    tableName: 'Reviews', // Ensure this matches your table name
    timestamps: true,
  });
};

module.exports = Reviews;
