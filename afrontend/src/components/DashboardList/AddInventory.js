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
    barcode: '',  // Changed from inventoryCode to barcode
  });

  // Function to handle camera access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.getElementById('camera-feed');
      videoElement.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Error accessing camera');
    }
  };

  // Play sound on scan
  const playSound = () => {
    const audio = new Audio('/path/to/your/beep-sound.mp3'); // Add your sound file here
    audio.play();
  };

  // Function to trigger vibration (if supported)
  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200); // Vibrate for 200 milliseconds
    }
  };

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
        barcode: itemToEdit.barcode || '', // Changed from inventoryCode to barcode
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
        barcode: '', // Reset the barcode as well
      });
    }

    // Start the camera when the form opens
    startCamera();

    // Setup WebSocket to listen for barcode scans
    const socket = new WebSocket('ws://localhost:3002'); // Replace with your actual WebSocket URL

    socket.onmessage = function (event) {
      const barcodeData = event.data; // This is the scanned barcode data
      fillInventoryForm(barcodeData);
    };

    return () => {
      socket.close(); // Cleanup on component unmount
    };
  }, [itemToEdit]);

  const fillInventoryForm = (barcodeData) => {
    setFormData(prevState => ({
      ...prevState,
      barcode: barcodeData, // Changed from inventoryCode to barcode
    }));
    playSound(); // Play beep sound on scan
    triggerVibration(); // Trigger vibration on scan
  };

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
          barcode: '', // Reset the barcode for new entries
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
          <label htmlFor="barcode">Barcode</label> {/* Changed label from Inventory Code to Barcode */}
          <input
            type="text"
            id="barcode"
            name="barcode" // Changed name from inventoryCode to barcode
            value={formData.barcode}
            onChange={handleChange}
            placeholder="Scan barcode here"
          />
        </div>
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
          <label htmlFor="costPricePerUnit">Cost Price Per Unit</label>
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
        <button type="submit" className="btn-primary">
          {itemToEdit ? 'Update Inventory' : 'Add Inventory'}
        </button>
      </form>
    </div>
  );
};

export default AddInventory;
