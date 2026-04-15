import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

const Navbar = () => {
    const navigate = useNavigate();

    // State untuk status dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [pinnedAchievements, setPinnedAchievements] = useState([]);

    // Referensi untuk mendeteksi klik di luar menu dropdown
    const dropdownRef = useRef(null);

    // Mengecek token dan role secara langsung
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 1. Efek untuk menutup dropdown jika user klik area kosong di layar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 2. Efek untuk mengambil data Achievement yang di-Pin (Showcase)
    useEffect(() => {
        const fetchPinnedAchievements = async () => {
            // Hanya jalankan jika user sudah login dan bukan Admin
            if (isLoggedIn && role !== 'ROLE_ADMIN') {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/achievements/me/displayed`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setPinnedAchievements(data);
                    }
                } catch (err) {
                    console.error("Gagal load pinned achievements:", err);
                }
            }
        };
        fetchPinnedAchievements();
    }, [isLoggedIn, role]);

    // 3. Fungsi Logout
    const handleLogout = () => {
        localStorage.clear();
        setIsDropdownOpen(false);
        navigate('/login');
    };

    return (
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-[#070913] sticky top-0 z-50">
            {/* Logo Kiri */}
            <div className="flex items-center">
                <button onClick={() => navigate('/')} className="focus:outline-none">
                    <Logo variant="full" className="h-10 w-auto object-contain" />
                </button>
            </div>

            {/* Menu Tengah */}
            <div className="hidden md:flex gap-8 text-gray-300">
                <Link to="/" className="font-sans hover:text-white transition">Beranda</Link>
                {isLoggedIn && (
                    <Link to="/listBacaan" className="font-sans hover:text-white transition">Bacaan</Link>
                )}
                <a href="#" className="hover:text-white transition">Tentang</a>
            </div>

            {/* Bagian Kanan (Login / Profile) */}
            <div className="flex items-center relative" ref={dropdownRef}>
                {isLoggedIn ? (
                    <>
                        {/* Tombol Ikon Profil */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#070913]"
                            title="Menu Akun"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Kotak Menu Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-14 mt-2 w-64 bg-[#131627] rounded-xl shadow-2xl py-2 border border-gray-800/60 z-50 animate-fade-in overflow-hidden">

                                {/* --- Area Pinned Achievements (Khusus Pelajar) --- */}
                                {role !== 'ROLE_ADMIN' && (
                                    <div className="px-4 py-3 border-b border-gray-800/80 mb-1 bg-white/5">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Showcase</p>

                                        {pinnedAchievements.length === 0 ? (
                                            <p className="text-xs text-gray-500 italic">Belum ada achievement yang dipin.</p>
                                        ) : (
                                            <div className="flex gap-3">
                                                {pinnedAchievements.map(ach => (
                                                    <div key={ach.id} className="relative group cursor-pointer" title={ach.name}>
                                                        <img
                                                            src={ach.badgeUrl || 'https://via.placeholder.com/40'}
                                                            alt={ach.name}
                                                            className="w-10 h-10 rounded-lg border border-yellow-500/30 object-contain bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.1)] group-hover:scale-110 group-hover:border-yellow-400 transition-all"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* --- Menu Navigasi Normal --- */}
                                {role === 'ROLE_ADMIN' && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E2235] hover:text-white transition"
                                    >
                                        Dashboard Admin
                                    </Link>
                                )}

                                <Link
                                    to="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E2235] hover:text-white transition"
                                >
                                    Profil Saya
                                </Link>

                                {/* Tombol Halaman Inventory (Khusus Pelajar) */}
                                {role !== 'ROLE_ADMIN' && (
                                    <Link
                                        to="/achievements"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E2235] hover:text-white transition"
                                    >
                                        <span>Achievement Saya</span>
                                    </Link>
                                )}

                                {role !== 'ROLE_ADMIN' && (
                                    <Link
                                        to="/missions"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E2235] hover:text-white transition"
                                    >
                                        <span>Misi Harian</span>
                                    </Link>
                                )}

                                <div className="border-t border-gray-800/80 my-1"></div>

                                {/* Opsi Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-medium"
                                >
                                    Keluar (Logout)
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <Button
                        onClick={() => navigate('/login')}
                        variant="primary"
                        className="w-fit"
                    >
                        Masuk
                    </Button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;