// controllers/employeeController.js

const Employee = require('../models/employeeModel');

// Add Employee
exports.addEmployee = async (req, res) => {
  const { 
    name, 
    position, 
    email, 
    phoneNumber, 
    areaOfResidence, 
    emergencyNumber, 
    dateJoined, 
    expectedWorkdays, 
    expectedSalary 
  } = req.body;

  // Validation for required fields
  if (!name || !position || !phoneNumber || !expectedWorkdays || !expectedSalary) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    // Create new employee entry
    const newEmployee = await Employee.create({
      name,
      position,
      email: email || null, // Allow null if email is not provided
      phoneNumber,
      areaOfResidence,
      emergencyNumber: emergencyNumber || null, // Allow null for optional emergency number
      dateJoined,
      expectedWorkdays,
      expectedSalary,
    });

    // Respond with success
    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
};

// Get Employee List
exports.getEmployeeList = async (req, res) => {
  try {
    const employees = await Employee.findAll();

    // If no employees found, send empty list
    if (employees.length === 0) {
      return res.status(200).json({ message: 'No employees found', employees: [] });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    res.status(500).json({ message: 'Error fetching employee list', error });
  }
};

// Get Employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    position, 
    email, 
    phoneNumber, 
    areaOfResidence, 
    emergencyNumber, 
    dateJoined, 
    expectedWorkdays, 
    expectedSalary 
  } = req.body;

  try {
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    employee.name = name || employee.name;
    employee.position = position || employee.position;
    employee.email = email || employee.email;
    employee.phoneNumber = phoneNumber || employee.phoneNumber;
    employee.areaOfResidence = areaOfResidence || employee.areaOfResidence;
    employee.emergencyNumber = emergencyNumber || employee.emergencyNumber;
    employee.dateJoined = dateJoined || employee.dateJoined;
    employee.expectedWorkdays = expectedWorkdays || employee.expectedWorkdays;
    employee.expectedSalary = expectedSalary || employee.expectedSalary;

    await employee.save();

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};
