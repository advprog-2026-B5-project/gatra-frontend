const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/daily-missions`;

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const getAllMissions = async (token) => {
    const response = await fetch(BASE_URL, { headers: getAuthHeaders(token) });
    if (!response.ok) throw new Error('Gagal mengambil data misi');
    return response.json();
};

export const createMission = async (token, missionData) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(missionData)
    });
    if (!response.ok) throw new Error('Gagal membuat misi');
    return response.json();
};

export const updateMission = async (token, id, missionData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(missionData)
    });
    if (!response.ok) throw new Error('Gagal mengupdate misi');
    return response.json();
};

export const deleteMission = async (token, id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Gagal menghapus misi');
};