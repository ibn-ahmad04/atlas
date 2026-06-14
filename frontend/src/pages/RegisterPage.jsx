import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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
      await register(form);
      navigate("/login", { state: { message: "Inscription réussie. Veuillez vous connecter." } });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ global: "Une erreur est survenue lors de l'inscription." });
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
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200" 
          alt="Adventure travel destination" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 text-white max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-black mb-4 leading-tight tracking-tight"
          >
            Votre Prochaine Aventure Commence Ici.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg"
          >
            Rejoignez une communauté de voyageurs exigeants et de guides passionnés.
          </motion.p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-20 overflow-y-auto max-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md card-ak p-10 my-auto"
        >
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-ak-accent/20 rounded-2xl flex items-center justify-center text-ak-accent mx-auto mb-6 border border-ak-accent/30 shadow-[0_0_15px_rgba(255,150,102,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.2 0-2 .8-2 2v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <h1 className="font-display text-3xl font-black text-white mb-2 tracking-tight">Rejoindre Atlas</h1>
            <p className="text-white/60">Création de compte sécurisée</p>
          </div>

          {errors.global && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">{errors.global}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 mb-2 p-1 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "voyageur" })}
                className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${
                  form.role === "voyageur" 
                    ? "bg-white text-gray-900 shadow-md" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Voyageur
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "agent" })}
                className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${
                  form.role === "agent" 
                    ? "bg-white text-gray-900 shadow-md" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Devenir Agent
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Nom complet</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-colors backdrop-blur-sm`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Adresse email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-colors backdrop-blur-sm`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-colors backdrop-blur-sm`}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Confirmation</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 pr-12 py-3 bg-white/5 border ${errors.password_confirmation ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-colors backdrop-blur-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">{showPassword ? "Masquer" : "Voir"}</span>
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password_confirmation[0]}</p>}
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
                   Création...
                </span>
              ) : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-white/60 mt-8">
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
