import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, language: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export default function NewNovelDialog({
  isOpen,
  onClose,
  onCreate,
  loading,
  error,
}: Props) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");

  const handleSubmit = async () => {
    if (!title || !language) return;
    await onCreate(title, language);
    setTitle("");
    setLanguage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Novel</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Language</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 text-sm border border-gray-300 rounded "
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
