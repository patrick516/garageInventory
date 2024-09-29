const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController'); // Ensure the path is correct

// Define routes

router.post('/', employeeController.addEmployee); // Route to add a new employee
router.get('/', employeeController.getEmployeeList); // Route to get all employees
router.get('/:id', employeeController.getEmployeeById); // Route to get an employee by ID
router.put('/:id', employeeController.updateEmployee); // Route to update an employee
router.delete('/:id', employeeController.deleteEmployee); // Route to delete an employee

module.exports = router;
