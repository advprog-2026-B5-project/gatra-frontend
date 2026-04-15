const API_URL = `${import.meta.env.VITE_API_URL}`;

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const getActiveMissionsWithProgress = async (token) => {
    const response = await fetch(`${API_URL}/api/missions/progress`, {
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Gagal mengambil data misi harian');
    return response.json();
};

export const claimMissionReward = async (token, missionId) => {
    const response = await fetch(`${API_URL}/api/missions/${missionId}/claim`, {
        method: 'POST',
        headers: getAuthHeaders(token)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Gagal mengklaim reward');
    }
    return response.json();
};
