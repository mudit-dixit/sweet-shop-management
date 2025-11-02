import React from 'react';
import { SweetForm, type SweetData } from '../components/SweetForm';
import api from '../lib/api';

export const AdminPage: React.FC = () => {

  const handleAddSweet = async (sweet: SweetData) => {
    try {
      await api.post('/sweets', sweet);
      alert('Sweet added successfully!');
      // TODO: We will add a function here to refresh the list of sweets
    } catch (error) {
      console.error('Failed to add sweet:', error);
      alert('Failed to add sweet. Please try again.');
    }
  };

  return (
    <div className="container p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* --- ADD FORM SECTION --- */}
        <div className="md:col-span-1">
          <SweetForm 
            onSubmit={handleAddSweet} 
            submitButtonText="Add Sweet" 
          />
        </div>

        {/* --- MANAGE SWEETS SECTION (Placeholder) --- */}
        <div className="md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Manage Existing Sweets</h3>
            <p className="mt-4 text-gray-600">
              The list of sweets to edit and delete will go here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};