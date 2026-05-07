import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const triggerSeasonReset = async (token) => {
    return await axios.post(`${API_URL}/api/admin/season/reset`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};