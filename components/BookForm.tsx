'use client';

import { useState } from 'react';
import { CreateBookDto } from '@/lib/types';

interface BookFormProps {
  onBookAdded: () => void;
}

export default function BookForm({ onBookAdded }: BookFormProps) {
  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    status: 'Reading',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add book');
      }

      setFormData({ title: '', author: '', status: 'Reading' });
      onBookAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Add New Book</h2>
     
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
     
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Enter book title"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Author</label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="Reading">Reading</option>
          <option value="Completed">Completed</option>
          <option value="Wishlist">Wishlist</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? 'Adding...' : '+ Add Book'}
      </button>
    </form>
  );
}