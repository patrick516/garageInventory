'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Removing existing columns
    await queryInterface.removeColumn('products', 'title');
    await queryInterface.removeColumn('products', 'price');
    await queryInterface.removeColumn('products', 'description');
    await queryInterface.removeColumn('products', 'createdAt');
    await queryInterface.removeColumn('products', 'updatedAt');

    // Adding new columns
    await queryInterface.addColumn('products', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'brand', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'costPerUnit', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'anyCostIncurred', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'descriptionOfCost', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'totalCosts', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'salePricePerUnit', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'totalCostOfSales', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    // Re-add the old columns
    await queryInterface.addColumn('products', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('products', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns added in the up method
    await queryInterface.removeColumn('products', 'name');
    await queryInterface.removeColumn('products', 'brand');
    await queryInterface.removeColumn('products', 'quantity');
    await queryInterface.removeColumn('products', 'costPerUnit');
    await queryInterface.removeColumn('products', 'anyCostIncurred');
    await queryInterface.removeColumn('products', 'descriptionOfCost');
    await queryInterface.removeColumn('products', 'totalCosts');
    await queryInterface.removeColumn('products', 'salePricePerUnit');
    await queryInterface.removeColumn('products', 'totalCostOfSales');
    await queryInterface.removeColumn('products', 'createdAt');
    await queryInterface.removeColumn('products', 'updatedAt');

    // Re-add the old columns
    await queryInterface.addColumn('products', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn('products', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('products', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });
  }
};
