import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { APP_NAME } from "../../utils/constants";
import LetterAvatar from "./LetterAvatar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-surface-700 bg-surface-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo - Dashboard if authenticated, Landing if not */}
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold text-text-primary">
          {APP_NAME}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/resume"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/resume"
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Resume
              </Link>
              <div className="flex items-center gap-3">
                <LetterAvatar name={displayName} size="sm" />
                <span className="text-sm text-text-secondary">
                  {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-700 hover:text-text-primary"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-text-primary md:hidden"
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-surface-700 bg-surface-900 md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-4">
                    <LetterAvatar name={displayName} size="sm" />
                    <span className="text-sm text-text-secondary">
                      {displayName}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/resume"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Resume
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-error transition-colors hover:text-red-400"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-primary px-5 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
