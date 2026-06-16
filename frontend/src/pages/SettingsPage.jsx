import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    bio: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    whatsapp: "",
    languages: "", // comma-separated string
    zones: [], // array of selected destination names
    price_per_hour: "",
  });

  const [destinations, setDestinations] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Fetch destinations
    api.get("/destinations").then(res => {
      setDestinations(res.data?.data || []);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ 
        ...prev, 
        name: user.name, 
        email: user.email,
        bio: user.bio || "",
        instagram: user.social_links?.instagram || "",
        linkedin: user.social_links?.linkedin || "",
        twitter: user.social_links?.twitter || "",
        facebook: user.social_links?.facebook || "",
        youtube: user.social_links?.youtube || "",
        tiktok: user.social_links?.tiktok || "",
        whatsapp: user.social_links?.whatsapp || "",
        phone: user.social_links?.phone || "",
        languages: user.agent_profile?.languages?.map(l => l.language).join(", ") || "",
        zones: user.agent_profile?.zones?.map(z => z.zone) || [],
        price_per_hour: user.agent_profile?.price_per_hour || "",
      }));
      if (user.avatar) {
        setAvatarPreview(`http://localhost:8000/storage/${user.avatar}`);
      }
      if (user.cover) {
        setCoverPreview(`http://localhost:8000/storage/${user.cover}`);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "zones") {
      let updatedZones = [...formData.zones];
      if (checked) {
        updatedZones.push(value);
      } else {
        updatedZones = updatedZones.filter(z => z !== value);
      }
      setFormData({ ...formData, zones: updatedZones });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    // Upload instantly
    const formDataObj = new FormData();
    formDataObj.append("avatar", file);

    try {
      setLoading(true);
      await api.post("/auth/profile/avatar", formDataObj);
      await updateUser();
      setSuccessMsg("Photo de profil mise à jour.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Erreur avatar:", err.response?.data);
      setErrorMsg(err.response?.data?.message || "Erreur lors de l'upload de l'image.");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);

    // Upload instantly
    const formDataObj = new FormData();
    formDataObj.append("cover", file);

    try {
      setLoading(true);
      await api.post("/auth/profile/cover", formDataObj);
      await updateUser();
      setSuccessMsg("Photo de couverture mise à jour.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Erreur cover:", err.response?.data);
      setErrorMsg(err.response?.data?.message || "Erreur lors de l'upload de l'image.");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const payload = { 
      name: formData.name, 
      email: formData.email,
      bio: formData.bio,
      social_links: {
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        facebook: formData.facebook,
        youtube: formData.youtube,
        tiktok: formData.tiktok,
        whatsapp: formData.whatsapp,
        phone: formData.phone,
      }
    };
    if (formData.password) {
      payload.password = formData.password;
      payload.password_confirmation = formData.password_confirmation;
    }

    try {
      await api.post("/auth/profile/info", payload);
      
      if (user.role === 'agent') {
        const agentPayload = {
          languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
          zones: formData.zones,
          price_per_hour: formData.price_per_hour ? parseFloat(formData.price_per_hour) : null
        };
        await api.put("/agents/profile", agentPayload);
      }

      await updateUser();
      setSuccessMsg("Informations mises à jour avec succès !");
      setFormData((prev) => ({ ...prev, password: "", password_confirmation: "" }));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentLayout>
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="card-ak p-8 relative overflow-hidden"
        >
          {/* Decorative glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ak-accent/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3" />
          
          <h1 className="text-3xl font-display font-bold text-white mb-8 tracking-tight">Espace Personnel</h1>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-white/20 shadow-lg group-hover:border-ak-accent transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-white/40 bg-ak-dark">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="mt-4 text-sm text-white/50">Modifier l'avatar</p>
            </div>

            {/* Cover */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden bg-white/5 border-2 border-white/20 shadow-lg group-hover:border-ak-accent transition-colors" onClick={handleCoverClick}>
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover opacity-80" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542314831-c6a4d142481f?auto=format&fit=crop&q=80&w=2000' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 bg-ak-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold tracking-wider">MODIFIER LA COUVERTURE</span>
                </div>
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </div>
              <p className="mt-4 text-sm text-white/50">Modifier la photo de couverture</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Biographie</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Parlez-nous un peu de vous..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all resize-none"
                />
              </div>

              {user?.role === 'agent' && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">Expertise et Langues</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Langues parlées</label>
                        <input
                          type="text"
                          name="languages"
                          value={formData.languages}
                          onChange={handleInputChange}
                          placeholder="Ex: Français, Anglais, Arabe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                        />
                        <p className="text-xs text-white/50 mt-2">Séparez les langues par des virgules.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Tarif horaire (€ / h)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="price_per_hour"
                          value={formData.price_per_hour}
                          onChange={handleInputChange}
                          placeholder="Ex: 50"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">Destinations couvertes (Zones)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {destinations.map(dest => (
                          <label key={dest.id} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                            <input
                              type="checkbox"
                              name="zones"
                              value={dest.name}
                              checked={formData.zones.includes(dest.name)}
                              onChange={handleInputChange}
                              className="w-4 h-4 rounded border-white/20 bg-white/5 text-ak-accent focus:ring-ak-accent focus:ring-offset-0"
                            />
                            {dest.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Réseaux Sociaux</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="URL ou @"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">LinkedIn</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="URL de votre profil"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Twitter / X</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="URL ou @"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      placeholder="URL de votre page ou profil"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">YouTube</label>
                    <input
                      type="text"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      placeholder="URL de votre chaîne"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">TikTok</label>
                    <input
                      type="text"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleInputChange}
                      placeholder="URL ou @"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">WhatsApp</label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Numéro ou lien wa.me"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Numéro de Téléphone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Votre numéro de téléphone public"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Modifier le mot de passe</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Laissez vide pour ne pas modifier"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-ak w-full sm:w-auto flex justify-center"
              >
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>

          {/* Section Certification pour Agent */}
          {user?.role === 'agent' && (
            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-xl font-display font-bold text-white mb-2">Certification Atlas</h3>
              <p className="text-sm text-white/60 mb-6">Obtenez le badge vérifié pour rassurer vos clients et augmenter vos réservations. Une rencontre (visio ou présentiel) sera fixée.</p>
              
              {user?.is_verified ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="font-bold">Vous êtes un guide certifié Atlas.</span>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    if (window.confirm("Demander un rendez-vous de certification ?")) {
                      try {
                        const res = await api.post("/auth/agents/verify");
                        alert(res.data.message);
                      } catch (e) {
                        alert(e.response?.data?.message || "Erreur lors de la demande");
                      }
                    }
                  }}
                  className="btn-ak-outline border-ak-accent text-ak-accent hover:bg-ak-accent/10"
                >
                  Demander une vérification de profil
                </button>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AgentLayout>
  );
}
