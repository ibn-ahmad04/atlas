import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/"); // will redirect to /dashboard via HomeRedirect
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else {
        setError(err.response?.data?.message || err.message || "Erreur de connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Atlas</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Bon retour</h2>
            <p className="text-gray-500 text-sm">Connectez-vous a votre compte</p>
          </div>

          {successMessage && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{successMessage}</div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <div className="mb-5 p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs rounded-xl">
            <p className="font-semibold mb-1">Comptes de test :</p>
            <p>Voyageur : voyageur@atlas.com</p>
            <p>Agent : agent@atlas.com</p>
            <p className="text-indigo-400 mt-1">(mot de passe : n importe quoi)</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "Masquer" : "Voir"}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-indigo-200"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">S inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
