import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaGithub, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { APP_NAME } from "../utils/constants";
import Loader from "../components/common/Loader";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithGoogle, loginWithGithub, loginWithEmail, signupWithEmail } =
    useAuth();
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleGithubLogin() {
    try {
      setError("");
      setLoading(true);
      await loginWithGithub();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      if (isSignup) {
        if (!displayName.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900 px-6">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center relative">
          <Link to="/" className="absolute left-0 top-1 text-text-muted hover:text-text-primary transition-colors flex items-center gap-2">
            <FaArrowLeft /> <span className="text-sm hidden sm:inline">Back</span>
          </Link>
          <Link to="/" className="text-3xl font-bold text-text-primary">
            {APP_NAME}
          </Link>
          <p className="mt-2 text-text-secondary">
            {isSignup ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-8">
          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="mb-6 flex flex-col gap-3">
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-lg border border-surface-500 bg-surface-700 px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-600 disabled:opacity-50"
            >
              <FaGithub className="text-lg" />
              Continue with GitHub
            </button>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-lg border border-surface-500 bg-surface-700 px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-600 disabled:opacity-50"
            >
              <FaGoogle className="text-lg" />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-surface-600" />
            <span className="text-xs text-text-muted">OR</span>
            <div className="h-px flex-1 bg-surface-600" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  required={isSignup}
                  className="w-full rounded-lg border border-surface-500 bg-surface-700 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-surface-500 bg-surface-700 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-surface-500 bg-surface-700 px-4 py-2.5 pr-10 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          {/* Toggle signup/login */}
          <p className="mt-6 text-center text-sm text-text-muted">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="font-medium text-primary transition-colors hover:text-primary-light"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
