import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, AlertCircle } from "lucide-react";


export default function AgentProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Post state
  const [newPostDesc, setNewPostDesc] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // Report state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Booking state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const [agentRes, reviewsRes, postsRes] = await Promise.all([
          api.get(`/agents/${id}`),
          api.get(`/agents/${id}/reviews`),
          api.get(`/posts?agent_id=${id}`)
        ]);
        setAgent(agentRes.data.data);
        setReviews(reviewsRes.data?.data || []);
        setPosts(postsRes.data?.data || []);
      } catch {
        setError("Agent introuvable ou erreur réseau.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);

  const handleBooking = async () => {
    if (!bookingDate) {
      setBookingMsg("error: Veuillez choisir un créneau.");
      return;
    }
    setBookingLoading(true);
    setBookingMsg("");
    try {
      const slot = agent.availabilities.find(a => a.id == bookingDate);
      
      await api.post("/bookings", {
        agent_profile_id: id,
        slot_start: slot.start_date,
        slot_end: slot.end_date
      });
      setBookingMsg("success: Demande de réservation envoyée !");
    } catch (err) {
      setBookingMsg("error: " + (err.response?.data?.message || "Erreur lors de la réservation."));
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason) return toast.error("Veuillez sélectionner un motif.");
    setIsSubmittingReport(true);
    try {
      await api.post("/reports", {
        reported_id: agent.user.id,
        reason: reportReason,
        details: reportDetails
      });
      toast.success("Signalement envoyé. Notre équipe va l'examiner.");
      setShowReportModal(false);
      setReportReason("");
      setReportDetails("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi du signalement.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostDesc) return;
    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append("description", newPostDesc);
      if (newPostImage) formData.append("image", newPostImage);
      
      const res = await api.post("/agent/posts", formData);
      toast.success("Exploit publié !");
      setPosts([res.data.data, ...posts]);
      setNewPostDesc("");
      setNewPostImage(null);
    } catch (err) {
      toast.error("Erreur lors de la publication.");
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) return (
    <AgentLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    </AgentLayout>
  );

  if (error || !agent) return (
    <AgentLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p className="text-white font-display font-bold text-xl">{error || "Agent introuvable"}</p>
        <Link to="/agents" className="mt-4 text-sm text-white/70 hover:text-white underline">Retour aux agents</Link>
      </div>
    </AgentLayout>
  );

  const name = agent.user?.name || "Agent";
  const bio = agent.bio || "Pas de biographie renseignée.";
  const languages = agent.languages?.map(l => l.language) || [];
  
  // Images
  const heroImage = agent.user?.cover
    ? (agent.user.cover.startsWith('http') ? agent.user.cover : `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/storage/${agent.user.cover}`)
    : `https://images.unsplash.com/photo-1542314831-c6a4d142481f?auto=format&fit=crop&q=80&w=2000`;
  const avatarId = agent.id * 7;
  const fallbackAvatar = `https://images.unsplash.com/photo-${1500000000000 + avatarId}?w=400&h=400&fit=crop&q=80`;
  const avatarImage = agent.user?.avatar 
    ? (agent.user.avatar.startsWith('http') ? agent.user.avatar : `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/storage/${agent.user.avatar}`) 
    : fallbackAvatar;

  return (
    <AgentLayout>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-8"
        >
          <Link to="/agents" className="hover:text-white transition-colors">Agents</Link>
          <span className="text-white/40">/</span>
          <span className="text-white">{name}</span>
        </motion.div>

        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-ak p-0 overflow-hidden mb-8 group"
        >
          <div className="h-48 md:h-64 bg-gray-900 relative flex items-center justify-center overflow-hidden">
            <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542314831-c6a4d142481f?auto=format&fit=crop&q=80&w=2000' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="px-6 md:px-10 pb-10 relative">
            <div className="absolute -top-16 left-6 md:left-10">
              <div className="w-32 h-32 bg-white/10 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-black/5">
                <img src={avatarImage} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80' }} />
              </div>
            </div>
            <div className="pt-20">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {Boolean(agent.user?.is_verified) && (
                  <span className="text-[10px] font-bold text-white bg-ak-accent px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Expert Vérifié
                  </span>
                )}
                {languages.map((l) => (
                  <span key={l} className="flex items-center gap-1 text-[10px] font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                    {l}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-3 tracking-tight">{name}</h1>
              <p className="text-white/70 leading-relaxed max-w-3xl text-lg">"{bio}"</p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {agent.price_per_hour && (
                  <div className="inline-flex items-center gap-2 bg-ak-accent/10 border border-ak-accent/20 px-4 py-2 rounded-xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span className="text-ak-accent font-bold text-lg">{agent.price_per_hour} € / h</span>
                  </div>
                )}
                {agent.user?.social_links?.phone && (
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <a href={`tel:${agent.user.social_links.phone}`} className="text-blue-400 font-bold text-lg hover:underline">
                      {agent.user.social_links.phone}
                    </a>
                  </div>
                )}
              </div>
              
              {/* Réseaux Sociaux */}
              {agent.user?.social_links && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {agent.user.social_links.instagram && (
                    <a href={agent.user.social_links.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-ak-accent hover:text-black transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                  )}
                  {agent.user.social_links.linkedin && (
                    <a href={agent.user.social_links.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0077b5] transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  )}
                  {agent.user.social_links.twitter && (
                    <a href={agent.user.social_links.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                  )}
                  {agent.user.social_links.facebook && (
                    <a href={agent.user.social_links.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                  )}
                  {agent.user.social_links.youtube && (
                    <a href={agent.user.social_links.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF0000] transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.16 1 12 1 12s0 3.84.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.84 23 12 23 12s0-3.84-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                    </a>
                  )}
                  {agent.user.social_links.tiktok && (
                    <a href={agent.user.social_links.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3 3v4a8 8 0 1 1-8-8v3a5 5 0 0 0 2 0z"/></svg>
                    </a>
                  )}
                  {agent.user.social_links.whatsapp && (
                    <a href={agent.user.social_links.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#25D366] transition-colors border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT 2/3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="lg:col-span-2 space-y-6 md:space-y-8"
          >
            {/* Zones */}
            <div className="card-ak p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6">Destinations d'expertise</h2>
              <div className="flex flex-wrap gap-3">
                {agent.zones?.map((z) => (
                  <span key={z.id} className="bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/20 shadow-sm hover:border-white transition-colors">{z.zone}</span>
                ))}
                {(!agent.zones || agent.zones.length === 0) && (
                  <span className="text-white/50 text-sm italic">Aucune destination renseignée.</span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="card-ak p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-display font-bold text-white">Disponibilités à venir</h2>
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">Fuseau : Paris (CET)</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {agent.availabilities?.filter(a => a.status === 'disponible').length > 0 ? (
                  agent.availabilities.filter(a => a.status === 'disponible').map(slot => (
                    <div key={slot.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px]">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Disponible</span>
                      <span className="text-sm text-emerald-400 font-bold">{new Date(slot.start_date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}</span>
                      <span className="text-xs text-white/50 my-0.5">au</span>
                      <span className="text-sm text-emerald-400 font-bold">{new Date(slot.end_date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-white/50 text-sm italic">Aucune disponibilité renseignée.</span>
                )}
              </div>
            </div>

            {/* Exploits (Social Feed) */}
            <div className="card-ak p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                Exploits & Actualités
                <span className="text-xs bg-ak-accent/20 text-ak-accent px-2.5 py-1 rounded-full border border-ak-accent/30 font-bold">{posts.length}</span>
              </h2>

              {user?.id === agent.user?.id && (
                <form onSubmit={handleCreatePost} className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <textarea
                    value={newPostDesc}
                    onChange={(e) => setNewPostDesc(e.target.value)}
                    placeholder="Partagez un exploit, une photo ou une aventure..."
                    className="w-full bg-transparent border-none text-white focus:ring-0 resize-none outline-none placeholder-white/30"
                    rows={2}
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewPostImage(e.target.files[0])}
                      className="text-xs text-white/50 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                    <button
                      type="submit"
                      disabled={isPosting || !newPostDesc}
                      className="bg-ak-accent text-black px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-50"
                    >
                      {isPosting ? "Publication..." : "Publier"}
                    </button>
                  </div>
                </form>
              )}

              {posts.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/50 text-sm">Cet agent n'a pas encore partagé d'exploits.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      {post.image_url && (
                        <div className="w-full h-64 bg-black/50">
                          <img src={`${import.meta.env.VITE_API_URL}/storage/${post.image_url}`} alt="Post image" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <p className="text-white/90 text-sm whitespace-pre-wrap">{post.description}</p>
                        
                        {post.tagged_users && post.tagged_users.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-xs text-white/40">Voyageurs tagués :</span>
                            {post.tagged_users.map(u => (
                              <span key={u.id} className="text-xs text-ak-accent bg-ak-accent/10 px-2 py-0.5 rounded-md">@{u.name}</span>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section Avis Clients */}
            <div className="card-ak p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                Avis Vérifiés
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">{reviews.length}</span>
              </h2>
              
              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/50 text-sm">Cet agent n'a pas encore reçu d'avis pour ses voyages.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                            {review.user?.avatar ? (
                              <img src={review.user.avatar.startsWith('http') ? review.user.avatar : `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/storage/${review.user.avatar}`} alt={review.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-bold">{review.user?.name?.charAt(0)}</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{review.user?.name}</p>
                            <p className="text-xs text-white/50">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-white/20"}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{review.comment}</p>
                      {review.booking_id && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/50 uppercase tracking-widest">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          Voyage confirmé
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT 1/3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact card */}
            <div className="card-ak p-6 md:p-8 sticky top-28 border-ak-accent ring-1 ring-ak-accent/20 bg-ak-accent/20">
              {user?.id === agent.user?.id ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <h3 className="font-display font-black text-xl text-white mb-2">Aperçu de votre profil</h3>
                  <p className="text-sm text-white/70">Voici ce que les voyageurs voient lorsqu'ils visitent votre page d'expert.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-display font-black text-2xl text-white mb-2">Réserver</h3>
                    <p className="text-sm text-white/70">Confiez-lui l'organisation de votre prochain voyage d'exception.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2">Créneau disponible</label>
                      <select 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-sm font-medium text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-ak-dark transition-all shadow-sm"
                      >
                        <option value="" className="bg-gray-900">Sélectionnez un créneau</option>
                        {agent.availabilities?.filter(a => a.status === 'disponible').map(slot => (
                          <option key={slot.id} value={slot.id} className="bg-gray-900">
                            Du {new Date(slot.start_date).toLocaleDateString('fr-FR')} au {new Date(slot.end_date).toLocaleDateString('fr-FR')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {bookingMsg && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm font-bold p-4 rounded-xl border flex items-center gap-3 ${bookingMsg.startsWith('error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                      >
                        {bookingMsg.startsWith('error') ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                        <span>{bookingMsg.replace(/^(success|error):\s*/, '')}</span>
                      </motion.div>
                    )}

                    <button 
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className="w-full btn-ak py-4 relative overflow-hidden"
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                           <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                           Envoi en cours...
                        </span>
                      ) : "Envoyer la demande"}
                    </button>
                    <button onClick={() => toast.success(`Demande d'appel envoyée à ${agent.user?.name}.`)} className="w-full py-4 bg-white/10 hover:bg-white/5 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-white/20 shadow-sm hover:border-white/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Appel découverte
                    </button>
                  </div>
                </>
              )}

              <div className="border-t border-white/20/50 mt-8 pt-6">
                <div className="flex justify-center gap-8 text-white/50">
                  <button onClick={() => window.location.href = `mailto:${agent.user?.email}`} className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                    <div className="p-3 bg-white/10 rounded-xl shadow-sm border border-white/10 group-hover:border-white/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                  </button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Lien copié !");
                  }} className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                    <div className="p-3 bg-white/10 rounded-xl shadow-sm border border-white/10 group-hover:border-white/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Partager</span>
                  </button>
                  
                  {user && (
                    <button onClick={() => setShowReportModal(true)} className="flex flex-col items-center gap-2 hover:text-red-400 text-red-500/70 transition-colors group">
                      <div className="p-3 bg-red-500/10 rounded-xl shadow-sm border border-red-500/20 group-hover:border-red-500/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Signaler</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Modale de signalement */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0a192f] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Signaler ce profil
              </h2>
              <p className="text-white/60 text-sm mb-6">Aidez-nous à maintenir la sécurité sur Atlas. Ce signalement est confidentiel.</p>
              
              <form onSubmit={handleReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Motif du signalement *</label>
                  <select 
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ak-accent"
                    required
                  >
                    <option value="" disabled className="bg-[#0a192f]">Sélectionnez un motif</option>
                    <option value="Comportement inapproprié" className="bg-[#0a192f]">Comportement inapproprié</option>
                    <option value="Faux profil / Arnaque" className="bg-[#0a192f]">Faux profil / Arnaque</option>
                    <option value="Demande d'argent hors plateforme" className="bg-[#0a192f]">Demande d'argent hors plateforme</option>
                    <option value="Autre" className="bg-[#0a192f]">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Détails supplémentaires</label>
                  <textarea
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Pouvez-vous nous en dire plus ?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white min-h-[100px] focus:outline-none focus:border-ak-accent"
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-white hover:bg-white/5 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingReport}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReport ? "Envoi..." : "Envoyer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AgentLayout>
  );
}
