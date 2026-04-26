import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // Autorise l'envoi des cookies de session
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// L'intercepteur de requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // On ajoute le préfixe "Bearer " devant le token
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;