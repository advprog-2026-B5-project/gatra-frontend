const API_URL = `${import.meta.env.VITE_API_URL}`;

export const getAllAchievements = async (token) => {
    const response = await fetch(`${API_URL}/api/achievements`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal mengambil achievement");
    return response.json();
};

export const getAchievementById = async (token, id) => {
    const response = await fetch(`${API_URL}/api/achievements/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal mengambil detail achievement");
    return response.json();
};

export const createAchievement = async (token, data) => {
    const response = await fetch(`${API_URL}/api/achievements`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Gagal membuat achievement");
    }
    return response.json();
};

export const updateAchievement = async (token, id, data) => {
    const response = await fetch(`${API_URL}/api/achievements/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Gagal update achievement");
    }
    return response.json();
};

export const deleteAchievement = async (token, id) => {
    const response = await fetch(`${API_URL}/api/achievements/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal hapus achievement");
};
