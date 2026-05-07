import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex-1 p-4 pt-20 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl text-gray-400">Total Users</h3>
            <p className="text-4xl font-bold mt-2">{stats?.totalUsers}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl text-gray-400">Total Admins</h3>
            <p className="text-4xl font-bold mt-2">{stats?.totalAdmins}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl text-gray-400">Total Places</h3>
            <p className="text-4xl font-bold mt-2">{stats?.totalPlaces}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4">Recent Users</h3>
            <ul className="divide-y divide-gray-700">
              {stats?.recentUsers.map(user => (
                <li key={user._id} className="py-3 flex justify-between">
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-400">{user.email}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4">Recent Places</h3>
            <ul className="divide-y divide-gray-700">
              {stats?.recentPlaces.map(place => (
                <li key={place._id} className="py-3 flex justify-between">
                  <span>{place.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
