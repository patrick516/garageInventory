import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/CustomerForm.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purchasedInventory, setPurchasedInventory] = useState('');
  const [inventoryList, setInventoryList] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [costPricePerUnit, setCostPricePerUnit] = useState('');
  const [salePricePerUnit, setSalePricePerUnit] = useState(''); // Add the missing salePricePerUnit state
  const [totalAmount, setTotalAmount] = useState('');
  const [payment, setPayment] = useState('');
  const [balance, setBalance] = useState('');
  const [isDebtor, setIsDebtor] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventoryList = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/inventory/list');
        setInventoryList(response.data);
      } catch (error) {
        console.error('Error fetching inventory list:', error);
        toast.error('Error fetching inventory list');
      }
    };

    fetchInventoryList();
  }, []);

  // When an inventory item is selected, populate its sale and cost price
  const handleInventoryChange = (e) => {
    const selectedInventory = e.target.value;
    setPurchasedInventory(selectedInventory);

    // Find the selected inventory item by name
    const selectedItem = inventoryList.find(item => item.name === selectedInventory);

    if (selectedItem) {
      setCostPricePerUnit(selectedItem.costPricePerUnit || 0);
      setSalePricePerUnit(selectedItem.salePricePerUnit || 0); // Set the sale price per unit correctly
      calculateTotalAmount(quantity, selectedItem.salePricePerUnit || 0);
    } else {
      // If selectedItem is not found, reset the values
      setCostPricePerUnit(0);
      setSalePricePerUnit(0); // Reset salePricePerUnit
      setTotalAmount(0);
    }
  };

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    const selectedItem = inventoryList.find(item => item.name === purchasedInventory);

    if (selectedItem && qty > selectedItem.quantity) {
      toast.warn(`You can only sell up to ${selectedItem.quantity} units as it is the current available quantity.`, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setQuantity(selectedItem.quantity);
      calculateTotalAmount(selectedItem.quantity, salePricePerUnit); // Use salePricePerUnit
    } else {
      setQuantity(qty);
      calculateTotalAmount(qty, salePricePerUnit); // Use salePricePerUnit
    }
  };

  const calculateTotalAmount = (qty, price) => {
    const total = (parseFloat(qty) || 0) * (parseFloat(price) || 0);
    setTotalAmount(total.toFixed(2));
  };

  const handlePaymentChange = (e) => {
    const paymentValue = parseFloat(e.target.value) || 0;
    setPayment(paymentValue);
    const balanceValue = parseFloat(totalAmount) - paymentValue;
    setBalance(balanceValue.toFixed(2));
    setIsDebtor(balanceValue > 0);

    if (balanceValue <= 0) {
      setPaymentStatus('Paid');
    } else {
      setPaymentStatus('Pending');
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Ensure that purchasedInventory is not undefined
    if (!purchasedInventory) {
      toast.error('Please select an inventory item');
      setLoading(false);
      return;
    }

    // Create new customer object
    const newCustomer = {
      name,
      email,
      phone,
      purchasedInventory: purchasedInventory || '', // Ensure it's not undefined
      quantity,
      costPricePerUnit: parseFloat(costPricePerUnit),
      salePricePerUnit: parseFloat(salePricePerUnit), // Send salePricePerUnit
      totalAmount: parseFloat(totalAmount),
      payment: parseFloat(payment),
      balance: parseFloat(balance),
      isDebtor,
      paymentStatus,
    };

    try {
      // Send the customer data to the backend
      await axios.post('http://localhost:3001/api/customers', newCustomer);
      toast.success('Customer added successfully');
      resetForm();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Error adding customer');
    } finally {
      setLoading(false); // End loading
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPurchasedInventory('');
    setQuantity('');
    setCostPricePerUnit('');
    setSalePricePerUnit(''); // Reset salePricePerUnit
    setTotalAmount('');
    setPayment('');
    setBalance('');
    setIsDebtor(false);
    setPaymentStatus('');
  };

  return (
    <div className="customer-form-container">
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Phone</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Purchased Inventory</label>
          <select 
            value={purchasedInventory} 
            onChange={handleInventoryChange}
            required
          >
            <option value="">Select Inventory</option>
            {inventoryList.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} (Available: {item.quantity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={handleQuantityChange} 
            min="1"
            max={inventoryList.find(item => item.name === purchasedInventory)?.quantity || 0}
            required
          />
        </div>
        <div>
          <label>Cost Price per Unit</label>
          <input 
            type="text" 
            value={costPricePerUnit} 
            readOnly 
          />
        </div>
        <div>
          <label>Sale Price per Unit</label> {/* Corrected label */}
          <input 
            type="text" 
            value={salePricePerUnit} // Corrected usage
            readOnly 
          />
        </div>
        <div>
          <label>Total Amount</label>
          <input 
            type="text" 
            value={totalAmount} 
            readOnly 
          />
        </div>
        <div>
          <label>Payment</label>
          <input 
            type="number" 
            value={payment} 
            onChange={handlePaymentChange} 
            required
          />
        </div>
        <div>
          <label>Balance</label>
          <input 
            type="number" 
            value={balance} 
            readOnly 
          />
        </div>
        <div>
          <label>Is Debtor</label>
          <input 
            type="checkbox" 
            checked={isDebtor} 
            readOnly 
          />
        </div>
        <div>
          <label>Payment Status</label>
          <input 
            type="text" 
            value={paymentStatus} 
            readOnly 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Customer'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CustomerForm;
