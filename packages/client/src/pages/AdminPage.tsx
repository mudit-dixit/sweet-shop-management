import React, { useState, useEffect } from 'react';
import { SweetForm, type SweetData } from '../components/SweetForm';
import { AdminSweetRow } from '../components/AdminSweetRow';
import api from '../lib/api';

// We need the full sweet object, including _id
interface Sweet extends SweetData {
  _id: string;
}

export const AdminPage: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch all sweets on load ---
  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sweets');
      setSweets(res.data);
    } catch (error) {
      console.error('Failed to fetch sweets:', error);
      alert('Failed to fetch sweets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleAddSweet = async (sweet: SweetData) => {
    try {
      await api.post('/sweets', sweet);
      alert('Sweet added successfully!');
      fetchSweets(); // Refresh the list
    } catch (error) {
      console.error('Failed to add sweet:', error);
      alert('Failed to add sweet. Please try again.');
    }
  };

  // --- NEW: Delete Handler ---
  const handleDelete = async (sweetId: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await api.delete(`/sweets/${sweetId}`);
        alert('Sweet deleted successfully!');
        fetchSweets(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete sweet:', error);
        alert('Failed to delete sweet.');
      }
    }
  };

  // --- NEW: Edit Handler (placeholder) ---
  const handleEdit = (sweet: Sweet) => {
    // TODO: We will implement this in the next step
    console.log('Editing sweet:', sweet);
    alert(`Now editing ${sweet.name}.`);
  };

  return (
    <div className="container p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <SweetForm 
            onSubmit={handleAddSweet} 
            submitButtonText="Add Sweet" 
          />
        </div>

        <div className="md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Manage Existing Sweets</h3>
            <div className="mt-4 space-y-2">
              {loading ? (
                <p>Loading sweets...</p>
              ) : (
                sweets.map((sweet) => (
                  <AdminSweetRow
                    key={sweet._id}
                    sweet={sweet}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};