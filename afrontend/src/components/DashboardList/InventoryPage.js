import React, { useState } from 'react';
import InventoryList from './InventoryList';
import AddInventory from './AddInventory';
import EditInventory from './EditInventory';

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);

  const addInventoryItem = (item) => {
    setInventoryItems([...inventoryItems, item]);
  };

  const handleEdit = (index) => {
    setItemToEdit(inventoryItems[index]);
  };

  const handleDelete = (index) => {
    const updatedItems = inventoryItems.filter((_, i) => i !== index);
    setInventoryItems(updatedItems);
  };

  const handleSaveEdit = (updatedItem) => {
    const updatedItems = inventoryItems.map(item =>
      item === itemToEdit ? updatedItem : item
    );
    setInventoryItems(updatedItems);
    setItemToEdit(null);
  };

  return (
    <div>
      <AddInventory addInventoryItem={addInventoryItem} />
      <InventoryList
        inventoryItems={inventoryItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {itemToEdit && (
        <EditInventory
          item={itemToEdit}
          onSave={handleSaveEdit}
          onCancel={() => setItemToEdit(null)}
        />
      )}
    </div>
  );
};

export default InventoryPage;
