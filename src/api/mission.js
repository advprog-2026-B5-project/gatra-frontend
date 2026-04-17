export const getActiveMissions = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/daily-missions/active`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Gagal memuat misi harian');
    return response.json();
};