import React from 'react';

// We can reuse this from our SweetForm
export interface SweetData {
  _id: string; // Admin row needs the ID
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface AdminSweetRowProps {
  sweet: SweetData;
  onEdit: (sweet: SweetData) => void;
  onDelete: (sweetId: string) => void;
}

export const AdminSweetRow: React.FC<AdminSweetRowProps> = ({
  sweet,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      <div>
        <p className="font-semibold text-gray-900">{sweet.name}</p>
        <p className="text-sm text-gray-600">
          ${sweet.price.toFixed(2)} - {sweet.quantity} in stock
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(sweet)}
          className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(sweet._id)}
          className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};