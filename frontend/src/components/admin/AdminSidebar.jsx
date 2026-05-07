import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Manage Places', path: '/admin/places' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Content */}
      <div className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-700 p-6 flex flex-col justify-between transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
          <h2 className="text-2xl font-bold text-teal-400 mb-8 mt-8 md:mt-0">Admin Panel</h2>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
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
          <Link to="/explore" className="text-gray-400 hover:text-white flex items-center gap-2 mt-8">
            ← Back to App
          </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
