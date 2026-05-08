import React from "react";
import { Loader } from "lucide-react";

const Spinner = ({ size = "md" }) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }[size];

  return (
    <div className="flex justify-center items-center">
      <Loader className={`${sizeClass} animate-spin text-blue-500`} />
    </div>
  );
};

export default Spinner;
