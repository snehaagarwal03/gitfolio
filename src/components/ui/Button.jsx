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
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    outline: "border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "text-gray-400 hover:text-white hover:bg-gray-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
