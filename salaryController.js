// controllers/salaryController.js

const { Op } = require('sequelize'); // Import Op for Sequelize queries
const Salary = require('../models/salaryModel');
const Employee = require('../models/employeeModel');

// Add Salary (calculate and add salary for an employee)
exports.calculateSalary = async (req, res) => {
  const { employeeId, grossSalary, allowances, deductions } = req.body;

  // Validation for required fields
  if (!employeeId || !grossSalary) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    // Ensure the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate net salary
    const netSalary = parseFloat(grossSalary) + (parseFloat(allowances || 0) - parseFloat(deductions || 0));

    // Create the salary record
    const newSalary = await Salary.create({
      employeeId,
      grossSalary,
      allowances,
      deductions,
      netSalary,
      payDate: new Date(), // Auto-generate the current date for payDate
    });

    // Optionally mark the employee as having a calculated salary
    await employee.update({ salaryCalculated: true });

    // Respond with success
    res.status(201).json({ message: 'Salary calculated successfully', salary: newSalary });
  } catch (error) {
    console.error('Error adding salary:', error);
    res.status(500).json({ message: 'Error adding salary', error });
  }
};

// Get all calculated salaries
exports.getAllCalculatedSalaries = async (req, res) => {
  try {
    const salaries = await Salary.findAll({ include: [Employee] });

    // If no salaries found, send empty list
    if (salaries.length === 0) {
      return res.status(200).json({ message: 'No salaries found', salaries: [] });
    }

    res.status(200).json(salaries);
  } catch (error) {
    console.error('Error fetching salary list:', error);
    res.status(500).json({ message: 'Error fetching salary list', error });
  }
};

// Mark salary as paid
exports.markSalaryAsPaid = async (req, res) => {
  const { employeeId } = req.params; // Assuming employeeId is provided in the URL

  try {
    const salary = await Salary.findOne({ where: { employeeId } });

    if (!salary) {
      return res.status(404).json({ message: 'Salary not found' });
    }

    // Mark the salary as paid
    salary.paid = true;
    await salary.save();

    res.status(200).json({ message: 'Salary marked as paid', salary });
  } catch (error) {
    console.error('Error marking salary as paid:', error);
    res.status(500).json({ message: 'Error marking salary as paid', error });
  }
};

// Get employees who haven't had salary calculated
exports.getEmployeesWithoutSalary = async (req, res) => {
  try {
    // Find employees without calculated salary
    const employeesWithSalary = await Salary.findAll({ attributes: ['employeeId'] });
    const employeeIdsWithSalary = employeesWithSalary.map(salary => salary.employeeId);

    const employeesWithoutSalary = await Employee.findAll({
      where: {
        id: {
          [Op.notIn]: employeeIdsWithSalary,
        },
      },
    });

    res.status(200).json(employeesWithoutSalary);
  } catch (error) {
    console.error('Error fetching employees without salary:', error);
    res.status(500).json({ message: 'Error fetching employees without salary', error });
  }
};
