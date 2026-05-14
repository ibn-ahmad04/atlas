import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [role, setRole] = useState("voyageur");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    setErrors({});
    if (!form.terms) {
      setErrors({ terms: ["Veuillez accepter les conditions d'utilisation."] });
      return;
    }
    
    setLoading(true);
    
    const response = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      role: role
    });

    if (response.success) {
      navigate("/login", { state: { message: "Inscription réussie, connectez-vous" } });
    } else {
      setErrors(response.errors || {});
      if (response.message && Object.keys(response.errors || {}).length === 0) {
        setErrors({ general: [response.message] });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full opacity-40 blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200 rounded-full opacity-40 blur-3xl -translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-indigo-700 font-bold text-xl tracking-wide">Atlas</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
            Concevez le voyage de{" "}
            <span className="text-indigo-600">leurs rêves</span>.
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-sm">
            Rejoignez la plateforme d'élite des architectes du voyage. Accédez à des collections exclusives et gérez vos itinéraires avec une fluidité sans précédent.
          </p>
        </div>

        {/* Featured destination card */}
        <div className="relative z-10 bg-white rounded-2xl p-6 shadow-lg max-w-xs">
          {/* Atlas logo stylized */}
          <div className="flex items-center justify-center h-40 mb-3">
            <svg viewBox="0 0 200 120" className="w-48 h-32">
              <defs>
                <linearGradient id="atlasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <text x="10" y="90" fontFamily="serif" fontSize="80" fontWeight="900" fill="url(#atlasGrad)" opacity="0.15">A</text>
              <path d="M60 90 L100 20 L140 90 M75 65 L125 65" stroke="url(#atlasGrad)" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M100 20 L155 45 L145 50 L100 30 Z" fill="url(#atlasGrad)" opacity="0.8"/>
            </svg>
          </div>
          <p className="text-center font-bold text-gray-900 tracking-widest text-sm">ATLAS</p>
          <p className="text-center text-indigo-500 text-xs font-semibold tracking-widest mt-1">DESTINATION EN VEDETTE: MALDIVES</p>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 lg:p-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-1">Créer votre compte</h2>
            <p className="text-gray-500 text-sm">Commencez votre voyage premium aujourd'hui.</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-4 mb-6">
            {["voyageur", "agent"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 capitalize border ${
                  role === r
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {r === "voyageur" ? "Voyageur" : "Agent"}
              </button>
            ))}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {errors.general[0]}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jean@atlas.com"
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmation</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </span>
                  <input
                    name="password_confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border ${errors.password_confirmation ? 'border-red-300' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation[0]}</p>}
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  J'accepte les{" "}
                  <a href="#" className="text-indigo-600 font-medium hover:underline">Conditions d'Utilisation</a>{" "}
                  et la{" "}
                  <a href="#" className="text-indigo-600 font-medium hover:underline">Politique de Confidentialité</a>.
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-600">{errors.terms[0]}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Création en cours...
                </span>
              ) : "Créer un compte"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà membre ?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Language selector */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 text-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
        Français
      </div>
    </div>
  );
}
