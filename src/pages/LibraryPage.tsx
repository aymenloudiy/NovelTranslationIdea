import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import axios from "axios";
import EmptyState from "../components/EmptyState";
import NewNovelDialog from "../components/NewNovelDialog";

interface Novel {
  id: number;
  title: string;
  language: string;
  createdAt: string;
}

export default function LibraryPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filtered, setFiltered] = useState<Novel[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("openNew") === "true") {
      setIsDialogOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/novels");
        setNovels(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch novels.");
      }
    };

    fetchNovels();
  }, [isDialogOpen]);

  useEffect(() => {
    const sorted = [...novels];

    if (sort === "recent") {
      sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    } else if (sort === "oldest") {
      sorted.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    } else if (sort === "a-z") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "z-a") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    const filteredList = sorted.filter((novel) =>
      novel.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  }, [search, sort, novels]);

  const handleCreate = async (title: string, language: string) => {
    setSubmitLoading(true);
    setSubmitError("");
    try {
      await axios.post("http://localhost:8081/api/novels", {
        title,
        language,
      });
      setIsDialogOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setSubmitError(err.response?.data?.error || "Failed to add novel.");
      } else {
        setSubmitError("Unexpected error while adding novel.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Library</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage and view your translations
      </p>

      <div className="bg-white border rounded shadow p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border px-3 py-2 rounded"
          />

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {filtered.length} novel{filtered.length !== 1 && "s"}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
            </select>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              + New Novel
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No novels found." />
        ) : (
          <ul className="space-y-4 pt-4">
            {filtered.map((novel) => (
              <li
                key={novel.id}
                className="border p-4 rounded shadow hover:bg-gray-50"
              >
                <Link
                  to={`/library/${novel.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {novel.title}
                </Link>
                <p className="text-sm text-gray-600">
                  Language: {novel.language}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <NewNovelDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          navigate("/library", { replace: true }); // clean ?openNew param
        }}
        onCreate={handleCreate}
        loading={submitLoading}
        error={submitError}
      />

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
