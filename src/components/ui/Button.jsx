import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50",
    outline:
      "border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
    ghost:
      "text-slate-400 hover:text-white hover:bg-slate-800/60",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}
