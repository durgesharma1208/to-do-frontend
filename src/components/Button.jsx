import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 disabled:bg-gray-400",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-400",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
