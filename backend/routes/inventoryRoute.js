const express = require('express');
const router = express.Router();

// Import specific functions from the inventoryController
const { addInventory, getInventoryList, deleteInventory } = require('../controllers/inventoryController');

// Route to add inventory
router.post('/add', addInventory);

// Route to get all inventory items
router.get('/list', getInventoryList);

// Route to delete an inventory item
router.delete('/delete/:id', deleteInventory);

module.exports = router;
