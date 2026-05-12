import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recharge l'agent depuis localStorage au demarrage
  useEffect(() => {
    const stored = localStorage.getItem("atlas_user");
    const token  = localStorage.getItem("atlas_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    // MOCK - remplacer par appel API quand backend pret :
    // const res = await axios.post("/auth/login", { email, password });
    // if (!res.data.success) throw new Error(res.data.message);
    // const { token, user } = res.data.data;
    // localStorage.setItem("atlas_token", token);
    // localStorage.setItem("atlas_user", JSON.stringify(user));
    // setUser(user);
    // return user;

    const mockAgent = { id: 1, name: "Julianne Lefebvre", email, role: "agent" };
    localStorage.setItem("atlas_token", "mock_token_agent");
    localStorage.setItem("atlas_user", JSON.stringify(mockAgent));
    setUser(mockAgent);
    return mockAgent;
  };

  // REGISTER
  const register = async (fullName, email, password) => {
    // MOCK - remplacer par appel API :
    // const res = await axios.post("/auth/register", { fullName, email, password, role: "agent" });
    // if (!res.data.success) throw new Error(res.data.message);
    // const { token, user } = res.data.data;
    // localStorage.setItem("atlas_token", token);
    // localStorage.setItem("atlas_user", JSON.stringify(user));
    // setUser(user);
    // return user;

    const newAgent = { id: Date.now(), name: fullName, email, role: "agent" };
    localStorage.setItem("atlas_token", "mock_token_agent");
    localStorage.setItem("atlas_user", JSON.stringify(newAgent));
    setUser(newAgent);
    return newAgent;
  };

  // LOGOUT
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
