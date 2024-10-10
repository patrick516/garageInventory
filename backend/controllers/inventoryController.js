const Product = require('../models/productModel');

// Add inventory function with barcode check
exports.addInventory = async (req, res) => {
  const {
    barcode, // Add barcode to the request body
    name,
    brand,
    quantity,
    costPricePerUnit,
    anyCostIncurred,
    descriptionOfCost,
    totalCosts,
    salePricePerUnit,
    totalCostOfSales
  } = req.body;

  try {
    // Check if a product with the same barcode exists
    let existingProduct = await Product.findOne({ where: { barcode } });

    if (existingProduct) {
      // If product exists, increment the quantity
      existingProduct.quantity += quantity || 1; // Default increment by 1 if no quantity is provided
      await existingProduct.save();

      return res.status(200).json({
        message: 'Product already exists, quantity updated',
        product: existingProduct
      });
    }

    // If product doesn't exist, create a new product
    const newProduct = await Product.create({
      barcode, // Save the barcode
      name, // Optional when using barcode
      brand, // Optional when using barcode
      quantity: quantity || 1, // Default to 1 if no quantity is provided
      costPricePerUnit,
      anyCostIncurred,
      descriptionOfCost,
      totalCosts,
      salePricePerUnit,
      totalCostOfSales
    });

    res.status(201).json({
      message: 'New product added successfully',
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
    barcode, // Allow updating barcode as well
    name,
    brand,
    quantity,
    costPricePerUnit,
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
    product.barcode = barcode || product.barcode;
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.quantity = quantity || product.quantity;
    product.costPricePerUnit = costPricePerUnit || product.costPricePerUnit;
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
