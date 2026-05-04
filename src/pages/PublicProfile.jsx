import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../api/social';

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPublicProfile(token, username);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username, token, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B0D1A] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[#0B0D1A] flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">🕵️</div>
                <h2 className="text-xl font-bold text-white mb-2">User Tidak Ditemukan</h2>
                <p className="text-gray-400 text-sm mb-6">Mungkin username salah atau akun telah dihapus.</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#131627] border border-gray-800 text-white rounded-lg hover:border-gray-600 transition">
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D1A] text-white p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-[#131627] border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        {/* Avatar Placeholder */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-black text-white uppercase border-4 border-[#0B0D1A] shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
                            {profile.displayName ? profile.displayName.charAt(0) : profile.username.charAt(0)}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">{profile.displayName || profile.username}</h1>
                            <p className="text-blue-400 font-mono text-sm mb-4">@{profile.username}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="bg-[#1E2235] px-4 py-2 rounded-xl border border-gray-800">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Total Score</p>
                                    <p className="font-bold text-lg text-white">{profile.totalScore?.toLocaleString() || 0} <span className="text-xs font-normal text-gray-500">pts</span></p>
                                </div>
                                <div className="bg-[#1E2235] px-4 py-2 rounded-xl border border-gray-800">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">League Tier</p>
                                    <p className="font-bold text-lg text-purple-400">{profile.currentLeagueTier || 'Bronze'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Featured Achievements */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">Showcase Pencapaian</h3>
                        {profile.featuredAchievements && profile.featuredAchievements.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profile.featuredAchievements.map((ach) => (
                                    <div key={ach.id} className="bg-[#131627] border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-5 transition-colors flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                            {ach.badgeUrl ? (
                                                <img src={ach.badgeUrl} alt={ach.name} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className="text-xl">🏆</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white mb-1">{ach.name}</h4>
                                            <p className="text-xs text-gray-400 line-clamp-2">{ach.description || "Pencapaian luar biasa."}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#131627] border border-gray-800 rounded-2xl p-8 text-center">
                                <p className="text-gray-500 text-sm">Belum ada pencapaian yang dipamerkan.</p>
                            </div>
                        )}
                    </div>

                    {/* Joined Clans */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">Klan</h3>
                        {profile.joinedClans && profile.joinedClans.length > 0 ? (
                            <div className="space-y-3">
                                {profile.joinedClans.map((clan) => (
                                    <div key={clan.id} className="bg-[#131627] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-lg font-bold shrink-0">
                                            {clan.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white truncate">{clan.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{clan.role === 'LEADER' ? 'Ketua' : 'Anggota'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#131627] border border-gray-800 rounded-xl p-6 text-center">
                                <p className="text-gray-500 text-xs">Belum bergabung dengan klan manapun.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicProfile;