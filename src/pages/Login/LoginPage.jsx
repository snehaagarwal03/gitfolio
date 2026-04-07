import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGithub, FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginWithEmail, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await loginWithEmail(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderLogin(provider) {
    try {
      setError("");
      setLoading(true);
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithGithub();
      }
      navigate("/dashboard");
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#030712] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 sm:p-10 relative z-10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-50 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Sign in to your GitFolio account
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center gap-2 p-4 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl"
          >
            <FiAlertCircle className="shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-slate-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/[0.06] rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-white/[0.06] rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-400 transition-colors"
              >
                {showPassword ? (
                  <FiEyeOff className="text-lg" />
                ) : (
                  <FiEye className="text-lg" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-slate-900 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleProviderLogin("github")}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-white/[0.06] rounded-xl bg-slate-900/30 text-sm font-medium text-white hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiGithub className="text-lg" />
              <span>GitHub</span>
            </button>

            <button
              onClick={() => handleProviderLogin("google")}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-white/[0.06] rounded-xl bg-slate-900/30 text-sm font-medium text-white hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle className="text-lg" />
              <span>Google</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
