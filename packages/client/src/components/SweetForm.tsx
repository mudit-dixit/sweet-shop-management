import React, { useState, useEffect } from 'react';

// This interface defines the data structure for a sweet
// We'll use this in a few places
export interface SweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface SweetFormProps {
  onSubmit: (sweet: SweetData) => void;
  initialData?: SweetData;
  submitButtonText?: string;
}

const defaultData: SweetData = {
  name: '',
  category: '',
  price: 0,
  quantity: 0,
};

export const SweetForm: React.FC<SweetFormProps> = ({
  onSubmit,
  initialData = defaultData,
  submitButtonText = 'Submit',
}) => {
  const [sweet, setSweet] = useState<SweetData>(initialData);

  // This effect syncs the form if the initialData prop changes (for editing)
  useEffect(() => {
    setSweet(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSweet((prevSweet) => ({
      ...prevSweet,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sweet);
    // Clear form only if we're not editing
    if (!initialData.name) {
      setSweet(defaultData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">
        {initialData.name ? 'Edit Sweet' : 'Add a New Sweet'}
      </h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={sweet.name}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          required
          value={sweet.category}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (Rs)</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            value={sweet.price}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            required
            min="0"
            value={sweet.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        {submitButtonText}
      </button>
    </form>
  );
};