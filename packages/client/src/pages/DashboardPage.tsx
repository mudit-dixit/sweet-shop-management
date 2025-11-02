import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { SweetCard } from '../components/SweetCard';

// Define the Sweet type again (we'll move this later)
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

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sweets');
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
  }, []);

  const handlePurchase = async (sweetId: string) => {
    try {
      // Call the purchase endpoint
      await api.post(`/sweets/${sweetId}/purchase`);
      // Refetch the sweets to show the new quantity
      fetchSweets();
    } catch (err) {
      alert('Purchase failed. The sweet might be out of stock.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading sweets...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Available Sweets</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sweets.map((sweet) => (
          <SweetCard key={sweet._id} sweet={sweet} onPurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
};