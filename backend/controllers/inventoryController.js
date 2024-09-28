const Product = require('../models/productModel');

// Add inventory function
exports.addInventory = async (req, res) => {
  const {
    name,
    brand,
    quantity,
    costPerUnit,
    anyCostIncurred,
    descriptionOfCost,
    totalCosts,
    salePricePerUnit,
    totalCostOfSales
  } = req.body;

  try {
    const newProduct = await Product.create({
      name,
      brand,
      quantity,
      costPerUnit,
      anyCostIncurred,
      descriptionOfCost,
      totalCosts,
      salePricePerUnit,
      totalCostOfSales
    });

    res.status(201).json({
      message: 'Inventory item added successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Error adding inventory item' });
  }
};

// Get inventory list function
exports.getInventoryList = async (req, res) => {
  try {
    const products = await Product.findAll(); // Fetch all products from the database
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching inventory list:', error);
    res.status(500).json({ message: 'Error fetching inventory list' });
  }
};

// Delete inventory function
exports.deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Error deleting inventory item' });
  }
};

// Update inventory function
exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    brand,
    quantity,
    costPerUnit,
    anyCostIncurred,
    descriptionOfCost,
    totalCosts,
    salePricePerUnit,
    totalCostOfSales
  } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.quantity = quantity || product.quantity;
    product.costPerUnit = costPerUnit || product.costPerUnit;
    product.anyCostIncurred = anyCostIncurred || product.anyCostIncurred;
    product.descriptionOfCost = descriptionOfCost || product.descriptionOfCost;
    product.totalCosts = totalCosts || product.totalCosts;
    product.salePricePerUnit = salePricePerUnit || product.salePricePerUnit;
    product.totalCostOfSales = totalCostOfSales || product.totalCostOfSales;

    await product.save();

    res.status(200).json({
      message: 'Inventory item updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Error updating inventory item' });
  }
};
