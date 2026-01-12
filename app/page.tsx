import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="text-center text-white max-w-2xl">
        <div className="text-7xl mb-6">📚</div>
        <h1 className="text-6xl font-bold mb-4">Book Tracker</h1>
        <p className="text-xl text-gray-300 mb-12">
          Track your reading journey, organize your library, and never forget a book again.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link
            href="/auth/signup"
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition text-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}