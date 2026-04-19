import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              SkillSwap
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Dashboard</Link>
              <Link to="/requests" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Requests</Link>
              <Link to="/my-profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">My Profile</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="flex items-center space-x-3">
              <img 
                src={user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;