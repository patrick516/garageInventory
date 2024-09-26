import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/PaymentForm.css';

const PaymentForm = () => {
  const [debtors, setDebtors] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/customers/debtors');
        setDebtors(response.data);
      } catch (error) {
        console.error('Error fetching debtors:', error);
        setError('Error fetching debtors');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      }
    };

    fetchDebtors();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct && quantity) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/products/${selectedProduct}`);
          const product = response.data;
          const calculatedTotalCost = quantity * product.costPricePerUnit;
          const calculatedTotalSalesAmount = quantity * product.salesPricePerUnit;

          setTotalCost(calculatedTotalCost);
          setTotalSalesAmount(calculatedTotalSalesAmount);
        } catch (error) {
          console.error('Error fetching product details:', error);
          setError('Error fetching product details');
        }
      };

      fetchProductDetails();
    }
  }, [selectedProduct, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/sales', {
        productId: selectedProduct,
        quantity,
        customerId,
        amountPaid,
        saleDate: new Date().toISOString(),
        totalCost,
        totalSalesAmount
      });
      alert('Sale recorded successfully');
      setCustomerId('');
      setSelectedProduct('');
      setQuantity('');
      setAmountPaid('');
      setTotalCost(0);
      setTotalSalesAmount(0);
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Error recording sale');
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Record Sale</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {debtors.map(debtor => (
              <option key={debtor.id} value={debtor.id}>
                {debtor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Cost</label>
          <input
            type="number"
            value={totalCost}
            readOnly
          />
        </div>
        <div>
          <label>Total Sales Amount</label>
          <input
            type="number"
            value={totalSalesAmount}
            readOnly
          />
        </div>
        <div>
          <label>Amount Paid</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            required
          />
        </div>
        <button type="submit">Record Sale</button>
      </form>
    </div>
  );
};

export default PaymentForm;
