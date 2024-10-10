import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/addSupplier.css'; // Adjust path as needed

const AddSupplier = ({ supplierToEdit, onClose, onUpdate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [inventoryName, setInventoryName] = useState('');

  useEffect(() => {
    if (supplierToEdit) {
      setName(supplierToEdit.name);
      setEmail(supplierToEdit.email);
      setPhone(supplierToEdit.phone);
      setAddress(supplierToEdit.address);
      setInventoryName(supplierToEdit.inventoryName || ''); // Set existing inventory name
    }
  }, [supplierToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = { name, email, phone, address, inventoryName };

    try {
      let response;
      if (supplierToEdit) {
        response = await axios.put(`http://localhost:3001/api/suppliers/${supplierToEdit.id}`, supplierData);
        toast.success('Supplier updated successfully');
        onUpdate(response.data);
      } else {
        response = await axios.post('http://localhost:3001/api/suppliers', supplierData);
        toast.success('Supplier added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Error adding/updating supplier');
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-supplier-modal">
      <h2>{supplierToEdit ? 'Edit Supplier' : 'Add Supplier'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Supplier Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Supplier Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Supplier Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Inventory Provided Name"
          value={inventoryName}
          onChange={(e) => setInventoryName(e.target.value)}
          required
        />
        <button type="submit">{supplierToEdit ? 'Update' : 'Add'} Supplier</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddSupplier;
