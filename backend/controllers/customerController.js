const db = require('../models');
const Product = db.Product; // Ensure this path is correct
const Customer = db.Customer; // Ensure this path is correct
const sendEmail = require('../services/mailer');

// Add a new customer
exports.addCustomer = async (req, res) => {
    console.log('Request received:', req.body);

    const { name, email, phone, purchasedInventoryId, quantity = 1, totalAmount = 0, payment = 0 } = req.body;

    // Validate purchasedInventoryId
    if (!purchasedInventoryId) {
        return res.status(400).json({ message: 'Purchased Inventory ID is required' });
    }

    try {
        let costPricePerUnit = 0;
        let salePricePerUnit = 0;
        let totalCost = 0;
        let totalSaleAmount = 0;

        // Fetch product details using purchasedInventoryId
        const product = await Product.findByPk(purchasedInventoryId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Perform calculations
        costPricePerUnit = product.costPricePerUnit || 0;
        salePricePerUnit = product.salePricePerUnit || 0;
        totalCost = quantity * costPricePerUnit;
        totalSaleAmount = quantity * salePricePerUnit;

        const balance = parseFloat(totalAmount) - parseFloat(payment);

        const newCustomer = await Customer.create({
            name,
            email,
            phone,
            purchasedInventoryId,
            quantityPurchased: parseInt(quantity, 10),
            costPricePerUnit,
            salePricePerUnit,
            totalCost,
            totalSaleAmount,
            totalAmount,
            payment,
            balance,
            isDebtor: balance > 0,
            paymentStatus: balance <= 0 ? 'Paid' : 'Pending',
        });

        if (balance > 0) {
            await sendEmail(
                email,
                'Reminder: Outstanding Balance',
                `Dear ${name}, you have an outstanding balance of ${balance}. Please make the payment as soon as possible.`
            );
        } else {
            await sendEmail(
                email,
                'Thank You for Your Purchase!',
                `Dear ${name}, thank you for your purchase with UAS Motors. Your balance is now zero.`
            );
        }

        res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ message: 'Error adding customer' });
    }
};

// Update a customer's details
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, purchasedInventoryId, quantity, totalAmount, payment } = req.body;

    try {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        let costPricePerUnit = customer.costPricePerUnit;
        let salePricePerUnit = customer.salePricePerUnit;
        let totalCost = customer.totalCost;
        let totalSaleAmount = customer.totalSaleAmount;

        // Update the values if a product is selected
        if (purchasedInventoryId) {
            // Validate purchasedInventoryId
            const product = await Product.findByPk(purchasedInventoryId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            costPricePerUnit = product.costPricePerUnit || 0;
            salePricePerUnit = product.salePricePerUnit || 0;
            totalCost = (quantity || customer.quantityPurchased) * costPricePerUnit;
            totalSaleAmount = (quantity || customer.quantityPurchased) * salePricePerUnit;
        }

        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.phone = phone || customer.phone;
        customer.purchasedInventoryId = purchasedInventoryId || customer.purchasedInventoryId; 
        customer.quantityPurchased = parseInt(quantity, 10) || customer.quantityPurchased; 
        customer.totalAmount = totalAmount || customer.totalAmount;
        customer.payment = payment || customer.payment;

        const balance = parseFloat(customer.totalAmount) - parseFloat(customer.payment);
        customer.balance = balance;
        customer.isDebtor = balance > 0;
        customer.paymentStatus = balance <= 0 ? 'Paid' : 'Pending';
        customer.costPricePerUnit = costPricePerUnit;
        customer.salePricePerUnit = salePricePerUnit;
        customer.totalCost = totalCost;
        customer.totalSaleAmount = totalSaleAmount;

        await customer.save();

        res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Error updating customer' });
    }
};


// Update payment for a customer
exports.updateCustomerPayment = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount entered' });
    }

    try {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const newBalance = customer.balance - amount;

        if (newBalance < 0) {
            return res.status(400).json({ message: 'Amount exceeds the remaining balance' });
        }

        customer.payment += amount;
        customer.balance = newBalance;
        customer.paymentStatus = newBalance <= 0 ? 'Paid' : 'Pending';

        await customer.save();

        res.status(200).json({ message: 'Payment updated successfully', customer });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Error updating payment', error });
    }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.destroy();

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Error deleting customer' });
    }
};

// Fetch customers who are debtors
exports.getDebtors = async (req, res) => {
    try {
        const debtors = await Customer.findAll({ 
            where: { isDebtor: true },
            attributes: ['id', 'name', 'payment', 'balance', 'paymentStatus'] // Only fetch necessary fields
        });

        if (debtors.length === 0) {
            return res.status(200).json({ message: 'No debtors found', debtors: [] });
        }

        res.status(200).json(debtors);
    } catch (error) {
        console.error('Error fetching debtors:', error);
        res.status(500).json({ message: 'Error fetching debtors' });
    }
};

// Fetch all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers' });
    }
};

// Fetch customer by ID
exports.getCustomerById = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Error fetching customer' });
    }
};
