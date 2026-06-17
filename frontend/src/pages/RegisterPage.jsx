import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "voyageur",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ["Les mots de passe ne correspondent pas."] });
      return;
    }

    setLoading(true);
    try {
      const res = await register(form);
      if (res.success) {
        navigate("/login", { state: { message: "Inscription réussie. Veuillez vous connecter." } });
      } else {
        if (res.errors && Object.keys(res.errors).length > 0) {
          setErrors(res.errors);
        } else {
          setErrors({ global: res.message });
        }
      }
    } catch (err) {
      setErrors({ global: "Une erreur inattendue est survenue." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background abstract elements */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-ak-accent/10 blur-[150px] pointer-events-none"></div>

      {/* Left side - Hero Image */}
      <div className="hidden lg:block lg:w-[55%] relative">
        {/* Image wrapper with fade mask to blend perfectly with the body background */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_right,black_70%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_right,black_70%,transparent_100%)] z-0">
          <div className="absolute inset-0 bg-[#071913]/30 z-10 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200" 
            alt="Adventure travel destination" 
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
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.2 0-2 .8-2 2v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg"
          >
            Votre Prochaine <br/><span className="text-ak-accent">Aventure.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg font-light leading-relaxed drop-shadow-md"
          >
            Rejoignez une communauté exclusive de voyageurs exigeants et de créateurs de voyages passionnés.
          </motion.p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-20 overflow-y-auto max-h-screen no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md my-auto card-ak p-8 sm:p-10"
        >
          <div className="mb-8 pt-4 lg:pt-0 text-center">
            <h1 className="font-display text-4xl font-black text-white mb-3 tracking-tight">Rejoindre Atlas</h1>
            <p className="text-white/60 font-light text-lg">Créez votre compte en quelques secondes.</p>
          </div>

          {errors.global && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="text-red-400 text-sm font-medium">{errors.global}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 pb-4">
            
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-3 ml-1">Je souhaite m'inscrire en tant que :</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "voyageur" })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.role === "voyageur" 
                      ? "bg-white/10 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 mb-2 ${form.role === 'voyageur' ? 'text-white' : 'text-white/40'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  <span className="block font-bold mb-1 text-sm">Voyageur</span>
                  <span className="text-xs opacity-70 line-clamp-2">Explorer des destinations et réserver.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "agent" })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.role === "agent" 
                      ? "bg-ak-accent/20 border-ak-accent text-white shadow-[0_0_20px_rgba(255,150,102,0.15)]" 
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 mb-2 ${form.role === 'agent' ? 'text-ak-accent' : 'text-white/40'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5c-1.2 0-2 .8-2 2v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="block font-bold mb-1 text-sm">Agent de Voyage</span>
                  <span className="text-xs opacity-70 line-clamp-2">Proposer mon expertise locale.</span>
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {form.role === 'agent' && (
                <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="overflow-hidden">
                  <div className="p-4 bg-ak-accent/10 border border-ak-accent/20 rounded-xl text-ak-accent/90 text-xs font-medium leading-relaxed mt-2">
                    <span className="font-bold flex items-center gap-1.5 mb-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Information importante :</span>
                    Votre compte "Agent" devra être vérifié par nos équipes avant que vous ne puissiez recevoir des demandes de réservation.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2 ml-1">Nom complet</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 group-focus-within:text-ak-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all backdrop-blur-sm`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium ml-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2 ml-1">Adresse email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 group-focus-within:text-ak-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all backdrop-blur-sm`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium ml-1">{errors.email[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 group-focus-within:text-ak-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all backdrop-blur-sm`}
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium ml-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2 ml-1">Confirmation</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 group-focus-within:text-ak-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border ${errors.password_confirmation ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all backdrop-blur-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <span className="text-xs font-bold uppercase tracking-wider text-ak-accent">Masquer</span>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider">Voir</span>
                    )}
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-red-400 text-xs mt-1.5 font-medium ml-1">{errors.password_confirmation[0]}</p>}
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
                   Création en cours...
                </span>
              ) : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-white/60 mt-4 pb-2">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-white font-bold hover:text-ak-accent transition-colors">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
