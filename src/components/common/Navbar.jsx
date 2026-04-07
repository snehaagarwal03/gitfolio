import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { APP_NAME } from "../../utils/constants";
import LetterAvatar from "./LetterAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
        {/* Logo */}
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

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-700 outline-none">
                    <LetterAvatar name={displayName} size="sm" />
                    <span className="text-sm text-text-secondary max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <FaChevronDown className="text-xs text-text-muted" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-700">
                    <LetterAvatar name={displayName} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{displayName}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
                    </div>
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
                    className="flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
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
