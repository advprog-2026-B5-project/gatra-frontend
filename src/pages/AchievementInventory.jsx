
import React, { useState, useEffect } from 'react';
import { getMyAchievements } from '../api/achievement';

const AchievementInventory = () => {
    const [myAchievements, setMyAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const data = await getMyAchievements(token);
                setMyAchievements(data);
            } catch (err) {
                console.error("Gagal fetch data achievement:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyData();
    }, [token]);

    const handleToggleDisplay = async (id, isCurrentlyDisplayed) => {
        // 1. Cek limit di FE: kalau mau nyalain (isCurrentlyDisplayed: false) tapi sudah ada 3 yang nyala
        const displayedCount = myAchievements.filter(a => a.isDisplayed).length;
        if (!isCurrentlyDisplayed && displayedCount >= 3) {
            alert("Maksimal hanya 3 achievement yang bisa ditampilkan di profil!");
            return;
        }

        // Simpan state lama buat jaga-jaga kalau Backend error (Rollback)
        const previousState = [...myAchievements];

        try {
            // 2. Optimistic Update: Ubah tampilan di layar dulu biar kerasa cepet
            setMyAchievements(prev =>
                prev.map(a =>
                    a.id === id ? { ...a, isDisplayed: !isCurrentlyDisplayed } : a
                )
            );

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/achievements/${id}/display?displayed=${!isCurrentlyDisplayed}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                // Kalau BE ngasih error (misal 500 atau 400), lempar ke block catch
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Gagal memperbarui status achievement");
            }

        } catch (err) {
            console.error("Gagal toggle display:", err.message);
            alert(err.message);
            // 3. Rollback: Balikin ke posisi awal karena request ke server gagal
            setMyAchievements(previousState);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Baru saja";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#0B0D1A] p-8 text-white">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 animate-fade-in">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Achievement Saya
                    </h1>
                    <p className="text-gray-400 mt-2">Kumpulan prestasi dari perjalanan belajarmu di Gatra.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : myAchievements.length === 0 ? (
                    <div className="bg-[#131627] border border-gray-800 rounded-3xl p-16 text-center">
                        <p className="text-gray-500 italic">Belum ada achievement yang terbuka. Ayo semangat belajar!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myAchievements.map((ach) => {
                            // Cek apakah slot display sudah penuh
                            const isLimitReached = myAchievements.filter(a => a.isDisplayed).length >= 3;

                            return (
                                <div key={ach.id} className="bg-[#131627] border border-gray-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>

                                    <button
                                        // Kirim status isDisplayed saat ini apa adanya
                                        onClick={() => handleToggleDisplay(ach.id, ach.isDisplayed)}
                                        // Tombol jadi "mati" kalau sudah limit dan dia lagi gak aktif
                                        disabled={isLimitReached && !ach.isDisplayed}
                                        className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${
                                            ach.isDisplayed
                                                ? 'text-yellow-400 bg-yellow-400/10'
                                                : (isLimitReached
                                                    ? 'opacity-20 cursor-not-allowed text-gray-700'
                                                    : 'text-gray-600 hover:text-gray-400 hover:bg-white/5')
                                        }`}
                                        title={
                                            ach.isDisplayed
                                                ? "Lepas dari Profil"
                                                : (isLimitReached ? "Slot Profil Penuh (Maks 3)" : "Tampilkan di Profil")
                                        }
                                    >
                                        {ach.isDisplayed ? '⭐' : '☆'}
                                    </button>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                                            <img
                                                src={ach.badgeUrl || 'https://via.placeholder.com/50'}
                                                alt="Badge"
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-white">{ach.name}</h3>
                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{ach.category}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-6 line-clamp-2">{ach.description}</p>

                                    <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 italic">Didapatkan pada:</span>
                                        <span className="text-[10px] font-bold text-gray-300 bg-white/5 px-2 py-1 rounded-md">
                                            {formatDate(ach.unlockedAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

};

export default AchievementInventory;