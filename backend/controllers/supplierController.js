const Supplier = require('../models/supplierModel');

// Other controller methods remain the same...

// Add a new supplier
exports.addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, inventoryName } = req.body;
    const newSupplier = await Supplier.create({ name, email, phone, address, inventoryName });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: 'Error adding supplier', error });
  }
};

// Update an existing supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, inventoryName } = req.body;
    const updatedSupplier = await Supplier.update(
      { name, email, phone, address, inventoryName },
      { where: { id: req.params.id } }
    );
    if (updatedSupplier[0] === 0) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
};
