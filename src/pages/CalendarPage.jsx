import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import useTodoStore from "../context/todoStore";
import { todoService } from "../services/services";
import Toast from "../components/Toast";

export default function CalendarPage() {
  const { todos, setTodos, addTodo, setLoading } = useTodoStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: null,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    const loadTodos = async () => {
      if (todos.length > 0) return;

      try {
        const { data } = await todoService.getTodos();
        setTodos(data.data);
      } catch (error) {
        console.error("Failed to load todos for calendar:", error);
      }
    };

    loadTodos();
  }, [setTodos, todos.length]);

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate.toDateString() === date.toDateString() && !todo.completed;
    });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-300";
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  // Get day of week headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate starting day of month
  const firstDayOfMonth = monthStart.getDay();
  const previousDays = Array(firstDayOfMonth).fill(null);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, dueDate: date });
    setShowModal(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setToastMessage("Please enter a task title");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await todoService.createTodo({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
      addTodo(response.data.data);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: null,
      });
      setShowModal(false);
      setToastMessage("Task created successfully!");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Failed to create task");
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Calendar</h1>
          </div>
          <p className="text-gray-600">View and manage your tasks by date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayHeaders.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-gray-700 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {previousDays.map((_, index) => (
                  <div key={`prev-${index}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                  const dayTasks = getTasksForDate(day);
                  const isToday =
                    day.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square p-2 rounded-lg cursor-pointer transition border-2 ${
                        isToday
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <span className="text-sm font-semibold text-gray-800">
                          {day.getDate()}
                        </span>
                        <div className="flex-1 overflow-hidden mt-1">
                          {dayTasks.map((task, idx) => (
                            <div
                              key={task._id}
                              className={`text-xs px-1 py-0.5 rounded mb-1 truncate ${getPriorityColor(
                                task.priority,
                              )}`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-600">
                              +{dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Priority Levels:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                    <span className="text-sm text-gray-600">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
                    <span className="text-sm text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                    <span className="text-sm text-gray-600">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Info */}
          <div className="lg:col-span-1">
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {format(selectedDate, "MMMM d, yyyy")}
                </h3>

                <button
                  onClick={() => handleDateClick(selectedDate)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-6"
                >
                  <Plus size={18} />
                  Add Task
                </button>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Tasks for this date:
                  </p>
                  {getTasksForDate(selectedDate).length === 0 ? (
                    <p className="text-sm text-gray-500">No tasks scheduled</p>
                  ) : (
                    getTasksForDate(selectedDate).map((task) => (
                      <div
                        key={task._id}
                        className={`p-3 rounded-lg text-sm ${getPriorityColor(
                          task.priority,
                        )}`}
                      >
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-xs mt-1 opacity-75">
                            {task.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">
                Create Task for {format(selectedDate || new Date(), "MMM d")}
              </h2>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          type={toastMessage.includes("Failed") ? "error" : "success"}
        />
      )}
    </div>
  );
}
