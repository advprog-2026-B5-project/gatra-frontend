import React, { useState, useEffect } from 'react';
import { getActiveMissions } from '../api/mission';

const DailyMissionPage = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const data = await getActiveMissions(token);
                setMissions(data);
            } catch (err) {
                setError("Gagal memuat misi harian. Silakan coba lagi nanti.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchMissions();
        } else {
            setError("Anda harus login untuk melihat misi.");
            setLoading(false);
        }
    }, [token]);

    // Format tipe aksi agar lebih enak dibaca (opsional)
    const formatActionType = (type) => {
        const map = {
            'READ_ARTICLE': 'Baca Artikel',
            'FINISH_QUIZ': 'Selesaikan Kuis',
            'LOGIN': 'Login Harian'
        };
        return map[type] || type.replace('_', ' ');
    };

    return (
        <div className="min-h-screen bg-[#070913] text-white p-6 md:p-12 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header */}
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text inline-block">
                        Misi Harian Gatra
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Selesaikan tantangan di bawah ini sebelum tengah malam untuk mendapatkan poin pengalaman (XP) dan lencana eksklusif!
                    </p>
                </header>

                {/* State: Loading & Error */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
                        <p>{error}</p>
                    </div>
                )}

                {/* State: Data Kosong */}
                {!loading && !error && missions.length === 0 && (
                    <div className="bg-[#131627] border border-gray-800/60 p-12 rounded-3xl text-center">
                        <div className="text-6xl mb-4">🌙</div>
                        <h3 className="text-2xl font-bold text-gray-200 mb-2">Semua Misi Selesai?</h3>
                        <p className="text-gray-500">Belum ada misi aktif untuk hari ini. Kembali lagi besok!</p>
                    </div>
                )}

                {/* Grid Misi */}
                {!loading && !error && missions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {missions.map((mission) => (
                            <div
                                key={mission.id}
                                className="bg-[#131627] border border-gray-800 rounded-3xl p-6 relative group overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-xl"
                            >
                                {/* Efek Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-500/10 border border-blue-500/20 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                                            🎯
                                        </div>

                                        {/* Badge Poin */}
                                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                                            <span className="text-yellow-400 font-black text-sm">{mission.rewardPoints} XP</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                        {mission.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 mb-6 line-clamp-3">
                                        {mission.description}
                                    </p>

                                    <div className="pt-4 border-t border-gray-800/50 flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-widest">
                                            <span>Tipe Aksi</span>
                                            <span className="text-blue-400">{formatActionType(mission.actionType)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-widest">
                                            <span>Target</span>
                                            <span className="text-white bg-white/10 px-2 py-0.5 rounded">{mission.targetCount}x</span>
                                        </div>
                                    </div>

                                    {/* Tombol Aksi (Opsional - Bisa diarahkan ke halaman yang sesuai) */}
                                    <button className="w-full mt-6 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 py-2.5 rounded-xl text-sm font-semibold transition-all group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                        Mulai Misi
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyMissionPage;