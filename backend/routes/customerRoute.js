const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Define routes
router.get('/debtors', customerController.getDebtors);
router.post('/', customerController.addCustomer);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.put('/:id/pay', customerController.updateCustomerPayment); // Update payment for a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
