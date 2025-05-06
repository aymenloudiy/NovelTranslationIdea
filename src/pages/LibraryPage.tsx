import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import EmptyState from "../components/EmptyState";

interface Novel {
  id: number;
  title: string;
  language: string;
}

export default function LibraryPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/novels");
        setNovels(res.data);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch novels:{err}`);
      }
    };

    fetchNovels();
  }, []);
  if (!novels.length) return <EmptyState message="No novels found." />;
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Library</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {novels.map((novel) => (
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
            <p className="text-sm text-gray-600">Language: {novel.language}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
