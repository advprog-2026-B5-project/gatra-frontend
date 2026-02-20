const API_URL = "http://localhost:8080/api";

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text(); 
    throw new Error(errorText || "Login gagal!");
  }

  return response.json();
};

export const register = async (username, password, displayName) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, displayName, role: "STUDENT" }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registrasi gagal!");
  }

  return response.json();
};

export const getAllUsers = async (token) => {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  if (!response.ok) throw new Error("Gagal mengambil data user");
  return response.json();
};