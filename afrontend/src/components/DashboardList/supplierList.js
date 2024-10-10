import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../assets/style/supplierList.css'; // Adjust CSS path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddSupplier from './AddSupplier'; // Import AddSupplier component

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/suppliers/${id}`);
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      toast.error('Error deleting supplier');
      console.error('Error deleting supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedSupplier(null);
  };

  const handleUpdate = (updatedSupplier) => {
    setSuppliers(prevSuppliers =>
      prevSuppliers.map(supplier =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
    handleCloseEdit();
  };

  return (
    <div className="supplier-list-container">
      <h2>Supplier List</h2>

      {isEditing && (
        <AddSupplier
          supplierToEdit={selectedSupplier}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}

      {suppliers.length > 0 ? (
        <table className="supplier-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Inventory Provided Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.id}>
                <td>{index + 1}</td>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>{supplier.inventoryName}</td>
                <td className="supplier-actions">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="edit-icon"
                    title="Edit"
                    onClick={() => handleEdit(supplier)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    title="Delete"
                    onClick={() => handleDelete(supplier.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-suppliers">No suppliers found</div>
      )}
    </div>
  );
};

export default SupplierList;
