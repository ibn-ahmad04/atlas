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
      {/* Background abstract elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-ak-accent/10 blur-[120px] pointer-events-none"></div>

      {/* Left side - Hero Image */}
      <div className="hidden lg:block lg:w-[55%] relative">
        {/* Image wrapper with fade mask to blend perfectly with the body background */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_right,black_70%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_right,black_70%,transparent_100%)] z-0">
          <div className="absolute inset-0 bg-[#071913]/30 z-10 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200" 
            alt="Luxury travel destination" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071913] via-transparent to-transparent z-10"></div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-16 z-20 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-ak-accent/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-ak-accent/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg"
          >
            Vivez <br/><span className="text-ak-accent">l'Inoubliable.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg font-light leading-relaxed drop-shadow-md"
          >
            Atlas vous connecte aux meilleurs experts pour des aventures d'exception, conçues sur mesure avec une attention à chaque détail.
          </motion.p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md card-ak p-8 sm:p-10"
        >
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-black text-white mb-3 tracking-tight">Atlas</h1>
            <p className="text-white/60 font-light text-lg">Connectez-vous à votre espace.</p>
          </div>

          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span className="text-emerald-400 text-sm font-medium">{successMessage}</span>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2 ml-1">Adresse email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 group-focus-within:text-ak-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2 ml-1">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest">Mot de passe</label>
                <button type="button" className="text-xs font-semibold text-ak-accent hover:text-white transition-colors">
                  Oublié ?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 group-focus-within:text-ak-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-ak-accent">Masquer</span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider">Voir</span>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 btn-ak py-3.5 text-base relative overflow-hidden"
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                    Connexion...
                 </span>
              ) : "Se connecter"}
            </button>
          </form>

          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <p className="font-semibold text-white/80 text-sm">Comptes de test (password)</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setForm({email: 'voyageur@atlas.com', password: 'password'})} className="px-3 py-2 bg-black/20 hover:bg-black/40 border border-white/5 rounded-lg text-left transition-colors">
                <span className="block text-white/50 mb-0.5">Voyageur</span>
                <span className="text-white/90">voyageur@atlas.com</span>
              </button>
              <button onClick={() => setForm({email: 'agent@atlas.com', password: 'password'})} className="px-3 py-2 bg-black/20 hover:bg-black/40 border border-white/5 rounded-lg text-left transition-colors">
                <span className="block text-white/50 mb-0.5">Agent</span>
                <span className="text-white/90">agent@atlas.com</span>
              </button>
              <button onClick={() => setForm({email: 'admin@atlas.com', password: 'password'})} className="px-3 py-2 bg-black/20 hover:bg-black/40 border border-white/5 rounded-lg text-left transition-colors col-span-2">
                <span className="block text-white/50 mb-0.5">Admin</span>
                <span className="text-white/90">admin@atlas.com</span>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-white/60 mt-8">
            Nouveau sur Atlas ?{" "}
            <Link to="/register" className="text-white font-bold hover:text-ak-accent transition-colors">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
