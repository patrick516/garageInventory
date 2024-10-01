import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/DebtorList.css';

const DebtorList = () => {
  const [debtors, setDebtors] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [paymentInputs, setPaymentInputs] = useState({});
  const [popupVisible, setPopupVisible] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/customers/debtors');
        const debtorsData = response.data;
        setDebtors(debtorsData);
        calculateTotals(debtorsData);
      } catch (error) {
        console.error('Error fetching debtors: ', error);
      }
    };

    fetchDebtors();
  }, []);

  const calculateTotals = (debtorsData) => {
    let paidTotal = 0;
    let pendingTotal = 0;

    debtorsData.forEach(debtor => {
      paidTotal += debtor.payment || 0;
      pendingTotal += debtor.balance || 0;
    });

    setTotalPaid(paidTotal);
    setTotalPending(pendingTotal);
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'MK0.00';
    }
    return `MK${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleInputChange = (id, amount) => {
    const enteredAmount = Number(amount);
    const debtor = debtors.find(d => d.id === id);
    const remainingBalance = debtor ? (debtor.balance || 0) - enteredAmount : 0;

    setPaymentInputs({
      ...paymentInputs,
      [id]: enteredAmount
    });

    // Show popup if balance remains
    if (remainingBalance >= 0) {
      setPopupVisible(id);
    } else {
      setPopupVisible(null);
    }
  };

  const handleBlur = () => {
    setPopupVisible(null);
  };

  const handlePayNow = async (id) => {
    const amount = Number(paymentInputs[id]);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const debtor = debtors.find(d => d.id === id);
    if (amount > debtor.balance) {
      toast.error("Payment cannot exceed the remaining balance.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/customers/${id}/pay`, { amount });

      const updatedDebtors = debtors.map(debtor => {
        if (debtor.id === id) {
          debtor.balance -= amount;
          debtor.payment += amount;
        }
        return debtor;
      });

      const debtorWithFullPayment = updatedDebtors.find(debtor => debtor.id === id && debtor.balance === 0);

      if (debtorWithFullPayment) {
        toast.success(`${debtorWithFullPayment.name} has paid off their debt in full.`);
      }

      setDebtors(updatedDebtors);
      calculateTotals(updatedDebtors);

      toast.success("Payment processed successfully.");
      setPaymentInputs({ ...paymentInputs, [id]: '' });
    } catch (error) {
      console.error('Error processing payment: ', error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteCustomerId(id);
    setShowDeleteModal(true); // Show custom modal
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/customers/${deleteCustomerId}`);
      const updatedDebtors = debtors.filter(debtor => debtor.id !== deleteCustomerId);
      setDebtors(updatedDebtors);
      calculateTotals(updatedDebtors);
      toast.success('Customer deleted successfully.');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer.');
    } finally {
      setShowDeleteModal(false); // Close the modal after action
      setDeleteCustomerId(null); // Clear the id
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteCustomerId(null);
  };

  return (
    <div className="debtor-list-container">
      <h2>Debtor List</h2>

      <div className="totals-container">
        <p>Total Amount Paid Previously: <strong>{formatCurrency(totalPaid)}</strong></p>
        <p>Total Remaining Balance (Pending): <strong>{formatCurrency(totalPending)}</strong></p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Amount Paid Previously</th>
            <th>Remaining Balance</th>
            <th>Pay Now (Amount)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {debtors.length === 0 ? (
            <tr>
              <td colSpan="7">No debtors found</td>
            </tr>
          ) : (
            debtors.map((debtor, index) => (
              <tr key={debtor.id}>
                <td>{index + 1}</td>
                <td>{debtor.name}</td>
                <td>{formatCurrency(debtor.payment || 0)}</td>
                <td>{formatCurrency(debtor.balance || 0)}</td>
                <td>
                  {debtor.balance > 0 ? (
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={paymentInputs[debtor.id] || ''}
                      onChange={(e) => handleInputChange(debtor.id, e.target.value)}
                      onBlur={handleBlur}
                      onFocus={() => handleInputChange(debtor.id, paymentInputs[debtor.id] || 0)}
                    />
                  ) : (
                    <span>Paid in Full</span>
                  )}
                  {popupVisible === debtor.id && (
                    <div className="popup">
                      Remaining Balance: {formatCurrency((debtor.balance || 0) - (paymentInputs[debtor.id] || 0))}
                    </div>
                  )}
                </td>
                <td>{debtor.paymentStatus}</td>
                <td>
                  {debtor.balance > 0 ? (
                    <button onClick={() => handlePayNow(debtor.id)}>Pay</button>
                  ) : (
                    <button onClick={() => handleDeleteClick(debtor.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this customer?</h3>
            <button onClick={handleDeleteConfirm} className="confirm-btn">Yes, Delete</button>
            <button onClick={handleDeleteCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DebtorList;
