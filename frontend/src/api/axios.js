import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute automatiquement le token Bearer à chaque requête
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("atlas_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gère les erreurs 401 (token expiré → déconnexion)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("atlas_token");
      localStorage.removeItem("atlas_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
