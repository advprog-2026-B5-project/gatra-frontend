import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MilestoneNotification from "../components/MilestoneNotification";

const QuizPage = () => {
    const { id: articleId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        fetchQuestions();
    }, [articleId]);

    const fetchQuestions = async () => {
        setIsLoading(true);
        setResult(null);
        setAnswers({});
        setCurrent(0);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/article/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal memuat soal");
            const data = await res.json();
            setQuestions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const goNext = () => {
        if (current < questions.length - 1) {
            setDirection(1);
            setCurrent((p) => p + 1);
        }
    };

    const goPrev = () => {
        if (current > 0) {
            setDirection(-1);
            setCurrent((p) => p - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                articleId: articleId,
                userId: userId,
                answers: questions.map((q) => ({
                    questionId: q.id,
                    answer: answers[q.id] ?? "",
                })),
            };

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/attempt`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Gagal submit kuis");
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === questions.length;
    const q = questions[current];
    const isTrueFalse = q && (!q.options || q.options.length === 0);
    const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F1E]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Memuat soal kuis...</p>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F1E]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">⚠️</div>
                    <p className="text-gray-400 text-sm">{error}</p>
                    <button
                        onClick={() => navigate(`/bacaan/${articleId}`)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
                    >
                        Kembali ke artikel
                    </button>
                </div>
            </div>
        );
    }

    // ── No questions ──
    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F1E]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">📭</div>
                    <p className="text-gray-400 text-sm">Belum ada soal untuk artikel ini.</p>
                    <button
                        onClick={() => navigate("/listBacaan")}
                        className="text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
                    >
                        Kembali ke daftar bacaan
                    </button>
                </div>
            </div>
        );
    }

    // ── Result screen ──
    if (result) {
        const passed = result.passed;
        const score = Math.round(result.score);
        const passing = Math.round(result.passingScore);

        return (
            <>
                <MilestoneNotification 
                    unlockedAchievements={result.milestoneResponse?.newlyUnlockedAchievements || []} 
                    completedMissions={result.milestoneResponse?.completedMissions || []}
                />
                <div className="min-h-screen bg-[#0B0F1E] flex items-center justify-center px-6 py-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md flex flex-col items-center gap-6"
                    >
                        {/* Result icon */}
                        <div className="text-center flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-white">
                            {passed ? "Selamat, kamu lulus!" : "Belum lulus"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {passed
                                ? "Kamu berhasil memahami isi bacaan ini."
                                : "Coba baca artikelnya lagi dan ulangi kuis ini."}
                        </p>
                    </div>

                    {/* Score card */}
                    <div className="w-full bg-[#111A3B] rounded-2xl p-6 flex flex-col gap-4">
                        {/* Score number */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Nilai kamu</p>
                                <p className={`text-5xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}>
                                    {score}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Nilai minimum</p>
                                <p className="text-2xl font-semibold text-gray-400">{passing}</p>
                            </div>
                        </div>

                        {/* Score bar */}
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(score, 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className={`h-full rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}
                            />
                        </div>

                        {/* Passing score marker */}
                        <p className="text-xs text-gray-500 text-center">
                            {passed
                                ? `Kamu melampaui nilai minimum sebesar ${score - passing} poin`
                                : `Kurang ${passing - score} poin lagi untuk lulus`}
                        </p>
                    </div>

                    {/* Per-question feedback */}
                    <div className="w-full flex flex-col gap-2">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Rincian jawaban</p>
                        {result.answers.map((a, i) => (
                            <div
                                key={a.questionId ?? i}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                                    ${a.isCorrect ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}
                            >
                                <span className="text-base">{a.isCorrect ? "✓" : "✗"}</span>
                                <span className="flex-1 text-gray-300">Soal {i + 1}</span>
                                <span className="text-xs opacity-70">
                                    Jawaban: {a.userAnswer}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="w-full flex flex-col gap-3 pt-2">
                        <button
                            onClick={fetchQuestions}
                            className="w-full py-3 rounded-xl font-medium text-sm border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition"
                        >
                            Ulangi Kuis
                        </button>
                        <button
                            onClick={() => navigate("/listBacaan")}
                            className="w-full py-3 rounded-xl font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            Kembali ke Daftar Bacaan
                        </button>
                    </div>
                </motion.div>
            </div>
            </>
        );
    }

    // ── Quiz screen ──
    return (
        <div className="min-h-screen bg-[#0B0F1E] px-6 py-12 flex flex-col max-w-2xl mx-auto">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <button
                    onClick={() => navigate(`/bacaan/${articleId}`)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Artikel
                </button>
                <span className="text-xs text-gray-500">
                    {answeredCount}/{questions.length} terjawab
                </span>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-10 overflow-hidden">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-blue-500 rounded-full"
                />
            </div>

            {/* Question dots */}
            <div className="flex gap-2 flex-wrap mb-8">
                {questions.map((q, i) => (
                    <button
                        key={q.id}
                        onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition
                            ${i === current
                            ? "bg-blue-600 text-white"
                            : answers[q.id]
                                ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                                : "bg-white/5 text-gray-500 border border-white/10 hover:border-white/20"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Question card */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -40 }}
                        transition={{ duration: 0.28 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Question number + text */}
                        <div className="bg-[#111A3B] rounded-2xl p-6 md:p-8 flex flex-col gap-3">
                            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                                Soal {current + 1} dari {questions.length}
                            </span>
                            <p className="text-white text-base md:text-lg leading-relaxed font-medium">
                                {q.text}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {isTrueFalse ? (
                                // True / False
                                ["true", "false"].map((val) => {
                                    const selected = answers[q.id] === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(q.id, val)}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-sm font-medium transition-all
                                                ${selected
                                                ? "bg-blue-600/20 border-blue-500 text-white"
                                                : "bg-white/3 border-white/10 text-gray-300 hover:border-white/25 hover:bg-white/5"
                                            }`}
                                        >
                                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                                ${selected ? "border-blue-400 bg-blue-500" : "border-gray-600"}`}>
                                                {selected && <span className="w-2 h-2 bg-white rounded-full" />}
                                            </span>
                                            {val === "true" ? "Benar" : "Salah"}
                                        </button>
                                    );
                                })
                            ) : (
                                // Multiple choice
                                q.options.map((opt, oi) => {
                                    const selected = answers[q.id] === opt;
                                    const labels = ["A", "B", "C", "D", "E"];
                                    return (
                                        <button
                                            key={oi}
                                            onClick={() => handleAnswer(q.id, opt)}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-sm text-left transition-all
                                                ${selected
                                                ? "bg-blue-600/20 border-blue-500 text-white"
                                                : "bg-white/3 border-white/10 text-gray-300 hover:border-white/25 hover:bg-white/5"
                                            }`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                                                ${selected ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"}`}>
                                                {labels[oi] ?? oi + 1}
                                            </span>
                                            {opt}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                <button
                    onClick={goPrev}
                    disabled={current === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400
                        hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Sebelumnya
                </button>

                {current < questions.length - 1 ? (
                    <button
                        onClick={goNext}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                            bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                        Berikutnya
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || isSubmitting}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition
                            ${allAnswered
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-white/5 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <>
                                Kumpulkan
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Unanswered warning */}
            {current === questions.length - 1 && !allAnswered && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-amber-400/80 mt-3"
                >
                    Masih ada {questions.length - answeredCount} soal yang belum dijawab
                </motion.p>
            )}
        </div>
    );
};

export default QuizPage;