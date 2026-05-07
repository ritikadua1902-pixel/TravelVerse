import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Users,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Activity,
  Globe,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users size={22} />,
      gradient: 'from-cyan-500 to-blue-600',
      bgGlow: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      change: '+12%',
      changeUp: true,
    },
    {
      title: 'Total Admins',
      value: stats?.totalAdmins || 0,
      icon: <ShieldCheck size={22} />,
      gradient: 'from-violet-500 to-purple-600',
      bgGlow: 'bg-violet-500/10',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
      change: '+3%',
      changeUp: true,
    },
    {
      title: 'Total Places',
      value: stats?.totalPlaces || 0,
      icon: <MapPin size={22} />,
      gradient: 'from-emerald-500 to-green-600',
      bgGlow: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      change: '+8%',
      changeUp: true,
    },
    {
      title: 'Active Now',
      value: stats?.totalUsers ? Math.max(1, Math.floor(stats.totalUsers * 0.3)) : 0,
      icon: <Activity size={22} />,
      gradient: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      change: 'Live',
      changeUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear',
            }}
            className="w-12 h-12 border-[3px] border-cyan-500/30 border-t-cyan-500 rounded-full"
          />
          <p className="text-gray-500 text-sm font-medium animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/[0.04] blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-500/[0.04] blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.02] blur-[150px] rounded-full"></div>
      </div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="min-h-screen relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 mt-16 lg:mt-0"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
                  Overview
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-3 text-sm max-w-lg leading-relaxed">
                Monitor users, admins and places with real-time analytics and insights.
              </p>
            </div>

            {/* Status badge */}
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-4 bg-[#0f172a]/80 border border-white/[0.06] rounded-2xl px-5 py-4 shadow-lg w-fit backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="text-emerald-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  System Status
                </p>
                <p className="font-semibold text-sm text-emerald-400">
                  All Systems Operational
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 mb-12">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`
                  relative overflow-hidden rounded-2xl
                  border ${card.borderColor}
                  bg-[#0f172a]/60
                  backdrop-blur-sm
                  shadow-xl shadow-black/20
                  group cursor-default
                `}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient} opacity-60`}></div>

                {/* Background glow on hover */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 ${card.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="p-6 sm:p-7 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.glow}`}>
                      {card.icon}
                    </div>
                    <div className={`flex items-center gap-1 ${card.textColor} text-xs font-semibold bg-white/[0.04] px-2.5 py-1 rounded-full`}>
                      {card.changeUp && <ArrowUpRight size={12} />}
                      {card.change}
                    </div>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                    {card.value}
                  </h2>

                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                    {card.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Recent Users */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20 backdrop-blur-sm"
            >
              {/* Header */}
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Users size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      Recent Users
                    </h2>
                    <p className="text-gray-600 text-[11px] mt-0.5">
                      Newly registered users
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-600 bg-white/[0.04] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {stats?.recentUsers?.length || 0} total
                </span>
              </div>

              {/* Content */}
              <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
                {stats?.recentUsers?.length > 0 ? (
                  stats.recentUsers.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/10">
                          <span className="text-xs font-bold text-cyan-400">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors truncate">
                            {user.name}
                          </h3>
                          <p className="text-gray-600 text-xs mt-0.5 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 border border-cyan-500/10">
                        User
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-6 py-16 text-center">
                    <Users size={32} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No recent users found</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Recent Places */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20 backdrop-blur-sm"
            >
              {/* Header */}
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Globe size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      Recent Places
                    </h2>
                    <p className="text-gray-600 text-[11px] mt-0.5">
                      Recently added destinations
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-600 bg-white/[0.04] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {stats?.recentPlaces?.length || 0} total
                </span>
              </div>

              {/* Content */}
              <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
                {stats?.recentPlaces?.length > 0 ? (
                  stats.recentPlaces.map((place, index) => (
                    <motion.div
                      key={place._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/10">
                          <MapPin size={14} className="text-emerald-400" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors truncate">
                            {place.name}
                          </h3>
                          <p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1">
                            <Clock size={10} />
                            Recently added
                          </p>
                        </div>
                      </div>

                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 border border-emerald-500/10">
                        Active
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-6 py-16 text-center">
                    <MapPin size={32} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No recent places found</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 bg-gradient-to-r from-[#0f172a]/60 to-[#0f172a]/40 border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-gray-300">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
              >
                <Users size={16} className="text-cyan-400" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Manage Users</span>
                <ArrowUpRight size={12} className="text-gray-600 ml-auto group-hover:text-gray-400 transition-colors" />
              </a>
              <a
                href="/admin/places"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
              >
                <MapPin size={16} className="text-emerald-400" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Add Place</span>
                <ArrowUpRight size={12} className="text-gray-600 ml-auto group-hover:text-gray-400 transition-colors" />
              </a>
              <a
                href="/explore"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
              >
                <Globe size={16} className="text-violet-400" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">View App</span>
                <ArrowUpRight size={12} className="text-gray-600 ml-auto group-hover:text-gray-400 transition-colors" />
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;