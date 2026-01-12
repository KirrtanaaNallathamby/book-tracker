'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import BookForm from '@/components/BookForm';
import BookList from '@/components/BookList';
import { Book } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || '';

  const fetchBooks = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (searchQuery) params.append('search', searchQuery);

    const res = await fetch(`/api/books?${params.toString()}`);
    const data = await res.json();
    setBooks(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [statusFilter, searchQuery]);

  const getPageTitle = () => {
    switch (statusFilter) {
      case 'Reading': return '📖 Currently Reading';
      case 'Completed': return '✅ Completed Books';
      case 'Wishlist': return '⭐ Wishlist';
      default: return '📚 All Books';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userEmail={userEmail} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600">Manage your reading collection</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Book Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookForm onBookAdded={fetchBooks} />
              </div>
            </div>

            {/* Books List */}
            <div className="lg:col-span-2">
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                </div>
              </div>

              {/* Books Grid */}
              {loading ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <div className="animate-spin text-4xl mb-4">⏳</div>
                  <p className="text-gray-600">Loading your books...</p>
                </div>
              ) : (
                <BookList
                  books={books}
                  onBookDeleted={fetchBooks}
                  onBookUpdated={fetchBooks}
                  currentStatus={statusFilter}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}