import { useEffect, useState } from "react";
import axios from "axios";

interface Novel {
  id: number;
  title: string;
}

interface Term {
  id: number;
  sourceTerm: string;
  targetTerm: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export default function TermsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [form, setForm] = useState<Omit<Term, "id">>({
    sourceTerm: "",
    targetTerm: "",
    sourceLanguage: "",
    targetLanguage: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8081/api/novels").then((res) => {
      setNovels(res.data);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    axios
      .get(`http://localhost:8081/api/dictionaries/novel/${selectedId}`)
      .then((res) => setTerms(res.data))
      .catch(() => setTerms([]));
  }, [selectedId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedId) return;
    try {
      if (editingId) {
        await axios.put(`http://localhost:8081/api/dictionaries/${editingId}`, {
          ...form,
          novelId: selectedId,
        });
      } else {
        await axios.post(
          `http://localhost:8081/api/dictionaries/novel/${selectedId}`,
          form
        );
      }
      const res = await axios.get(
        `http://localhost:8081/api/dictionaries/novel/${selectedId}`
      );
      setTerms(res.data);
      setForm({
        sourceTerm: "",
        targetTerm: "",
        sourceLanguage: "",
        targetLanguage: "",
      });
      setEditingId(null);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error saving term.");
    }
  };

  const handleEdit = (term: Term) => {
    setForm({
      sourceTerm: term.sourceTerm,
      targetTerm: term.targetTerm,
      sourceLanguage: term.sourceLanguage,
      targetLanguage: term.targetLanguage,
    });
    setEditingId(term.id);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8081/api/dictionaries/${id}`);
    setTerms(terms.filter((t) => t.id !== id));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Term Dictionary</h1>

      <label className="block mb-2 font-medium">Select Novel:</label>
      <select
        className="mb-6 border px-4 py-2 rounded w-full"
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(parseInt(e.target.value))}
      >
        <option value="">-- Choose a novel --</option>
        {novels.map((n) => (
          <option key={n.id} value={n.id}>
            {n.title}
          </option>
        ))}
      </select>

      {selectedId && (
        <>
          <div className="bg-gray-100 p-4 rounded mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Term" : "Add New Term"}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Source Term"
                name="sourceTerm"
                value={form.sourceTerm}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                placeholder="Target Term"
                name="targetTerm"
                value={form.targetTerm}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                placeholder="Source Language"
                name="sourceLanguage"
                value={form.sourceLanguage}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                placeholder="Target Language"
                name="targetLanguage"
                value={form.targetLanguage}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update Term" : "Add Term"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Target</th>
                  <th className="px-4 py-2">Source Lang</th>
                  <th className="px-4 py-2">Target Lang</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <tr key={term.id} className="border-t">
                    <td className="px-4 py-2">{term.sourceTerm}</td>
                    <td className="px-4 py-2">{term.targetTerm}</td>
                    <td className="px-4 py-2">{term.sourceLanguage}</td>
                    <td className="px-4 py-2">{term.targetLanguage}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(term)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(term.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
