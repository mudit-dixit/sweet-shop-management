import React, { useState, useEffect } from 'react';
import { SweetForm, type  SweetData } from '../components/SweetForm';
import { AdminSweetRow } from '../components/AdminSweetRow';
import api from '../lib/api';

interface Sweet extends SweetData {
  _id: string;
}

export const AdminPage: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 1. Add state

  // --- NEW: State for editing ---
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

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
    setIsSubmitting(true); // 2. Set true
    try {
      await api.post('/sweets', sweet);
      alert('Sweet added successfully!');
      fetchSweets(); 
    } catch (error) {
      console.error('Failed to add sweet:', error);
      alert('Failed to add sweet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSweet = async (sweetData: SweetData) => {
    if (!editingSweet) return;
    setIsSubmitting(true); 
    try {
      await api.put(`/sweets/${editingSweet._id}`, sweetData);
      alert('Sweet updated successfully!');
      fetchSweets(); 
      setEditingSweet(null);
    } catch (error) {
      console.error('Failed to update sweet:', error);
      alert('Failed to update sweet.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async (sweetId: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await api.delete(`/sweets/${sweetId}`);
        alert('Sweet deleted successfully!');
        fetchSweets(); // Refresh the list
        if (editingSweet?._id === sweetId) {
          setEditingSweet(null); // Stop editing if it was deleted
        }
      } catch (error) {
        console.error('Failed to delete sweet:', error);
        alert('Failed to delete sweet.');
      }
    }
  };

  // --- UPDATED: Edit Handler ---
  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
  };

  // --- NEW: Cancel Edit Handler ---
  const handleCancelEdit = () => {
    setEditingSweet(null);
  };

  return (
    <div className="container p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          {/* --- UPDATED: Conditional Form --- */}
         <SweetForm
            key={editingSweet?._id || 'new'}
            onSubmit={editingSweet ? handleUpdateSweet : handleAddSweet}
            initialData={editingSweet || undefined}
            submitButtonText={editingSweet ? 'Update Sweet' : 'Add Sweet'}
            isLoading={isSubmitting} // 4. Pass prop
          />
          {/* --- NEW: Cancel Button --- */}
          {editingSweet && (
            <button
              onClick={handleCancelEdit}
              className="w-full px-4 py-2 mt-4 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel Edit
            </button>
          )}
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