import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Au montage : vérifier si le token est valide via /auth/me
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch {
        // Token invalide ou expiré
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: loggedUser } = response.data.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(loggedUser);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post("/auth/register", formData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || "Erreur lors de l'inscription.",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Même si l'appel échoue (réseau, token expiré), on déconnecte localement
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = async () => {
    if (!token) return;
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
};
