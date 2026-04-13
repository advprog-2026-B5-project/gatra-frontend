const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/daily-missions`;

// Fungsi bantuan untuk mengambil token dari localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAllMissions = async () => {
    const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil data misi');
    return response.json();
};

export const createMission = async (missionData) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(missionData)
    });
    if (!response.ok) throw new Error('Gagal membuat misi');
    return response.json();
};

export const updateMission = async (id, missionData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(missionData)
    });
    if (!response.ok) throw new Error('Gagal mengupdate misi');
    return response.json();
};

export const deleteMission = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Gagal menghapus misi');
};