import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditInventory from './EditInventory'; // Adjust the import path as necessary
import '../../assets/styles/InventoryList.css'; // Adjust the import path as necessary

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditInventoryOpen, setIsEditInventoryOpen] = useState(false);

  useEffect(() => {
    // Fetch inventory items
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/inventory');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditInventoryOpen(true);
  };

  const handleClose = () => {
    setIsEditInventoryOpen(false);
    setSelectedItem(null); // Clear selected item when closing
  };

  const handleSave = async (updatedItem) => {
    try {
      await axios.put(`http://localhost:3001/api/inventory/${updatedItem.id}`, updatedItem);
      setInventory(prevInventory => 
        prevInventory.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
    handleClose();
  };

  return (
    <div>
      <h2>Inventory List</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.brand}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditInventoryOpen && (
        <EditInventory
          item={selectedItem}
          onSave={handleSave}
          onCancel={handleClose}
        />
      )}
    </div>
  );
};

export default InventoryList;
