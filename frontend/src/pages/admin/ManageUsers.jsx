import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/user/${id}/role`, { role: newRole }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert('Error updating role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex-1 p-4 pt-20 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
        <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 border-b border-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      className="bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
