import React, { useEffect } from "react";
import Card from "../components/Card";
import useTodoStore from "../context/todoStore";
import useUiStore from "../context/uiStore";
import { todoService } from "../services/services";

const StatsPage = () => {
  const { todos, setTodos, isLoading, setLoading } = useTodoStore();
  const { showToast } = useUiStore();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const { data } = await todoService.getTodos();
      setTodos(data.data);
    } catch (error) {
      showToast("Failed to load todos", "error");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    completionRate:
      todos.length > 0
        ? Math.round(
            (todos.filter((t) => t.completed).length / todos.length) * 100,
          )
        : 0,
    byPriority: {
      high: todos.filter((t) => t.priority === "High").length,
      medium: todos.filter((t) => t.priority === "Medium").length,
      low: todos.filter((t) => t.priority === "Low").length,
    },
    byCategory: {},
  };

  todos.forEach((todo) => {
    if (todo.category) {
      stats.byCategory[todo.category] =
        (stats.byCategory[todo.category] || 0) + 1;
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Statistics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <p className="text-gray-600 text-sm">Total Todos</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">
            {stats.completed}
          </div>
          <p className="text-gray-600 text-sm">Completed</p>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <p className="text-gray-600 text-sm">Pending</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <div className="text-3xl font-bold text-purple-600">
            {stats.completionRate}%
          </div>
          <p className="text-gray-600 text-sm">Completion Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">By Priority</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-medium">High Priority</span>
              <span className="text-2xl font-bold text-red-600">
                {stats.byPriority.high}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 font-medium">
                Medium Priority
              </span>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.byPriority.medium}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">Low Priority</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.byPriority.low}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">By Category</h2>
          {Object.keys(stats.byCategory).length === 0 ? (
            <p className="text-gray-500">No categories yet</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;
