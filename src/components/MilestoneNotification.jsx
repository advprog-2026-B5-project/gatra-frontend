import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MilestoneNotification = ({ unlockedAchievements }) => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        if (unlockedAchievements && unlockedAchievements.length > 0) {
            setAchievements((prev) => [...prev, ...unlockedAchievements]);
            
            // Auto dismiss after 5 seconds
            const timer = setTimeout(() => {
                setAchievements([]);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [unlockedAchievements]);

    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {achievements.map((achievement, index) => (
                    <motion.div
                        key={`${achievement.id}-${index}`}
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
            </AnimatePresence>
        </div>
    );
};

export default MilestoneNotification;
