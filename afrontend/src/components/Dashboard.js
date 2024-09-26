import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './services/authService';
import AdminDashboard from './DashboardList/AdminDashboard';
import AddInventory from './DashboardList/AddInventory';
import InventoryList from './DashboardList/InventoryList';
import Notifications from './DashboardList/Notifications';
import StaffManagement from './DashboardList/StaffManagement';
import EmployeesList from './DashboardList/EmployeesList'; 
import SalaryCalculation from './DashboardList/SalaryCalculation';
import Header from './Helper/Header';
import Footer from './Helper/Footer';
import CustomerForm from './DashboardList/Customer';
import PaymentForm from './DashboardList/PaymentForm';
import DebtorList from './DashboardList/DebtorList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('AdminDashboard');
  const [showStaffSubmenu, setShowStaffSubmenu] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log('Current User:', currentUser); // Debugging line
    setUser(currentUser);

    const handleUserActivity = () => {
      clearTimeout(window.logoutTimer);
      window.logoutTimer = setTimeout(() => {
        authService.logout();
        navigate('/login');
      }, 3000000);
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    handleUserActivity();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(window.logoutTimer);
    };
  }, [navigate]);

  const toggleStaffSubmenu = () => {
    setShowStaffSubmenu(!showStaffSubmenu);
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="sidebar-header">
          {user ? (
          <>
           <i className="fa-solid fa-user-nurse user-nurse-icon"></i>
           <div className="online-status">Online</div>
           <div className="user-greeting">Hi {user.username}</div> {/* Display the user's name */}
          </>
          ) : (
         <h2>Navigation</h2>
          )}
          </div>
          <ul className="menu-list">
            <li onClick={() => setActiveSection('AdminDashboard')}>Admin Dashboard</li>
            <li onClick={() => setActiveSection('AddInventory')}>Add Inventories</li>
            <li onClick={() => setActiveSection('InventoryList')}>Inventory List</li>
            <li onClick={() => setActiveSection('Notifications')}>Notifications</li>
            <li onClick={() => setActiveSection('CustomerForm')}>Add Customer</li>
            <li onClick={() => setActiveSection('PaymentForm')}>Record Payment</li>
            <li onClick={() => setActiveSection('DebtorList')}>Debtor List</li>
            <li onClick={toggleStaffSubmenu}>
              Staff Management
              {showStaffSubmenu && (
                <ul className="submenu-list">
                  <li className="employees-list-item" onClick={() => setActiveSection('EmployeesList')}>Employees Summary</li>
                  <li className="salary-calculation-item" onClick={() => setActiveSection('SalaryCalculation')}>Salary Info</li>
                </ul>
              )}
            </li>
            <li
              onClick={() => {
                authService.logout();
                navigate('/login');
              }}
            >
              Logout
            </li>
          </ul>
        </div>
        <div className="main-content">
          {activeSection === 'AdminDashboard' && <AdminDashboard />}
          {activeSection === 'AddInventory' && <AddInventory />}
          {activeSection === 'InventoryList' && <InventoryList />}
          {activeSection === 'Notifications' && <Notifications />}
          {activeSection === 'CustomerForm' && <CustomerForm />}
          {activeSection === 'PaymentForm' && <PaymentForm />}
          {activeSection === 'DebtorList' && <DebtorList />}
          {activeSection === 'StaffManagement' && <StaffManagement />}
          {activeSection === 'EmployeesList' && <EmployeesList />}
          {activeSection === 'SalaryCalculation' && <SalaryCalculation />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
