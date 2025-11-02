import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { SweetCard } from '../components/SweetCard';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export const DashboardPage: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: State for filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null); // 1. Add new state
  const fetchSweets = async () => {
    try {
      setLoading(true);
      // --- UPDATED: Build search params ---
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      // Use the correct endpoint based on whether we are searching
      const endpoint = searchTerm || category || minPrice || maxPrice ? '/sweets/search' : '/sweets';

      const res = await api.get(endpoint, { params });
      setSweets(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []); // Only run once on initial load

  const handlePurchase = async (sweetId: string) => {
    setPurchasingId(sweetId); // 2. Set the ID of the sweet being purchased
    try {
      await api.post(`/sweets/${sweetId}/purchase`);
      fetchSweets(); 
    } catch (err) {
      alert('Purchase failed. The sweet might be out of stock.');
    } finally {
      setPurchasingId(null); // 3. Clear the ID
    }
  };

  // --- NEW: Handler for search button ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSweets();
  };

  // --- NEW: Handler to clear filters ---
  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    // We call fetchSweets inside a useEffect to avoid batching issues
    // This is a common pattern
    setTimeout(fetchSweets, 0);
  };

  return (
    <div className="container p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Available Sweets</h1>

      {/* --- NEW: Search Form --- */}
      <form onSubmit={handleSearch} className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Min price..."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Max price..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>
      {/* --- End of Search Form --- */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sweets.map((sweet) => (
          <SweetCard
            key={sweet._id}
            sweet={sweet}
            onPurchase={handlePurchase}
            isPurchasing={purchasingId === sweet._id} // 4. Pass prop
          />
        ))}
      </div>
    </div>
  );
};