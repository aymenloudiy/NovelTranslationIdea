import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import EmptyState from "../components/EmptyState";

interface Chapter {
  chapterNumber: number;
  targetLanguage: string;
}

export default function ChaptersPage() {
  const { novelId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/translations/novel/${novelId}`
        );
        setChapters(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load chapters.");
      }
    };

    const fetchNovelTitle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/novels/${novelId}`
        );
        setTitle(res.data.title);
      } catch (err) {
        console.error(err);
        setTitle("Unknown Novel");
      }
    };

    fetchChapters();
    fetchNovelTitle();
  }, [novelId]);
  if (!chapters.length)
    return <EmptyState message="No chapters found for this novel." />;
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Chapters – {title}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {chapters.map((chapter, idx) => (
          <li key={idx} className="border p-4 rounded shadow hover:bg-gray-50">
            <Link
              to={`/library/${novelId}/${chapter.chapterNumber}`}
              className="text-lg text-blue-600 hover:underline"
            >
              Chapter {chapter.chapterNumber} ({chapter.targetLanguage})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
