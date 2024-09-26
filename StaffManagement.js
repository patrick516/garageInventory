import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardList.css';
import '../../assets/styles/StaffManagement.css';

const StaffManagement = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDefaultContent, setShowDefaultContent] = useState(true); // State to show default content
  const navigate = useNavigate();

  // Handle navigation and hide default content
  const handleNavigation = (path) => {
    setShowDefaultContent(false); // Hide default content when a submenu is clicked
    navigate(path);
  };

  return (
    <div>
      <li onClick={() => setIsExpanded(!isExpanded)}>
        Staff Management {isExpanded ? '-' : '+'}
      </li>
      {isExpanded && (
        <ul className="submenu">
          <li
            className="employees-list-item"
            onClick={() => handleNavigation('/dashboard/employees-list')}
          >
            Employees List
          </li>
          <li
            className="salary-calculation-item"
            onClick={() => handleNavigation('/dashboard/salary-calculation')}
          >
            Salary 
          </li>
        </ul>
      )}

      {/* Default heading content */}
      {showDefaultContent && (
        <div className="default-staff-management-content">
          <h2>Welcome to Staff Management</h2>
          <p>Use the sidebar to manage employees and calculate salaries.</p>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
