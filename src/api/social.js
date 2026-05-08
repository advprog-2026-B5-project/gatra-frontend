const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const searchUsers = async (token, query) => {
    if (!query) return [];
    const response = await fetch(`${API_URL}/api/social/search?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Gagal mencari user');
    return response.json();
};

export const getPublicProfile = async (token, username) => {
    const response = await fetch(`${API_URL}/api/social/profile/${username}`, {
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Profil tidak ditemukan');
    return response.json();
};