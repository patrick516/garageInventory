import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../../assets/styles/EmployeesList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phoneNumber: '',
    areaOfResidence: '',
    emergencyNumber: '',
    dateJoined: new Date(),
    expectedWorkdays: '',
    expectedSalary: '',
  });
  const [errors, setErrors] = useState({});
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required';
    }
    if (!/^265\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must start with 265 and be exactly 12 digits';
    }
    if (formData.emergencyNumber && !/^\d{3,12}$/.test(formData.emergencyNumber)) {
      newErrors.emergencyNumber = 'Emergency number must be between 3 and 12 digits';
    }
    if (!formData.expectedWorkdays || isNaN(formData.expectedWorkdays) || formData.expectedWorkdays <= 0) {
      newErrors.expectedWorkdays = 'Expected workdays must be a positive number';
    }
    if (!formData.expectedSalary || isNaN(formData.expectedSalary) || formData.expectedSalary < 0) {
      newErrors.expectedSalary = 'Expected salary must be a non-negative number';
    }
    return newErrors;
  };

  const formatCurrency = (amount) => {
    return `MK${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateJoined: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingEmployeeId) {
        await axios.put(`http://localhost:3001/api/employees/${editingEmployeeId}`, formData);
        toast.success('Employee updated successfully!');
      } else {
        await axios.post('http://localhost:3001/api/employees', formData);
        toast.success('Employee added successfully!');
        
      }

      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/employees'); // Correct this line
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employee list:', error);
      toast.error('Failed to fetch employee list');
    }
  };
  

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      email: '',
      phoneNumber: '',
      areaOfResidence: '',
      emergencyNumber: '',
      dateJoined: new Date(),
      expectedWorkdays: '',
      expectedSalary: '',
    });
    setShowForm(false);
    setEditingEmployeeId(null);
    setErrors({});
  };

  const handleEdit = (employee) => {
    setFormData({
      ...employee,
      dateJoined: new Date(employee.dateJoined), // Ensure the date is in the correct format
    });
    setEditingEmployeeId(employee.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3001/api/employees/${id}`);
        toast.success('Employee deleted successfully!');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employee-list-container">
      <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
        <FontAwesomeIcon icon={showForm ? faTimes : faPlus} /> {showForm ? 'Hide Form' : 'Add Employee'}
      </button>

      {showForm && (
        <div className="employee-form-container">
          <h3>{editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}</h3>
          <form onSubmit={handleSubmit} className="employee-form">
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div>
              <label>Position:</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
              {errors.position && <span className="error">{errors.position}</span>}
            </div>

            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
            </div>

            <div>
              <label>Area of Residence:</label>
              <input
                type="text"
                name="areaOfResidence"
                value={formData.areaOfResidence}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Emergency Number (Optional):</label>
              <input
                type="text"
                name="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={handleChange}
              />
              {errors.emergencyNumber && <span className="error">{errors.emergencyNumber}</span>}
            </div>

            <div className="date-picker-container">
              <label>Date Joined:</label>
              <DatePicker
                selected={formData.dateJoined}
                onChange={handleDateChange}
                dateFormat="yyyy/MM/dd"
                required
              />
            </div>

            <div>
              <label>Expected Workdays:</label>
              <input
                type="number"
                name="expectedWorkdays"
                value={formData.expectedWorkdays}
                onChange={handleChange}
                required
              />
              {errors.expectedWorkdays && <span className="error">{errors.expectedWorkdays}</span>}
            </div>

            <div>
              <label>Expected Salary:</label>
              <input
                type="number"
                step="0.01"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                required
              />
              {errors.expectedSalary && <span className="error">{errors.expectedSalary}</span>}
            </div>

            <button type="submit">{editingEmployeeId ? 'Update Employee' : 'Add Employee'}</button>
          </form>
        </div>
      )}

      <div className="employee-list-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Area of Residence</th>
              <th>Emergency Number</th>
              <th>Date Joined</th>
              <th>Expected Workdays</th>
              <th>Expected Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {Array.isArray(employees) && employees.length > 0 ? (
              employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="tooltip-container">
                   {employee.name.length > 10 ? `${employee.name.substring(0, 10)}...` : employee.name}
                   <span className="tooltip-text">{employee.name}</span>
                  </div>
               </td>
              <td>
                <div className="tooltip-container">
                 {employee.position}
                </div>
              </td>
             <td>
                <div className="tooltip-container">
                {employee.email.length > 15 ? `${employee.email.substring(0, 15)}...` : employee.email}
                 <span className="tooltip-text">{employee.email}</span>
                </div>
             </td>
              <td>{employee.phoneNumber}</td>
              <td>{employee.areaOfResidence}</td>
              <td>{employee.emergencyNumber}</td>
              <td>{new Date(employee.dateJoined).toLocaleDateString()}</td>
              <td>{employee.expectedWorkdays}</td>
              <td>{formatCurrency(employee.expectedSalary)}</td>
            <td>
              <button onClick={() => handleEdit(employee)}>
              <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDelete(employee.id)}>
              <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
            </tr>
             ))
           ) : (
        <tr>
         <td colSpan="10" className="no-employees">No employees found</td>
         </tr>
        )}
        </tbody>


        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
