import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Track screen size for responsive sidebar
  React.useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(false); // auto-close mobile menu on resize to desktop
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/25',
    },
    {
      name: 'Manage Users',
      path: '/admin/users',
      icon: <Users size={20} />,
      gradient: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/25',
    },
    {
      name: 'Manage Places',
      path: '/admin/places',
      icon: <MapPin size={20} />,
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/25',
    },
  ]

  return (
    <>
      {/* SIDEBAR TOGGLE BUTTON — visible on all screen sizes */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); if (isDesktop) setIsDesktop(false); }}
        className="
          fixed top-4 z-[100]
          bg-[#0f172a]/90
          border border-white/10
          p-3 rounded-xl
          shadow-2xl shadow-black/40
          backdrop-blur-xl
          hover:border-white/20
          transition-all duration-300
        "
        style={{
          left: (isOpen || isDesktop) ? '290px' : '16px',
          transition: 'left 0.3s ease-in-out',
        }}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="text-white" size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="text-white" size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="
              fixed inset-0 z-40
              bg-black/70
              backdrop-blur-md
              lg:hidden
            "
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className="
          fixed top-0 left-0 z-50
          h-screen overflow-y-auto overflow-x-hidden
          w-[270px] lg:w-[280px] xl:w-[300px]
          bg-gradient-to-b from-[#0b1120] via-[#0d1529] to-[#0b1120]
          border-r border-white/[0.06]
          shadow-2xl shadow-black/50
          flex flex-col justify-between
        "
        style={{
          transform: (isDesktop || isOpen) ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >

        {/* TOP */}
        <div className="p-5 xl:p-6">

          {/* LOGO */}
          <div className="flex items-center gap-4 mt-14 lg:mt-2 mb-10">

            {/* Logo Icon */}
            <div className="
              w-12 h-12 rounded-2xl
              bg-gradient-to-br from-cyan-500 to-blue-600
              flex items-center justify-center
              shadow-lg shadow-cyan-500/20
              flex-shrink-0
              relative
            ">
              <ShieldCheck className="text-white" size={24} />
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 animate-ping opacity-20"></div>
            </div>

            {/* Logo Text */}
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white leading-none tracking-tight">
                Admin Panel
              </h2>
              <p className="text-gray-500 text-xs mt-1.5 font-medium tracking-wider uppercase">
                TravelVerse
              </p>
            </div>
          </div>

          {/* SECTION LABEL */}
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.15em] mb-3 px-2">
            Navigation
          </p>

          {/* NAVIGATION */}
          <nav className="space-y-1.5">
            {navItems.map((item, index) => {
              const active = location.pathname === item.path;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      group relative
                      flex items-center gap-3.5
                      px-4 py-3.5
                      rounded-xl
                      transition-all duration-300
                      overflow-hidden

                      ${
                        active
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.glow}`
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {/* Shimmer on active */}
                    {active && (
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                          animation: 'shimmer 3s infinite',
                        }}
                      ></div>
                    )}

                    {/* Icon */}
                    <div className={`
                      relative z-10
                      transition-all duration-300
                      ${active ? '' : 'group-hover:scale-110'}
                    `}>
                      {item.icon}
                    </div>

                    {/* Text */}
                    <span className="relative z-10 font-medium text-sm flex-1">
                      {item.name}
                    </span>

                    {/* Arrow / Dot */}
                    {active ? (
                      <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white/50"></div>
                    ) : (
                      <ChevronRight
                        size={14}
                        className="relative z-10 opacity-0 group-hover:opacity-50 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-5 xl:p-6">

          {/* BACK BUTTON */}
          <Link
            to="/explore"
            onClick={() => setIsOpen(false)}
            className="
              flex items-center gap-3
              px-4 py-3.5
              rounded-xl
              text-gray-500
              hover:text-white
              hover:bg-white/[0.04]
              transition-all duration-300
              group
              border border-transparent
              hover:border-white/[0.06]
            "
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="font-medium text-sm">
              Back to App
            </span>
          </Link>

          {/* FOOTER */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-wide">
                  TravelVerse
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Admin Dashboard v2.0
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></div>
                <span className="text-[10px] text-emerald-400/70 font-medium">Live</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-700 mt-4 text-center">
              © 2026 TravelVerse. All rights reserved.
            </p>
          </div>
        </div>
      </aside>

      {/* Shimmer keyframes (injected once) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;