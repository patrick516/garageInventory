const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.post('/calculate', salaryController.calculateSalary);
router.get('/', salaryController.getAllCalculatedSalaries);
router.post('/:employeeId/mark-paid', salaryController.markSalaryAsPaid);
router.get('/employees/without-salary', salaryController.getEmployeesWithoutSalary);

module.exports = router;
