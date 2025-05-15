import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface Novel {
  id: number;
  title: string;
}
interface DictionaryEntry {
  sourceTerm: string;
  targetTerm: string;
}
interface TranslateResponse {
  success: boolean;
  translated_text: string;
  detected_source_language: string;
  dictionary: Record<string, string>;
  chapterNumber: number;
}

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rawText, setRawText] = useState("");
  const [targetLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TranslateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/novels")
      .then((res) => setNovels(res.data))
      .catch(() => setError("Failed to load novels."));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    axios
      .get(`http://localhost:8081/api/dictionaries/novel/${selectedId}`)
      .then((res) => {
        const dictObject = res.data.reduce(
          (acc: Record<string, string>, entry: DictionaryEntry) => {
            acc[entry.sourceTerm] = entry.targetTerm;
            return acc;
          },
          {}
        );
        setDictionary(dictObject);
      })
      .catch(() => setDictionary({}));
  }, [selectedId]);

  const handleTranslate = async () => {
    if (!selectedId || !rawText) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post("http://localhost:8081/api/translate", {
        novelId: selectedId,
        raw_text: rawText,
        targetLanguage,
        dictionary,
      });
      setResponse(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Translation failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        What can I translate for you?
      </h1>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste text here..."
        className="w-full max-w-2xl p-4 rounded mb-6 h-40 border border-neutral-700 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(parseInt(e.target.value))}
          className="flex-1 p-3 rounded border border-neutral-700"
        >
          <option value="">Select a novel</option>
          {novels.map((novel) => (
            <option key={novel.id} value={novel.id}>
              {novel.title}
            </option>
          ))}
        </select>

        <button
          onClick={() => navigate("/library?openNew=true")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Novel
        </button>

        <button
          onClick={handleTranslate}
          disabled={!selectedId || !rawText || loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition disabled:bg-blue-900"
        >
          {loading ? "Translating..." : "➜ Translate"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {response && (
        <div className="mt-6 bg-white text-gray-900 p-4 rounded shadow border max-w-2xl w-full whitespace-pre-wrap">
          <p className="text-sm text-gray-600 mb-2">
            Detected: {response.detected_source_language}
          </p>
          <p>{response.translated_text}</p>
        </div>
      )}
    </div>
  );
}
