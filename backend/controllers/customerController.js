const db = require('../models');
const Product = db.Product;
const Customer = db.Customer;
const sendEmail = require('../services/mailer');

// Add a new customer
exports.addCustomer = async (req, res) => {
    console.log('Received request to add customer:', req.body);

    const {
        name,
        email,
        phone,
        purchasedInventory,
        quantity = 1,
        totalAmount = 0,
        payment = 0
    } = req.body;

    if (!purchasedInventory) {
        return res.status(400).json({ message: 'Purchased Inventory ID is required' });
    }

    try {
        const product = await Product.findOne({
            where: { name: purchasedInventory }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const costPricePerUnit = product.costPricePerUnit || 0;
        const salePricePerUnit = product.salePricePerUnit || 0;
        const totalCost = quantity * costPricePerUnit;
        const totalSaleAmount = quantity * salePricePerUnit;
        const balance = parseFloat(totalAmount) - parseFloat(payment);

        // Create a new customer record
        const newCustomer = await Customer.create({
            name,
            email,
            phone,
            purchasedInventory: purchasedInventory,
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
            lastEmailSent: balance <= 0 ? new Date() : null, // Set lastEmailSent for fully paid customers
        });

        // Send email based on balance
        const emailSubject = balance > 0 ? 'Reminder: Outstanding Balance' : 'Thank You for Your Purchase!';
        const emailBody = `Dear ${name}, ${balance > 0 ? `you have an outstanding balance of ${balance}.` : 'thank you for your purchase with UAS Motors. Your balance is now zero.'}`;
        
        await sendEmail(email, emailSubject, emailBody);

        res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error adding customer', error: error.message });
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

        // Update lastEmailSent if the customer fully pays off the balance
        if (newBalance === 0) {
            customer.lastEmailSent = new Date();
            const emailSubject = 'Thank You for Your Payment!';
            const emailBody = `Dear ${customer.name}, thank you for completing your payment. Your balance is now zero.`;

            await sendEmail(customer.email, emailSubject, emailBody);
        }

        await customer.save();

        res.status(200).json({ message: 'Payment updated successfully', customer });
    } catch (error) {
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
exports.sendReminderEmailsToDebtors = async () => {
    try {
        const debtors = await Customer.findAll({
            where: { isDebtor: true },
        });

        const currentDate = new Date();

        for (const debtor of debtors) {
            const lastEmailSent = debtor.lastEmailSent;
            const daysSinceLastEmail = lastEmailSent
                ? Math.floor((currentDate - new Date(lastEmailSent)) / (1000 * 60 * 60 * 24))
                : null;

            // Send a reminder only if no email has been sent in the past 5 days
            if (!lastEmailSent || daysSinceLastEmail >= 5) {
                const emailSubject = 'Reminder: Outstanding Balance';
                const emailBody = `Dear ${debtor.name}, you have an outstanding balance of ${debtor.balance}. Please make the payment at your earliest convenience.`;

                await sendEmail(debtor.email, emailSubject, emailBody);

                // Update lastEmailSent field
                debtor.lastEmailSent = currentDate;
                await debtor.save();
            }
        }

        console.log('Reminder emails sent to debtors.');
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
};
