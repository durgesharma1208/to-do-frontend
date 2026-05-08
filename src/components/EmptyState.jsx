import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No tasks yet",
  description = "Create your first todo to get started!",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Inbox className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
