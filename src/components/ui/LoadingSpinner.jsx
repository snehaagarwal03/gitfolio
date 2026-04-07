export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin`}
        style={{ animationDuration: "0.8s" }}
      />
    </div>
  );
}
