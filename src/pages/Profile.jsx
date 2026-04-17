import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ displayName: '', phoneNumber: '' });

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');


    const [achievements, setAchievements] = useState([]);


    useEffect(() => {
        if (!userId || !token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Sesi kedaluwarsa atau profil tidak ditemukan');

                const data = await response.json();
                setUser(data);
                setEditFormData({
                    displayName: data.displayName || '',
                    phoneNumber: data.phoneNumber || ''
                });

            } catch (err) {
                setError(err.message);

                if (err.message.includes('Sesi')) {
                    localStorage.clear();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, token, navigate]);


    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/achievements/me/displayed`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) throw new Error("Gagal fetch achievements");

                const data = await res.json();

                // backend sudah limit 3
                setAchievements(data);

            } catch (err) {
                console.error("Error achievements:", err.message);
            }
        };

        if (token) fetchAchievements();
    }, [token]);


    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) throw new Error('Gagal mengupdate profil');

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
            alert('Profil berhasil diperbarui!');
        } catch (err) {
            alert(err.message);
        }
    };


    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            'PERINGATAN: Apakah Anda yakin ingin menghapus akun ini secara permanen? Semua data Anda akan hilang dan tidak dapat dikembalikan.'
        );

        if (isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Gagal menghapus akun');

                alert('Akun berhasil dihapus. Sampai jumpa!');
                localStorage.clear();
                navigate('/');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return <div className="flex-1 flex items-center justify-center text-white">Memuat Profil...</div>;
    if (error) return <div className="flex-1 flex items-center justify-center text-red-400">{error}</div>;

    return (
        <div className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center p-4 pb-20 pt-10">

            {/* Background Glow Effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-purple-600/20 blur-[120px] rounded-t-full pointer-events-none"></div>

            <div className="bg-[#131627] p-8 md:p-10 rounded-3xl w-full max-w-125 shadow-2xl border border-gray-800/60 relative z-10">

                <h2 className="text-2xl font-bold text-center mb-8 tracking-wide text-white">
                    Profil Saya
                </h2>


                {!isEditing ? (
                    <div className="space-y-4">

                        <div className="bg-[#1E2235] p-4 rounded-xl border border-gray-700/50">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Username</p>
                            <p className="font-medium text-lg text-white">{user.username}</p>
                        </div>

                        <div className="bg-[#1E2235] p-4 rounded-xl border border-gray-700/50">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Email</p>
                            <p className="font-medium text-lg text-white">{user.email}</p>
                        </div>

                        <div className="bg-[#1E2235] p-4 rounded-xl border border-gray-700/50">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Display Name</p>
                            <p className="font-medium text-lg text-white">
                                {user.displayName || <span className="text-gray-500 italic">Belum diatur</span>}
                            </p>
                        </div>

                        <div className="bg-[#1E2235] p-4 rounded-xl border border-gray-700/50">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Nomor HP</p>
                            <p className="font-medium text-lg text-white">
                                {user.phoneNumber || <span className="text-gray-500 italic">Belum diatur</span>}
                            </p>
                        </div>


                        <div className="bg-[#131627] border border-gray-700/50 p-4 rounded-xl">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-3">
                                Achievements
                            </p>

                            {achievements.length === 0 ? (
                                <p className="text-gray-500 italic">
                                    Belum ada achievement yang ditampilkan
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {achievements.map((a) => (
                                        <div key={a.id} className="flex items-center gap-2">
                                            <span className="text-yellow-400">⭐</span>
                                            <div>
                                                <p className="text-white text-sm font-medium">{a.name}</p>
                                                <p className="text-[10px] text-gray-500">{a.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {}
                        <div className="pt-6 flex flex-col gap-3">

                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                Edit Data Profil
                            </button>

                            <button
                                onClick={handleDelete}
                                className="w-full bg-red-500/10 text-red-500 border border-red-500/30 py-3 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition"
                            >
                                Hapus Akun Permanen
                            </button>

                        </div>
                    </div>

                ) : (

                    <form onSubmit={handleUpdate} className="space-y-4">

                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium ml-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                required
                                value={editFormData.displayName}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, displayName: e.target.value })
                                }
                                className="w-full bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium ml-1">
                                Nomor HP
                            </label>
                            <input
                                type="text"
                                value={editFormData.phoneNumber}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                                }
                                className="w-full bg-[#1E2235] border border-transparent focus:border-blue-500 rounded-xl p-3 text-sm outline-none text-white"
                            />
                        </div>

                        <div className="pt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-700/50 text-gray-300 py-3 rounded-xl font-semibold"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold"
                            >
                                Simpan
                            </button>

                        </div>

                    </form>
                )}
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-8 text-sm text-gray-400 hover:text-white transition font-medium relative z-10"
            >
                Keluar dari Akun (Logout)
            </button>
        </div>
    );
};

export default Profile;