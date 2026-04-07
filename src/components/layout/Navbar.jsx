import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLogOut, FiMenu, FiX, FiSettings, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/helpers";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/#about" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.04]" style={{ background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Git<span className="text-emerald-400">Folio</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {!user && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 py-1 px-1.5 rounded-xl hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-emerald-400 text-xs font-bold">
                            {getInitials(user.displayName || user.email)}
                          </span>
                        )}
                      </div>
                    </div>
                    <FiChevronDown className={`text-slate-500 text-xs transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-60 bg-slate-900 border border-white/[0.06] rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-white/[0.06]">
                            <p className="text-sm text-white font-medium truncate">
                              {user.displayName || "User"}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                          </div>

                          <div className="py-1">
                            <Link
                              to="/dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors duration-150"
                            >
                              <FiUser className="text-emerald-500" size={15} />
                              Profile
                            </Link>
                            <Link
                              to="/settings"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors duration-150"
                            >
                              <FiSettings className="text-emerald-500" size={15} />
                              Settings
                            </Link>
                          </div>

                          <div className="border-t border-white/[0.06] py-1">
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                handleLogout();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors duration-150 text-left"
                            >
                              <FiLogOut size={15} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 px-4 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-gray-900 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/[0.04] bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {!user && navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 my-2 rounded-lg bg-slate-900/50 border border-white/[0.04]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-emerald-400 text-xs font-bold">
                            {getInitials(user.displayName || user.email)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-emerald-500 hover:bg-emerald-400 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
