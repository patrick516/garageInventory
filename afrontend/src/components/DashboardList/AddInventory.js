import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/AddInventory.css';
import { toast } from 'react-toastify';

const AddInventory = ({ itemToEdit, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: '',
    costPricePerUnit: '',
    anyCostIncurred: '',
    descriptionOfCost: '',
    totalCosts: '',
    salePricePerUnit: '',
    totalCostOfSales: '',
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        brand: itemToEdit.brand || '',
        quantity: itemToEdit.quantity || '',
        costPricePerUnit: itemToEdit.costPricePerUnit || '',
        anyCostIncurred: itemToEdit.anyCostIncurred || '',
        descriptionOfCost: itemToEdit.descriptionOfCost || '',
        totalCosts: itemToEdit.totalCosts || '',
        salePricePerUnit: itemToEdit.salePricePerUnit || '',
        totalCostOfSales: itemToEdit.totalCostOfSales || '',
      });
    } else {
      // Reset formData if there's no item to edit
      setFormData({
        name: '',
        brand: '',
        quantity: '',
        costPricePerUnit: '',
        anyCostIncurred: '',
        descriptionOfCost: '',
        totalCosts: '',
        salePricePerUnit: '',
        totalCostOfSales: '',
      });
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const updatedData = {
        ...prevState,
        [name]: value,
      };

      // Calculate Total Costs
      if (name === 'quantity' || name === 'costPricePerUnit' || name === 'anyCostIncurred') {
        const quantity = parseFloat(updatedData.quantity) || 0;
        const costPricePerUnit = parseFloat(updatedData.costPricePerUnit) || 0;
        const anyCostIncurred = parseFloat(updatedData.anyCostIncurred) || 0;

        const totalCosts = (quantity * costPricePerUnit) + anyCostIncurred;
        updatedData.totalCosts = totalCosts.toFixed(2);
      }

      // Calculate Total Cost of Sales when salePricePerUnit or quantity changes
      if (name === 'salePricePerUnit' || name === 'quantity') {
        const quantity = parseFloat(updatedData.quantity) || 0;
        const salePricePerUnit = parseFloat(updatedData.salePricePerUnit) || 0;

        const totalCostOfSales = quantity * salePricePerUnit;
        updatedData.totalCostOfSales = totalCostOfSales.toFixed(2);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (itemToEdit) {
        const response = await axios.put(`http://localhost:3001/api/inventory/update/${itemToEdit.id}`, formData);
        toast.success(response.data.message);
        onUpdate(response.data.product);
      } else {
        const response = await axios.post('http://localhost:3001/api/inventory/add', formData);
        toast.success(response.data.message);
        // Reset form data for adding another inventory
        setFormData({
          name: '',
          brand: '',
          quantity: '',
          costPricePerUnit: '',
          anyCostIncurred: '',
          descriptionOfCost: '',
          totalCosts: '',
          salePricePerUnit: '',
          totalCostOfSales: '',
        });
      }
      onClose();
    } catch (error) {
      console.error('Error processing inventory item:', error);
      toast.error('Error processing inventory item');
    }
  };

  return (
    <div className="add-inventory-container">
      <h2>{itemToEdit ? 'Edit Inventory' : 'Add Inventory'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="costPricePerUnit">cost Price Per Unit</label>
          <input
            type="number"
            id="costPricePerUnit"
            name="costPricePerUnit"
            value={formData.costPricePerUnit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="anyCostIncurred">Any Cost Incurred</label>
          <input
            type="number"
            id="anyCostIncurred"
            name="anyCostIncurred"
            value={formData.anyCostIncurred}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="descriptionOfCost">Description of Cost</label>
          <input
            type="text"
            id="descriptionOfCost"
            name="descriptionOfCost"
            value={formData.descriptionOfCost}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalCosts">Total Costs</label>
          <input
            type="text"
            id="totalCosts"
            name="totalCosts"
            value={formData.totalCosts}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="salePricePerUnit">Sale Price per Unit</label>
          <input
            type="number"
            id="salePricePerUnit"
            name="salePricePerUnit"
            value={formData.salePricePerUnit}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalCostOfSales">Total Cost of Sales</label>
          <input
            type="text"
            id="totalCostOfSales"
            name="totalCostOfSales"
            value={formData.totalCostOfSales}
            readOnly
          />
        </div>
        <div className="form-group">
          <button type="submit">{itemToEdit ? 'Update Item' : 'Add Item'}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;
