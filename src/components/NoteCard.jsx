import { useState } from "react";
import { Trash2, Star } from "lucide-react";
import useNotesStore from "../context/notesStore";
import { notesService } from "../services/services";
import useUiStore from "../context/uiStore";

export default function NoteCard({ note }) {
  const { updateNote, deleteNote } = useNotesStore();
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const colorClasses = {
    yellow: "bg-yellow-100 border-yellow-200",
    green: "bg-green-100 border-green-200",
    blue: "bg-blue-100 border-blue-200",
    pink: "bg-pink-100 border-pink-200",
    purple: "bg-purple-100 border-purple-200",
  };

  const handleToggleImportant = async () => {
    setLoading(true);
    try {
      const response = await notesService.toggleImportant(note._id);
      updateNote(note._id, response.data.data);
      showToast(
        response.data.data.isImportant
          ? "Marked as important"
          : "Removed from important",
        "success",
      );
    } catch (error) {
      showToast("Failed to update note", "error");
    }
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const response = await notesService.updateNote(note._id, {
        title: editedTitle,
        content: editedContent,
      });
      updateNote(note._id, response.data.data);
      setIsEditing(false);
      showToast("Note updated successfully", "success");
    } catch (error) {
      showToast("Failed to update note", "error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await notesService.deleteNote(note._id);
      deleteNote(note._id);
      showToast("Note deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete note", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className={`${colorClasses[note.color]} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
      >
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-b-2 border-gray-400 focus:outline-none pb-1"
              maxLength={100}
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-400 focus:outline-none pb-2 resize-none"
              rows="4"
              maxLength={2000}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(note.title);
                  setEditedContent(note.content);
                }}
                className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-2">
                {note.title}
              </h3>
              <button
                onClick={handleToggleImportant}
                disabled={loading}
                className="p-1 hover:bg-gray-300 rounded transition-colors"
                title={
                  note.isImportant
                    ? "Remove from important"
                    : "Mark as important"
                }
              >
                <Star
                  size={20}
                  className={`${note.isImportant ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`}
                />
              </button>
            </div>
            <p className="text-gray-700 text-sm line-clamp-4 mb-3">
              {note.content}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
