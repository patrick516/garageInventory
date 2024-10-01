import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../assets/styles/InventoryList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddInventory from './AddInventory'; // Import AddInventory component

const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/inventory/list');
        setInventoryItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory list:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/inventory/delete/${id}`);
      setInventoryItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Inventory item deleted successfully');
    } catch (error) {
      toast.error('Error deleting inventory item');
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleUpdate = (updatedItem) => {
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    handleCloseEdit();
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return `MK${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate totals
  const totalCosts = inventoryItems.reduce((acc, item) => {
    const costPricePerUnit = Number(item.costPricePerUnit) || 0;
    const quantity = Number(item.quantity) || 0;
    const anyCostIncurred = Number(item.anyCostIncurred) || 0;
    return acc + (costPricePerUnit * quantity + anyCostIncurred);
  }, 0);

  const totalSales = inventoryItems.reduce((acc, item) => {
    const salePricePerUnit = Number(item.salePricePerUnit) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + (salePricePerUnit * quantity);
  }, 0);

  const profitOrLoss = totalSales - totalCosts;

  return (
    <div className="inventory-list-container">
      <h2>Inventory List</h2>
  
      {/* Summary Section */}
      <div className="summary">
        <p>Total Costs (MK): {formatCurrency(totalCosts)}</p>
        <p>Total Sales (MK): {formatCurrency(totalSales)}</p>
        <p>
          Profit/Loss (MK): {profitOrLoss > 0 ? '+' : ''}{formatCurrency(profitOrLoss)}
        </p>
      </div>
  
      {isEditing && (
        <AddInventory
          itemToEdit={selectedItem}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}
  
      {inventoryItems.length > 0 ? (
        <div className="inventory-list-wrapper"> {/* New wrapper div for styling */}
          <table className="inventory-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Cost/Unit (MK)</th>
                <th>Total Costs (MK)</th>
                <th>Sales/Unit (MK)</th>
                <th>Total Sales (MK)</th>
                <th>Date & Time Recorded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => {
                const costPricePerUnit = Number(item.costPricePerUnit) || 0;
                const quantity = Number(item.quantity) || 0;
                const totalCosts = (costPricePerUnit * quantity) + (Number(item.anyCostIncurred) || 0);
                const salePricePerUnit = Number(item.salePricePerUnit) || 0;
                const totalSales = salePricePerUnit * quantity;
  
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>{quantity}</td>
                    <td>{formatCurrency(costPricePerUnit)}</td>
                    <td>{formatCurrency(totalCosts)}</td>
                    <td>{formatCurrency(salePricePerUnit)}</td>
                    <td>{formatCurrency(totalSales)}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="item-actions">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="edit-icon"
                        title="Edit"
                        onClick={() => handleEdit(item)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        title="Delete"
                        onClick={() => handleDelete(item.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> // Close the wrapper div here
      ) : (
        <div className="no-items">No inventory items found</div>
      )}
    </div>
  );
  };
  
  export default InventoryList;
  