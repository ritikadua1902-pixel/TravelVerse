import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Manage Places', path: '/admin/places' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-6 flex flex-col justify-between hidden md:flex">
      <div>
        <h2 className="text-2xl font-bold text-teal-400 mb-8">Admin Panel</h2>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link to="/explore" className="text-gray-400 hover:text-white flex items-center gap-2">
          ← Back to App
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
