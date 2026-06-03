import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import TodoCard from "../components/TodoCard";
import TodoModal from "../components/TodoModal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import useTodoStore from "../context/todoStore";
import useUiStore from "../context/uiStore";
import { todoService } from "../services/services";

const DashboardPage = () => {
  const {
    todos,
    setTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    isLoading,
    setLoading,
  } = useTodoStore();
  const { showToast } = useUiStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTodo, setEditingTodo] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
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
    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      setIsSubmitting(true);
      const submitData = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        category: values.category,
        dueDate: values.dueDate || null,
      };

      if (editingTodo) {
        const { data } = await todoService.updateTodo(editingTodo._id, submitData);
        updateTodo(editingTodo._id, data.data);
        showToast("Todo updated successfully", "success");
      } else {
        const { data } = await todoService.createTodo(submitData);
        addTodo(data.data);
        showToast("Todo created successfully", "success");
      }

      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to save todo",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const { data } = await todoService.toggleTodo(id);
      updateTodo(id, data.data);
    } catch (error) {
      showToast("Failed to update todo", "error");
    }
  };

  const handleDeleteTodo = async (id) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      try {
        await todoService.deleteTodo(id);
        deleteTodo(id);
        showToast("Todo deleted successfully", "success");
      } catch (error) {
        showToast("Failed to delete todo", "error");
      }
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;
  const highPriorityCount = todos.filter(
    (t) => t.priority === "High" && !t.completed,
  ).length;

  const recentTodos = todos.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24 md:pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button
          onClick={() => {
            setEditingTodo(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Todo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">{todos.length}</div>
          <p className="text-gray-600 text-sm">Total Todos</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">
            {completedCount}
          </div>
          <p className="text-gray-600 text-sm">Completed</p>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-600">
            {pendingCount}
          </div>
          <p className="text-gray-600 text-sm">Pending</p>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">
            {highPriorityCount}
          </div>
          <p className="text-gray-600 text-sm">High Priority</p>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Todos</h2>
        {isLoading ? (
          <LoadingSkeleton />
        ) : recentTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No todos yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={(todo) => {
                  setEditingTodo(todo);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        )}
      </Card>

      <TodoModal
        todo={editingTodo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleCreateOrUpdate}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DashboardPage;
