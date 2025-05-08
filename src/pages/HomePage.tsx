import { useEffect, useState } from "react";
import axios from "axios";

interface Novel {
  id: number;
  title: string;
}

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rawText, setRawText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dictionary, setDictionary] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
          (acc: Record<string, string>, entry: any) => {
            acc[entry.sourceTerm] = entry.targetTerm;
            return acc;
          },
          {}
        );
        setDictionary(dictObject);
      })
      .catch(() => {
        setDictionary({});
      });
  }, [selectedId]);

  const handleSubmit = async () => {
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
    } catch (err: any) {
      setError(err.response?.data?.error || "Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNovel = async () => {
    if (!newTitle || !newLanguage) return;

    setSubmitLoading(true);
    setSubmitError("");

    try {
      await axios.post("http://localhost:8081/api/novels", {
        title: newTitle,
        language: newLanguage,
      });
      const res = await axios.get("http://localhost:8081/api/novels");
      setNovels(res.data);
      setShowForm(false);
      setNewTitle("");
      setNewLanguage("");
    } catch (err) {
      console.log(err);
      setSubmitError("Failed to add novel.");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-2">
      <h1 className="text-2xl font-bold mb-6">Translate Chapter</h1>
      <label className="block mb-2 font-medium">Select Novel:</label>
      <select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(parseInt(e.target.value))}
        className="w-full border px-4 py-2 mb-4 rounded"
      >
        <option value="">-- Choose a novel --</option>
        {novels.map((novel) => (
          <option key={novel.id} value={novel.id}>
            {novel.title}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Paste Raw Text:</label>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="w-full border px-4 py-2 h-40 rounded mb-4"
      ></textarea>

      <label className="block mb-2 font-medium">Target Language:</label>
      <input
        type="text"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="w-full border px-4 py-2 rounded mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {response && (
        <div className="mt-6 bg-white text-gray-900 p-4 rounded shadow border whitespace-pre-wrap">
          <p className="text-sm text-gray-600 mb-2">
            Detected: {response.detected_source_language}
          </p>
          <p>{response.translated_text}</p>
        </div>
      )}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add New Novel"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Language</label>
            <input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            onClick={handleAddNovel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={submitLoading}
          >
            {submitLoading ? "Adding..." : "Add Novel"}
          </button>
          {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        </div>
      )}
    </main>
  );
}
