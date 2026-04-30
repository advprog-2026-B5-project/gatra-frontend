const BASE_URL = `${import.meta.env.VITE_API_URL}/clans`;

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// clan

export const getAllClans = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Gagal mengambil daftar clan');
    return response.json();
};

export const getMyClan = async (token) => {
    const response = await fetch(`${BASE_URL}/me`, {
        headers: getAuthHeaders(token)
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Gagal mengambil data clan kamu');
    return response.json();
};

export const getClanById = async (clanId) => {
    const response = await fetch(`${BASE_URL}/${clanId}`);
    if (!response.ok) throw new Error('Clan tidak ditemukan');
    return response.json();
};

export const createClan = async (token, clanData) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(clanData)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? 'Gagal membuat clan');
    }
    return response.json();
};

export const deleteClan = async (token, clanId) => {
    const response = await fetch(`${BASE_URL}/${clanId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Gagal menghapus clan');
};

export const kickMember = async (token, clanId, targetUserId) => {
    const response = await fetch(`${BASE_URL}/${clanId}/members/${targetUserId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Gagal mengeluarkan anggota.');
    return true;
}

// apply membership

export const applyToClan = async (token, clanId) => {
    const response = await fetch(`${BASE_URL}/${clanId}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(token)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? 'Gagal apply ke clan');
    }
    return response.json();
};

export const getPendingApplications = async (token, clanId) => {
    const response = await fetch(`${BASE_URL}/${clanId}/applications`, {
        headers: getAuthHeaders(token)
    });
    if (!response.ok) throw new Error('Gagal mengambil daftar aplikasi');
    return response.json();
};

export const decideMembership = async (token, clanId, applicantId, decision) => {
    const response = await fetch(`${BASE_URL}/${clanId}/applications/${applicantId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ decision })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? 'Gagal memproses aplikasi');
    }
    return response.json();
};