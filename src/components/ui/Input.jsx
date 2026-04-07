import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
          text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
});

export default Input;
