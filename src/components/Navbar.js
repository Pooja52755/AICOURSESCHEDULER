import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { hasPremiumAccess } = useUserData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                AI Course Scheduler
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Dashboard
              </Link>
              <Link to="/premium" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                {hasPremiumAccess() ? 'Premium Features' : 'Upgrade to Premium'}
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.name}</span>
                <Link
                  to="/profile"
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm"
              >
                Login
              </Link>
            )}
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/premium"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
            onClick={() => setIsMenuOpen(false)}
          >
            {hasPremiumAccess() ? 'Premium Features' : 'Upgrade to Premium'}
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 