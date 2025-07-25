import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <ShieldAlert size={64} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">403 - Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;