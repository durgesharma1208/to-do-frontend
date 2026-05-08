import React from "react";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  Flag,
} from "lucide-react";
import { formatDate, isOverdue, getDaysUntilDue } from "../utils/helpers";

const TodoCard = ({ todo, onToggle, onEdit, onDelete }) => {
  const daysUntilDue = getDaysUntilDue(todo.dueDate);
  const overdue = isOverdue(todo.dueDate);

  const priorityColors = {
    High: "text-red-500 bg-red-50",
    Medium: "text-yellow-500 bg-yellow-50",
    Low: "text-green-500 bg-green-50",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 transition-all duration-200 ${
        todo.completed ? "opacity-75 bg-gray-50" : ""
      }`}
    >
      <div className="flex gap-3">
        <button
          onClick={() => onToggle(todo._id)}
          className="flex-shrink-0 mt-1 text-gray-400 hover:text-blue-500 transition"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`text-lg font-semibold break-words ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {todo.title}
            </h3>
          </div>

          {todo.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            {todo.category && (
              <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {todo.category}
              </span>
            )}

            {todo.priority && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${priorityColors[todo.priority]}`}
              >
                <Flag className="w-3 h-3" />
                {todo.priority}
              </span>
            )}

            {todo.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  overdue
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(todo.dueDate)}
                {daysUntilDue !== null && daysUntilDue >= 0 && (
                  <span>({daysUntilDue}d)</span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(todo)}
            className="text-gray-400 hover:text-blue-500 transition p-1"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="text-gray-400 hover:text-red-500 transition p-1"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
