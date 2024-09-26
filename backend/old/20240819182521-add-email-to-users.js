'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the 'email' column to the 'Users' table
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the 'email' column from the 'Users' table
    await queryInterface.removeColumn('Users', 'email');
  }
};
