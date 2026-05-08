import React, { useEffect } from 'react';

const NotificationToast = ({ message, points, onClose }) => {
    useEffect(() => {
        // Auto-close after 4 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
            <div className="bg-[#131627] border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                    🎉
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">{message}</h4>
                    {points > 0 ? (
                        <p className="text-blue-400 text-xs font-semibold mt-1">
                            +{points} Clan Points Earned!
                        </p>
                    ) : (
                        <p className="text-gray-400 text-xs mt-1">
                            Join a clan to earn points!
                        </p>
                    )}
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white ml-2">
                    ✕
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;