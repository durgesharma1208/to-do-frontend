import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { useForm } from "../hooks/useForm";

const TodoModal = ({ todo, isOpen, onClose, onSubmit, isLoading }) => {
  const [errors, setErrors] = useState({});

  const initialValues = todo || {
    title: "",
    description: "",
    priority: "Medium",
    category: "",
    dueDate: "",
  };

  const handleSubmit = async (values) => {
    if (!values.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    await onSubmit(values);
  };

  const {
    values,
    handleChange,
    handleSubmit: formSubmit,
  } = useForm(initialValues, handleSubmit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {todo ? "Edit Todo" : "Create New Todo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={formSubmit} className="p-6 space-y-4">
          <Input
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="What do you need to do?"
            error={errors.title}
            touched={true}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Add details (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={values.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={values.category}
                onChange={handleChange}
                placeholder="e.g., Work"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={values.dueDate ? values.dueDate.split("T")[0] : ""}
              onChange={(e) =>
                handleChange({
                  target: { name: "dueDate", value: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Todo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
