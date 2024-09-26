/*const { Sale, Product, Customer } = require('../models'); // Adjust the path as needed

// Create a new sale
const createSale = async (req, res) => {
  const { productId, quantity, customerId, amountPaid, saleDate } = req.body;

  try {
    // Fetch product and customer details
    const product = await Product.findByPk(productId);
    const customer = await Customer.findByPk(customerId);

    if (!product || !customer) {
      return res.status(400).json({ error: 'Invalid product or customer ID' });
    }

    // Calculate totalCost and totalSalesAmount
    const totalCost = quantity * product.costPricePerUnit;
    const totalSalesAmount = quantity * product.salesPricePerUnit;

    // Create sale record
    const sale = await Sale.create({
      productId,
      quantity,
      customerId,
      amountPaid,
      saleDate,
      costPricePerUnit: product.costPricePerUnit,
      salesPricePerUnit: product.salesPricePerUnit,
      totalCost,
      totalSalesAmount
    });

    // Update product stock
    await Product.decrement('stock', { by: quantity, where: { id: productId } });

    // Update customer balance
    await Customer.decrement('balance', { by: amountPaid, where: { id: customerId } });

    res.status(201).json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale' });
  }
};

module.exports = { createSale };
*/