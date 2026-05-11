import React, { useState, useCallback, useEffect } from "react";
import { Save, Trash2, RotateCcw } from "lucide-react";

const TimeSlotCard = ({
  timeSlot,
  initialText,
  onSave,
  onDelete,
  isSaving = false,
  isDraft = false,
}) => {
  const [text, setText] = useState(initialText || "");
  const [hasChanges, setHasChanges] = useState(false);
  const [localIsDraft, setLocalIsDraft] = useState(isDraft);

  useEffect(() => {
    setText(initialText || "");
    setHasChanges(false);
  }, [initialText]);

  const handleChange = (e) => {
    setText(e.target.value);
    setHasChanges(true);
    setLocalIsDraft(true);
  };

  const handleSave = useCallback(() => {
    onSave({
      text,
      isDraft: false,
    });
    setHasChanges(false);
    setLocalIsDraft(false);
  }, [text, onSave]);

  const handleReset = () => {
    setText(initialText || "");
    setHasChanges(false);
    setLocalIsDraft(isDraft);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete();
    }
  };

  const isEmpty = !text || !text.trim();

  return (
    <div
      className={`rounded-lg border-2 transition-all ${
        hasChanges
          ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20"
          : isEmpty
            ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            : "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
      }`}
    >
      <div className="p-4">
        {/* Header with time slot */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-100">
            {timeSlot}
          </span>
          {!isEmpty && (
            <span
              className={`text-xs font-medium ${
                localIsDraft
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {localIsDraft ? "Draft" : "Saved"}
            </span>
          )}
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="What did you work on in this 30-minute slot?"
          className="mb-3 w-full rounded border border-gray-300 bg-white p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-blue-900"
          rows="4"
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          {hasChanges ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-400 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </>
          ) : !isEmpty ? (
            <button
              onClick={handleDelete}
              className="ml-auto flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotCard;
