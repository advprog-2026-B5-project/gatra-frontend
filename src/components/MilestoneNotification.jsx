import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MilestoneNotification = ({ unlockedAchievements, completedMissions }) => {
    const [achievements, setAchievements] = useState([]);
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        if (unlockedAchievements && unlockedAchievements.length > 0) {
            const unique = unlockedAchievements.filter(
                (a, i, arr) => arr.findIndex(b => b.id === a.id) === i
            );
            setAchievements(unique);
        }
    }, [unlockedAchievements]);

    useEffect(() => {
        if (completedMissions && completedMissions.length > 0) {
            const unique = completedMissions.filter(
                (m, i, arr) => arr.findIndex(b => b.missionId === m.missionId) === i
            );
            setMissions(unique);
        }
    }, [completedMissions]);

    useEffect(() => {
        if (achievements.length > 0 || missions.length > 0) {
            const timer = setTimeout(() => {
                setAchievements([]);
                setMissions([]);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [achievements, missions]);

    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {achievements.map((achievement) => (
                    <motion.div
                        key={`achievement-${achievement.id}`}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                        className="bg-[#162044] border border-blue-500/50 rounded-2xl p-4 shadow-2xl shadow-blue-900/30 w-80 pointer-events-auto flex items-center gap-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                        <div className="relative flex-shrink-0 z-10">
                            {achievement.badgeUrl ? (
                                <img src={achievement.badgeUrl} alt="Badge" className="w-14 h-14 object-cover rounded-full border-2 border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
                            ) : (
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(250,204,21,0.5)] border-2 border-yellow-200">
                                    🏆
                                </div>
                            )}
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="absolute -top-1 -right-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-blue-300"
                            >
                                NEW
                            </motion.div>
                        </div>
                        <div className="flex flex-col z-10">
                            <span className="text-yellow-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Achievement Unlocked</span>
                            <h4 className="text-white font-bold text-sm leading-tight">{achievement.name}</h4>
                            {achievement.description && (
                                <p className="text-gray-300 text-[11px] mt-1 leading-snug line-clamp-2">
                                    {achievement.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}

                {missions.map((mission) => (
                    <motion.div
                        key={`mission-${mission.missionId}`}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                        className="bg-[#0f1d2e] border border-emerald-500/50 rounded-2xl p-4 shadow-2xl shadow-emerald-900/30 w-80 pointer-events-auto flex items-center gap-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                        <div className="relative flex-shrink-0 z-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(52,211,153,0.5)] border-2 border-emerald-200">
                                ✅
                            </div>
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="absolute -top-1 -right-2 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-emerald-300"
                            >
                                +{mission.rewardPoints}
                            </motion.div>
                        </div>
                        <div className="flex flex-col z-10">
                            <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Misi Selesai!</span>
                            <h4 className="text-white font-bold text-sm leading-tight">{mission.title}</h4>
                            <p className="text-gray-300 text-[11px] mt-1 leading-snug">
                                Klaim reward di halaman Misi Harian
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default MilestoneNotification;
