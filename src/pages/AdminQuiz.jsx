import { useState, useEffect } from "react";

const AdminQuiz = () => {
    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        articleId: "",
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        type: "MULTIPLE_CHOICE",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/quiz`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setQuestions(data);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Gagal memuat pertanyaan.");  
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionChange = (index, value) => {
        const updated = [...form.options];
        updated[index] = value;
        setForm({ ...form, options: updated });
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        if (!form.articleId || !form.text || !form.correctAnswer || form.options.some(o => !o)) {
            setError("Semua field wajib diisi.");
            return;
        }

        if (!form.options.includes(form.correctAnswer)) {
            setError("Jawaban benar harus salah satu dari pilihan jawaban.");
            return;
        }

        try {
            const res = await fetch(`${API}/api/quiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Gagal membuat pertanyaan.");

            setSuccess("Pertanyaan berhasil ditambahkan!");
            setForm({ articleId: "", text: "", options: ["", "", "", ""], correctAnswer: "" });
            setShowForm(false);
            fetchQuestions();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin mau hapus pertanyaan ini?")) return;
        try {
            await fetch(`${API}/api/quiz/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuestions(questions.filter(q => q.id !== id));
            setSuccess("Pertanyaan berhasil dihapus.");
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Gagal menghapus pertanyaan.");  
        }
    };

    return (
        <div className="min-h-screen p-8 text-white max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Manajemen Quiz</h1>
                <button
                    onClick={() => { setShowForm(!showForm); setError(null); setSuccess(null); }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
                >
                    {showForm ? "Batal" : "+ Tambah Pertanyaan"}
                </button>
            </div>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

            {showForm && (
                <div className="bg-[#111A3B] border border-white/10 rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Tambah Pertanyaan Baru</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Article ID</label>
                            <input
                                type="text"
                                placeholder="UUID artikel"
                                value={form.articleId}
                                onChange={e => setForm({ ...form, articleId: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Pertanyaan</label>
                            <textarea
                                placeholder="Tulis pertanyaan di sini..."
                                value={form.text}
                                onChange={e => setForm({ ...form, text: e.target.value })}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Pilihan Jawaban</label>
                            <div className="flex flex-col gap-2">
                                {form.options.map((opt, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                                        value={opt}
                                        onChange={e => handleOptionChange(i, e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Jawaban Benar</label>
                            <select
                                value={form.correctAnswer}
                                onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                                className="w-full bg-[#111A3B] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- Pilih jawaban benar --</option>
                                {form.options.filter(o => o).map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-medium transition mt-2"
                        >
                            Simpan Pertanyaan
                        </button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Belum ada pertanyaan quiz.</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-[#111A3B] border border-white/10 rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Article ID: {q.articleId}</p>
                                    <p className="font-medium text-sm mb-3">
                                        <span className="text-gray-400 mr-2">#{index + 1}</span>
                                        {q.text}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {q.options?.map((opt, i) => (
                                            <span
                                                key={i}
                                                className={`text-xs px-2.5 py-1 rounded-full border ${
                                                    opt === q.correctAnswer
                                                        ? "border-green-500 text-green-400 bg-green-500/10"
                                                        : "border-white/10 text-gray-400"
                                                }`}
                                            >
                                                {opt === q.correctAnswer && "✓ "}
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className="text-red-400 hover:text-red-300 text-xs border border-red-400/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition shrink-0"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminQuiz;