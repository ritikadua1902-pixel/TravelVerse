import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Trash2,
  Shield,
  User,
  Mail,
  ChevronDown,
  AlertTriangle,
  X,
  UserCog,
} from 'lucide-react';

import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/admin/user/${id}/role`,
        { role: newRole },
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUsers();
    } catch (err) {
      alert('Error updating role');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalUsers = users.filter((u) => u.role === 'user').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-12 h-12 border-[3px] border-violet-500/30 border-t-violet-500 rounded-full"
          />
          <p className="text-gray-500 text-sm font-medium animate-pulse">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.04] blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-cyan-500/[0.03] blur-[120px] rounded-full"></div>
      </div>

      <AdminSidebar />

      <main className="min-h-screen relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 mt-16 lg:mt-0"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-purple-600"></div>
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
                  User Management
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p className="text-gray-500 mt-2 text-sm max-w-lg">
                View, edit roles, and manage all registered users on the platform.
              </p>
            </div>
          </motion.div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-cyan-400" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total</span>
              </div>
              <p className="text-3xl font-bold">{users.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-violet-400" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Admins</span>
              </div>
              <p className="text-3xl font-bold">{totalAdmins}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-sm col-span-2 sm:col-span-1"
            >
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-emerald-400" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Users</span>
              </div>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </motion.div>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f172a]/60 border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Desktop Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="hidden md:block bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20 backdrop-blur-sm"
          >
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-6 py-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                              user.role === 'admin'
                                ? 'bg-violet-500/10 border-violet-500/15'
                                : 'bg-cyan-500/10 border-cyan-500/15'
                            }`}>
                              <span className={`text-xs font-bold ${
                                user.role === 'admin' ? 'text-violet-400' : 'text-cyan-400'
                              }`}>
                                {user.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <span className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Mail size={12} className="flex-shrink-0" />
                            {user.email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative inline-block">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className={`
                                appearance-none cursor-pointer
                                pl-3 pr-8 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider
                                border outline-none transition-all duration-200
                                ${
                                  user.role === 'admin'
                                    ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:border-violet-500/40'
                                    : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40'
                                }
                              `}
                            >
                              <option value="user" className="bg-[#0f172a] text-white">User</option>
                              <option value="admin" className="bg-[#0f172a] text-white">Admin</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirm(user._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 text-xs font-medium"
                          >
                            <Trash2 size={13} />
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <Search size={32} className="text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">No users found matching your search</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-[#0f172a]/60 border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        user.role === 'admin'
                          ? 'bg-violet-500/10 border-violet-500/15'
                          : 'bg-cyan-500/10 border-cyan-500/15'
                      }`}>
                        <span className={`text-sm font-bold ${
                          user.role === 'admin' ? 'text-violet-400' : 'text-cyan-400'
                        }`}>
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm text-gray-200 truncate">{user.name}</h3>
                        <p className="text-gray-600 text-xs mt-0.5 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="relative">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`
                          appearance-none cursor-pointer
                          pl-3 pr-8 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider
                          border outline-none
                          ${
                            user.role === 'admin'
                              ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                          }
                        `}
                      >
                        <option value="user" className="bg-[#0f172a] text-white">User</option>
                        <option value="admin" className="bg-[#0f172a] text-white">Admin</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>

                    <button
                      onClick={() => setDeleteConfirm(user._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-medium"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Search size={32} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            >
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">
                  Delete User?
                </h3>
                <p className="text-gray-500 text-sm text-center mb-6">
                  This action cannot be undone. The user will be permanently removed from the platform.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-white/[0.08] transition-all duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-200 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;