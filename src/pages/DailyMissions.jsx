import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveMissionsWithProgress, claimMissionReward } from '../api/missionProgress';

const ACTION_TYPE_LABELS = {
    READ_ARTICLE: 'Membaca Artikel',
    FINISH_QUIZ: 'Menyelesaikan Kuis',
};

const DailyMissions = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [missions, setMissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchMissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMissions = async () => {
        setIsLoading(true);
        try {
            const data = await getActiveMissionsWithProgress(token);
            setMissions(data);
        } catch (err) {
            console.error('Gagal memuat misi:', err);
            setFeedback({ type: 'error', message: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async (missionId) => {
        setClaimingId(missionId);
        setFeedback({ type: '', message: '' });
        try {
            await claimMissionReward(token, missionId);
            setFeedback({ type: 'success', message: 'Reward berhasil diklaim!' });
            fetchMissions();
            setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        } catch (err) {
            setFeedback({ type: 'error', message: err.message });
        } finally {
            setClaimingId(null);
        }
    };

    const getProgressPercentage = (current, target) => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    return (
        <div className="min-h-screen bg-[#0B0D1A] p-6 md:p-8 text-white">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        Misi Harian
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Selesaikan misi harian untuk mendapatkan poin reward.
                    </p>
                </header>

                {feedback.message && (
                    <div className={`mb-6 p-4 rounded-2xl text-sm border ${
                        feedback.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : missions.length === 0 ? (
                    <div className="bg-[#131627] border border-gray-800 rounded-3xl p-16 text-center">
                        <div className="text-4xl mb-4">🎯</div>
                        <p className="text-gray-400">Belum ada misi harian yang aktif saat ini.</p>
                        <p className="text-gray-500 text-sm mt-2">Cek kembali nanti!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {missions.map((mission) => {
                            const pct = getProgressPercentage(mission.currentCount, mission.targetCount);
                            const isComplete = mission.isCompleted ?? mission.completed ?? false;
                            const isClaimed = mission.isClaimed ?? mission.claimed ?? false;

                            return (
                                <div
                                    key={mission.missionId}
                                    className={`bg-[#131627] border rounded-2xl p-6 transition-all ${
                                        isClaimed
                                            ? 'border-green-500/20 opacity-75'
                                            : isComplete
                                                ? 'border-yellow-500/30 shadow-lg shadow-yellow-500/5'
                                                : 'border-gray-800 hover:border-gray-700'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                                    isClaimed
                                                        ? 'bg-green-500/20'
                                                        : isComplete
                                                            ? 'bg-yellow-500/20'
                                                            : 'bg-blue-500/20'
                                                }`}>
                                                    {isClaimed ? '✅' : isComplete ? '🏆' : '🎯'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-white">{mission.title}</h3>
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold ${
                                                        mission.actionType === 'READ_ARTICLE' ? 'text-blue-400' : 'text-purple-400'
                                                    }`}>
                                                        {ACTION_TYPE_LABELS[mission.actionType] || mission.actionType}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 ml-[52px]">{mission.description}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 min-w-[200px]">
                                            <div className="w-full">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Progres</span>
                                                    <span className="text-xs font-mono font-bold text-white">
                                                        {mission.currentCount} / {mission.targetCount}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isClaimed
                                                                ? 'bg-green-500'
                                                                : isComplete
                                                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                                                                    : 'bg-gradient-to-r from-blue-600 to-blue-400'
                                                        }`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-yellow-500">
                                                    +{mission.rewardPoints} Pts
                                                </span>

                                                {isClaimed ? (
                                                    <span className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                                                        Sudah Diklaim
                                                    </span>
                                                ) : isComplete ? (
                                                    <button
                                                        onClick={() => handleClaim(mission.missionId)}
                                                        disabled={claimingId === mission.missionId}
                                                        className="text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-xl transition disabled:opacity-50 shadow-lg shadow-yellow-500/20"
                                                    >
                                                        {claimingId === mission.missionId ? 'Mengklaim...' : 'Klaim Reward'}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-500 italic">
                                                        Belum selesai
                                                    </span>
                                                )}
                                            </div>
                                        </div>
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

export default DailyMissions;
