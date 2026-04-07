import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/helpers";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Git<span className="text-emerald-500">Folio</span>
            </span>
          </a>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.displayName || user.email)
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
