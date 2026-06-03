import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../components/Button";
import TodoCard from "../components/TodoCard";
import TodoModal from "../components/TodoModal";
import TodoFilters from "../components/TodoFilters";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import useTodoStore, {
  selectFilteredAndSortedTodos,
} from "../context/todoStore";
import useUiStore from "../context/uiStore";
import { todoService } from "../services/services";

const TodosPage = () => {
  const {
    setTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    isLoading,
    setLoading,
  } = useTodoStore();
  const displayedTodos = useTodoStore(selectFilteredAndSortedTodos);
  const { showToast } = useUiStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 md:pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
          <p className="text-gray-500">
            You have {displayedTodos.length} tasks.
          </p>
        </div>
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

      <TodoFilters />

      {isLoading ? (
        <LoadingSkeleton />
      ) : displayedTodos.length === 0 ? (
        <EmptyState
          title="No todos found"
          message="Create a new todo to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onToggle={handleToggleTodo}
              onEdit={openEditModal}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}

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

export default TodosPage;
