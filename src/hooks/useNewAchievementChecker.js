import { useState, useEffect } from 'react';
import { getMyAchievements } from '../api/achievement';

const STORAGE_KEY = 'seen_achievement_ids';

function getSeenIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveSeenIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function useNewAchievementChecker() {
    const [newAchievements, setNewAchievements] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        const checkForNew = async () => {
            try {
                const allAchievements = await getMyAchievements(token);
                if (cancelled) return;

                const currentIds = allAchievements.map(a => a.id);
                const seenIds = getSeenIds();

                const unseen = allAchievements.filter(a => !seenIds.includes(a.id));

                if (unseen.length > 0) {
                    setNewAchievements(unseen);
                    saveSeenIds(currentIds);
                } else {
                    saveSeenIds(currentIds);
                }
            } catch (err) {
                console.error('Gagal cek achievement baru:', err);
            }
        };

        checkForNew();

        return () => { cancelled = true; };
    }, [token]);

    const clearNewAchievements = () => setNewAchievements([]);

    return { newAchievements, clearNewAchievements };
}
