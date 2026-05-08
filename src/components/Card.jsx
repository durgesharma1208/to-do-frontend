import React from "react";

const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        hover ? "hover:shadow-lg transition-shadow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
