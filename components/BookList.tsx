'use client';

import { useState } from 'react';
import { Book } from '@/lib/types';

interface BookListProps {
  books: Book[];
  onBookDeleted: () => void;
  onBookUpdated: () => void;
  currentStatus: string;
}

export default function BookList({ books, onBookDeleted, onBookUpdated, currentStatus }: BookListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onBookDeleted();
    } catch (error) {
      alert('Failed to delete book');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      onBookUpdated();
    } catch (error) {
      alert('Failed to update book status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
   
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (books.length === 0) {
    const emptyMessages = {
      Reading: {
        icon: '📖',
        title: 'No books in progress',
        message: 'Start reading a book from your wishlist or add a new one!'
      },
      Completed: {
        icon: '✅',
        title: 'No completed books yet',
        message: 'Finish your first book and mark it as completed!'
      },
      Wishlist: {
        icon: '⭐',
        title: 'Your wishlist is empty',
        message: 'Add books you want to read in the future!'
      },
      '': {
        icon: '📚',
        title: 'No books yet',
        message: 'Add your first book to get started!'
      }
    };

    const empty = emptyMessages[currentStatus as keyof typeof emptyMessages] || emptyMessages[''];

    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <div className="text-6xl mb-4">{empty.icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{empty.title}</h3>
        <p className="text-gray-500">{empty.message}</p>
      </div>
    );
  }

  // Render based on current status filter
  if (currentStatus === 'Reading') {
    return <ReadingBooksList books={books} onDelete={handleDelete} onStatusChange={handleStatusChange} deletingId={deletingId} getTimeSince={getTimeSince} />;
  }

  if (currentStatus === 'Completed') {
    return <CompletedBooksList books={books} onDelete={handleDelete} onStatusChange={handleStatusChange} deletingId={deletingId} formatDate={formatDate} />;
  }

  if (currentStatus === 'Wishlist') {
    return <WishlistBooksList books={books} onDelete={handleDelete} onStatusChange={handleStatusChange} deletingId={deletingId} formatDate={formatDate} />;
  }

  // Default: All Books View
  return <AllBooksList books={books} onDelete={handleDelete} onStatusChange={handleStatusChange} deletingId={deletingId} formatDate={formatDate} />;
}

// READING VIEW
function ReadingBooksList({ books, onDelete, onStatusChange, deletingId, getTimeSince }: any) {
  return (
    <div className="space-y-4">
      {books.map((book: Book) => (
        <div key={book.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📖</span>
                <h3 className="font-bold text-xl text-gray-900">{book.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500">Started {getTimeSince(book.created_at)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(book.id, 'Completed')}
              className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              Mark as Completed
            </button>
            <button
              onClick={() => onDelete(book.id)}
              disabled={deletingId === book.id}
              className="px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// COMPLETED VIEW
function CompletedBooksList({ books, onDelete, onStatusChange, deletingId, formatDate }: any) {
  return (
    <div className="space-y-4">
      {books.map((book: Book) => (
        <div key={book.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  COMPLETED
                </span>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">{book.title}</h3>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500">Finished {formatDate(book.created_at)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(book.id, 'Reading')}
              className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Re-read
            </button>
            <button
              onClick={() => onDelete(book.id)}
              disabled={deletingId === book.id}
              className="px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// WISHLIST VIEW
function WishlistBooksList({ books, onDelete, onStatusChange, deletingId, formatDate }: any) {
  return (
    <div className="space-y-4">
      {books.map((book: Book) => (
        <div key={book.id} className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h3 className="font-bold text-xl text-gray-900">{book.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500">Added {formatDate(book.created_at)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(book.id, 'Reading')}
              className="flex-1 bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              Start Reading
            </button>
            <button
              onClick={() => onDelete(book.id)}
              disabled={deletingId === book.id}
              className="px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// 📚 ALL BOOKS VIEW (3 Columns by Status)
function AllBooksList({ books, onDelete, onStatusChange, deletingId, formatDate }: any) {
  // Group books by status
  const completedBooks = books.filter((book: Book) => book.status === 'Completed');
  const readingBooks = books.filter((book: Book) => book.status === 'Reading');
  const wishlistBooks = books.filter((book: Book) => book.status === 'Wishlist');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Reading': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Wishlist': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderBookCard = (book: Book) => (
    <div key={book.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-3">
      <div className="mb-3">
        <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
        <p className="text-xs text-gray-500">{formatDate(book.created_at)}</p>
      </div>

      <div className="space-y-2">
        <select
          value={book.status}
          onChange={(e) => onStatusChange(book.id, e.target.value)}
          className={`w-full px-2 py-1.5 rounded-lg text-xs font-medium border ${getStatusStyle(book.status)} focus:outline-none focus:ring-2 focus:ring-gray-900`}
        >
          <option value="Reading">📖 Reading</option>
          <option value="Completed">✅ Completed</option>
          <option value="Wishlist">⭐ Wishlist</option>
        </select>

        <button
          onClick={() => onDelete(book.id)}
          disabled={deletingId === book.id}
          className="w-full bg-red-50 text-red-600 border border-red-200 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
        >
          {deletingId === book.id ? '⏳' : 'Delete'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Completed Column */}
      <div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">✅</span>
            <h2 className="text-lg font-bold text-green-900">Completed</h2>
          </div>
          <p className="text-sm text-green-700">{completedBooks.length} books</p>
        </div>
        <div className="space-y-3">
          {completedBooks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No completed books</p>
            </div>
          ) : (
            completedBooks.map(renderBookCard)
          )}
        </div>
      </div>

      {/* Reading Column */}
      <div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📖</span>
            <h2 className="text-lg font-bold text-blue-900">Reading</h2>
          </div>
          <p className="text-sm text-blue-700">{readingBooks.length} books</p>
        </div>
        <div className="space-y-3">
          {readingBooks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No books in progress</p>
            </div>
          ) : (
            readingBooks.map(renderBookCard)
          )}
        </div>
      </div>

      {/* Wishlist Column */}
      <div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-bold text-amber-900">Wishlist</h2>
          </div>
          <p className="text-sm text-amber-700">{wishlistBooks.length} books</p>
        </div>
        <div className="space-y-3">
          {wishlistBooks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No wishlist books</p>
            </div>
          ) : (
            wishlistBooks.map(renderBookCard)
          )}
        </div>
      </div>
    </div>
  );
}