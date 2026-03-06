const API_URL = `${import.meta.env.VITE_API_URL}`;

export const getAllArticles = async (token) => {
    const response = await fetch(`${API_URL}/articles`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal mengambil artikel");
    return response.json();
};

export const createArticle = async (token, data) => {
    const response = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Gagal membuat artikel");
    return response.json();
};

export const updateArticle = async (token, id, data) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Gagal update artikel");
    return response.json();
};

export const deleteArticle = async (token, id) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal hapus artikel");
};

export const getAllCategories = async (token) => {
    const response = await fetch(`${API_URL}/categories`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal mengambil kategori");
    return response.json();
};

export const createCategory = async (token, name) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error("Gagal membuat kategori");
    return response.json();
};

export const updateCategory = async (token, id, name) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error("Gagal update kategori");
    return response.json();
};

export const deleteCategory = async (token, id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Gagal hapus kategori");
};