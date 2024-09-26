// src/components/SalaryCalculationForm.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../assets/styles/SalaryCalculation.css'; // Ensure the path is correct

const SalaryCalculationForm = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [grossSalary, setGrossSalary] = useState(0);
    const [allowances, setAllowances] = useState(0);
    const [deductions, setDeductions] = useState(0);
    const [daysReported, setDaysReported] = useState(0);
    const [netSalary, setNetSalary] = useState(0);
    const [formVisible, setFormVisible] = useState(false); // State to control form visibility

    useEffect(() => {
        // Fetch employees on component mount
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/employees");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                toast.error("Error fetching employees."); // Toast notification for error
            }
        };

        fetchEmployees();
    }, []);

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        setGrossSalary(employee.grossSalary); // Assuming the employee object has grossSalary property
        setDaysReported(0); // Reset days reported on new selection
        setAllowances(0); // Reset allowances on new selection
        setDeductions(0); // Reset deductions on new selection
        setFormVisible(true); // Show the form when an employee is selected
        toast.success("Employee selected successfully."); // Toast notification for success
    };

    const calculateNetSalary = () => {
        const expectedDays = 30; // Assuming the expected working days in a month is 30
        const ratePerDay = grossSalary / expectedDays; // Calculate rate per day
        const actualEarnings = ratePerDay * daysReported; // Calculate actual earnings based on days reported
        const totalNetSalary = actualEarnings + parseFloat(allowances) - parseFloat(deductions); // Calculate net salary
        setNetSalary(totalNetSalary);
    };

    // Recalculate net salary whenever any related input changes
    useEffect(() => {
        if (formVisible) {
            calculateNetSalary();
        }
    }, [grossSalary, allowances, deductions, daysReported, formVisible]);

    return (
        <div className="salary-calculation-container">
            <h2>Salary Calculation</h2>
            <label htmlFor="employee">Select Employee:</label>
            <select id="employee" onChange={(e) => handleEmployeeSelect(employees[e.target.selectedIndex])}>
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                        {employee.name} {/* Assuming each employee has an id and name */}
                    </option>
                ))}
            </select>

            {formVisible && (
                <form className="salary-calculation-form">
                    <label htmlFor="grossSalary">Gross Salary:</label>
                    <input type="number" id="grossSalary" value={grossSalary} readOnly />

                    <label htmlFor="daysReported">Days Reported:</label>
                    <input
                        type="number"
                        id="daysReported"
                        value={daysReported}
                        onChange={(e) => setDaysReported(e.target.value)}
                    />

                    <label htmlFor="allowances">Allowances:</label>
                    <input
                        type="number"
                        id="allowances"
                        value={allowances}
                        onChange={(e) => setAllowances(e.target.value)}
                    />

                    <label htmlFor="deductions">Deductions:</label>
                    <input
                        type="number"
                        id="deductions"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                    />

                    <label htmlFor="netSalary">Net Salary:</label>
                    <input type="number" id="netSalary" value={netSalary} readOnly />

                    {/* Icons for confirmation or error notifications */}
                    <div className="notification-icons">
                        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                        <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />
                    </div>
                </form>
            )}

            {/* Display selected employee's details and calculated salary */}
            {selectedEmployee && (
                <div className="selected-employee-info">
                    <h3>Selected Employee: {selectedEmployee.name}</h3>
                    <p>Gross Salary: {selectedEmployee.grossSalary}</p>
                    <p>Days Reported: {daysReported}</p>
                    <p>Allowances: {allowances}</p>
                    <p>Deductions: {deductions}</p>
                    <p>Net Salary: {netSalary}</p>
                </div>
            )}
        </div>
    );
};

export default SalaryCalculationForm;
