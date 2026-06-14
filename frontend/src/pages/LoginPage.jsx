import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left side - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d261a] z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200" 
          alt="Luxury travel destination" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 text-white max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-black mb-4 leading-tight tracking-tight"
          >
            Vivez l'Inoubliable.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg"
          >
            Atlas vous connecte aux meilleurs experts pour des aventures d'exception, conçues sur mesure.
          </motion.p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md card-ak p-10"
        >
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-ak-accent/20 rounded-2xl flex items-center justify-center text-ak-accent mx-auto mb-6 border border-ak-accent/30 shadow-[0_0_15px_rgba(255,150,102,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h1 className="font-display text-4xl font-black text-white mb-2 tracking-tight">Atlas</h1>
            <p className="text-white/60">Connectez-vous à votre espace.</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium">{successMessage}</div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">{error}</div>
          )}

          <div className="mb-8 p-4 bg-white/5 border border-white/10 text-white/70 text-xs rounded-xl backdrop-blur-sm">
            <p className="font-semibold mb-2 text-white text-sm">Comptes de test :</p>
            <p className="mb-1"><span className="opacity-60">Voyageur:</span> voyageur@atlas.com</p>
            <p className="mb-1"><span className="opacity-60">Agent:</span> agent@example.com</p>
            <p className="text-white/40 mt-2 italic font-mono">password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Adresse email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-colors backdrop-blur-sm"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">Mot de passe</label>
                <button type="button" className="text-xs font-bold text-ak-accent hover:text-white transition-colors">
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-colors backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <span className="text-xs font-bold uppercase tracking-wider">{showPassword ? "Masquer" : "Voir"}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 btn-ak py-3.5 text-base relative overflow-hidden"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                    Connexion...
                 </span>
              ) : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-white/60 mt-8">
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="text-white font-bold hover:text-ak-accent transition-colors">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
