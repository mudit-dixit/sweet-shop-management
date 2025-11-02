import React from 'react';

// Define the shape of our Sweet object
interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweetId: string) => void;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900">{sweet.name}</h3>
      <p className="text-sm text-gray-600">{sweet.category}</p>
      <div className="flex items-baseline justify-between mt-4">
        <span className="text-lg font-semibold text-blue-600">
          ${sweet.price.toFixed(2)}
        </span>
        <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-gray-700'}`}>
          {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
        </span>
      </div>
      <button
        onClick={() => onPurchase(sweet._id)}
        disabled={isOutOfStock}
        className="w-full px-4 py-2 mt-4 font-medium text-white bg-blue-600 rounded-md 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isOutOfStock ? 'Out of Stock' : 'Purchase'}
      </button>
    </div>
  );
};