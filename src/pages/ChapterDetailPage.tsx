import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import EmptyState from "../components/EmptyState";

interface Chapter {
  translatedContent: string;
  rawText?: string;
  sourceLanguage: string;
  targetLanguage: string;
  chapterNumber: number;
}

export default function ChapterDetailPage() {
  const { novelId, chapterNumber } = useParams();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8081/api/translations/novel/${novelId}`
        );

        const match = res.data.find(
          (ch: Chapter) => ch.chapterNumber === parseInt(chapterNumber || "")
        );

        if (match) {
          setChapter(match);
        } else {
          setError("No chapter found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch chapter.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [novelId, chapterNumber]);

  if (loading) return <p className="text-gray-500">Loading chapter...</p>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!chapter)
    if (!chapter) {
      return <EmptyState message="Chapter not found." />;
    }

  if (!chapter.translatedContent && !chapter.rawText) {
    return <EmptyState message="This chapter has no content yet." />;
  }

  const contentToShow =
    showOriginal && chapter.rawText
      ? chapter.rawText
      : showOriginal
      ? "Original text unavailable."
      : chapter.translatedContent;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Chapter {chapter.chapterNumber} – {chapter.targetLanguage}
        </h1>
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showOriginal ? "Show Translation" : "Show Original"}
        </button>
      </div>
      <article className="whitespace-pre-line bg-gray-100 p-4 rounded shadow text-black">
        {contentToShow}
      </article>
    </main>
  );
}
