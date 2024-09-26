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
  const [selectedItem, setSelectedItem] = useState(null); // State to track selected item for editing
  const [isEditing, setIsEditing] = useState(false); // State to toggle between add/edit modes

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
    setSelectedItem(item); // Set the item to be edited
    setIsEditing(true); // Switch to edit mode
  };

  const handleCloseEdit = () => {
    setIsEditing(false); // Close the edit form
    setSelectedItem(null); // Clear selected item
  };

  const handleUpdate = (updatedItem) => {
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    handleCloseEdit(); // Close the edit form
  };

  return (
    <div className="inventory-list-container">
      <h2>Inventory List</h2>
      {isEditing && (
        <AddInventory
          itemToEdit={selectedItem}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}
      {inventoryItems.length > 0 ? (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Quantityy</th>
              <th>Cost/Unit<br></br>MK</th>
              <th>Total<br></br>MK</th>
              <th>Sales <br></br>MK</th> {}
              <th>Date & Time Recorded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, index) => {
              const purchasedQuantity = item.purchasedQuantity || 0; // Use the purchased quantity
              const calculatedSales = purchasedQuantity * item.salePricePerUnit; // Calculate sales based on purchase quantity

              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.quantity}</td> {/* Original quantity in stock */}
                  <td>{item.costPerUnit}</td>
                  <td>{item.totalCosts}</td>
                  <td>{calculatedSales}</td> {/* Display sales based on the customer's purchase */}
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
      ) : (
        <div className="no-items">No inventory items found</div>
      )}
    </div>
  );
};

export default InventoryList;
