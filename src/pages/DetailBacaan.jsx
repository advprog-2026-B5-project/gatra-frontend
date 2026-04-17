import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const DetailBacaan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Artikel tidak ditemukan");
            const data = await res.json();
            setArticle(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Memuat bacaan...</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">📭</div>
                    <p className="text-gray-400 text-sm">{error || "Artikel tidak ditemukan."}</p>
                    <button
                        onClick={() => navigate("/bacaan")}
                        className="text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
                    >
                        Kembali ke daftar bacaan
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 md:px-10 py-16 max-w-3xl mx-auto w-full">
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate("/listBacaan")}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-10 group"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Daftar Bacaan
            </motion.button>

            <motion.article {...fadeUp} className="flex flex-col gap-6">
                <div>
                    <span
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "#3B5BDB", color: "#ffffff" }}
                    >
                        {article.categoryName}
                    </span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
                    {article.title}
                </h1>
                <div className="border-t border-white/10" />
                <div className="text-gray-300 text-base bg-[#111A3B] rounded-2xl p-6 md:p-8 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                </div>
                <button
                    onClick={() => navigate(`/quiz/${id}`)}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
                >
                    Mulai Quiz
                </button>
            </motion.article>
        </div>
    );
};

export default DetailBacaan;