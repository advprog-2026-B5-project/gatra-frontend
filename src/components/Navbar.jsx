import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

const Navbar = () => {
    const navigate = useNavigate();

    // State untuk status dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Referensi untuk mendeteksi klik di luar menu dropdown
    const dropdownRef = useRef(null);

    // Mengecek token secara langsung (Derived State)
    const isLoggedIn = !!localStorage.getItem('token');

    // 2. Efek untuk menutup dropdown jika user klik area kosong di layar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    <>
                        <Link to="/listBacaan" className="font-sans hover:text-white transition">Bacaan</Link>
                        <Link to="/missions" className="font-sans hover:text-white transition flex items-center gap-1">Daily Mission</Link>
                    </>
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
                            <div className="absolute right-0 top-14 mt-2 w-48 bg-[#131627] rounded-xl shadow-2xl py-2 border border-gray-800/60 z-50 animate-fade-in">

                                {/* Opsi 1: Halaman Profil */}
                                <Link
                                    to="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E2235] hover:text-white transition"
                                >
                                    Profil Saya
                                </Link>

                                <div className="border-t border-gray-800/80 my-1"></div>

                                {/* Opsi 2: Logout */}
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