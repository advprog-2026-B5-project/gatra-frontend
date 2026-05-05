import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const cardVariant = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.35 },
};

const ListBacaan = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const dropdownRef = useRef(null);

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
         
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [artRes, catRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            const artData = await artRes.json();
            const catData = await catRes.json();
            setArticles(artData);
            setCategories(catData);
        } catch (err) {
            console.error("Gagal memuat data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = articles.filter((a) => {
        const matchCat = selectedCategory === null || a.categoryId === selectedCategory;
        const matchSearch =
            searchQuery === "" ||
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

    return (
        <div className="min-h-screen flex flex-col px-6 md:px-10 py-16 max-w-7xl mx-auto w-full gap-10">

            {/* Header */}
            <motion.div {...fadeUp} className="flex flex-col items-center text-center gap-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold">Daftar Bacaan</h1>
                <p className="text-gray-400 text-sm max-w-md">
                    Tingkatkan literasi informasimu dengan membaca artikel-artikel yang dikurasi oleh tim Gatra.
                </p>
            </motion.div>

            {/* Toolbar: search + filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                    <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari bacaan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/60 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none text-white placeholder-gray-500 transition"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition bg-white/5 text-gray-300 border-white/10 hover:border-white/30 hover:text-white"
                    >
                        <span>{selectedCategoryName ?? "Semua Kategori"}</span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-52 bg-[#131627] border border-gray-800 rounded-xl shadow-2xl py-2 z-50"
                            >
                                <button
                                    onClick={() => { setSelectedCategory(null); setIsDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition
                                        ${selectedCategory === null
                                        ? "text-white bg-white/10"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    Semua Kategori
                                </button>

                                <div className="border-t border-gray-800 my-1" />

                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.id); setIsDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition
                                            ${selectedCategory === cat.id
                                            ? "text-white bg-white/10"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-[#111A3B] rounded-2xl h-52 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    {...fadeUp}
                    className="flex flex-col items-center justify-center gap-4 py-24 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-[#111A3B] flex items-center justify-center text-2xl">
                        📭
                    </div>
                    <p className="text-gray-400 text-sm">Tidak ada bacaan yang cocok.</p>
                    <button
                        onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
                    >
                        Reset filter
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((article) => (
                            <motion.div
                                key={article.id}
                                variants={cardVariant}
                                layout
                                onClick={() => navigate(`/bacaan/${article.id}`)}
                                className="group bg-[#111A3B] hover:brightness-110 rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300"
                            >
                                {/* Category badge */}
                                <div>
                                    <span
                                        className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
                                        style={{ backgroundColor: "#3B5BDB", color: "#ffffff" }}
                                    >
                                        {article.categoryName}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold text-base leading-snug text-white line-clamp-2">
                                    {article.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed flex-1">
                                    {article.content}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-400 group-hover:text-blue-300 transition mt-auto pt-2 border-t border-white/10">
                                    Baca
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ListBacaan;