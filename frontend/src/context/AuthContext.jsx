import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("atlas_user");
    const token = localStorage.getItem("atlas_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // MOCK - remplacer par appel API quand backend prêt
    const mockUsers = {
      "voyageur@atlas.com": { id: 1, name: "Jean Dupont", email: "voyageur@atlas.com", role: "voyageur" },
      "agent@atlas.com":    { id: 2, name: "Julianne Lefebvre", email: "agent@atlas.com", role: "agent" },
    };
    const mockUser = mockUsers[email];
    if (!mockUser) throw new Error("Email ou mot de passe incorrect.");
    const mockToken = "mock_token_" + mockUser.role;
    localStorage.setItem("atlas_token", mockToken);
    localStorage.setItem("atlas_user", JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
    // API REELLE:
    // const res = await axios.post("/auth/login", { email, password });
    // if (!res.data.success) throw new Error(res.data.message);
    // const { token, user } = res.data.data;
    // localStorage.setItem("atlas_token", token);
    // localStorage.setItem("atlas_user", JSON.stringify(user));
    // setUser(user);
    // return user;
  };

  const register = async (fullName, email, password, role) => {
    // MOCK
    const newUser = { id: Date.now(), name: fullName, email, role };
    const mockToken = "mock_token_" + role;
    localStorage.setItem("atlas_token", mockToken);
    localStorage.setItem("atlas_user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
    // API REELLE:
    // const res = await axios.post("/auth/register", { fullName, email, password, role });
    // if (!res.data.success) throw new Error(res.data.message);
    // const { token, user } = res.data.data;
    // localStorage.setItem("atlas_token", token);
    // localStorage.setItem("atlas_user", JSON.stringify(user));
    // setUser(user);
    // return user;
  };

  const logout = () => {
    localStorage.removeItem("atlas_token");
    localStorage.removeItem("atlas_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans AuthProvider");
  return ctx;
}
