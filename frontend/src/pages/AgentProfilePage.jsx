import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";

const DAYS = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
const AVAILABILITY = [true, true, true, false, true, false, false];

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const [agentRes, reviewsRes] = await Promise.all([
          api.get(`/agents/${id}`),
          api.get(`/agents/${id}/reviews`)
        ]);
        setAgent(agentRes.data.data);
        setReviews(reviewsRes.data?.data || []);
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
      setBookingMsg("Veuillez choisir une date de début.");
      return;
    }
    setBookingLoading(true);
    setBookingMsg("");
    try {
      // Pour la démo, slot_end est le jour suivant
      const slotStart = new Date(bookingDate);
      const slotEnd = new Date(slotStart);
      slotEnd.setDate(slotEnd.getDate() + 1);
      
      await api.post("/bookings", {
        agent_id: id,
        slot_start: slotStart.toISOString().slice(0, 19).replace("T", " "),
        slot_end: slotEnd.toISOString().slice(0, 19).replace("T", " ")
      });
      setBookingMsg("✅ Demande de réservation envoyée !");
    } catch {
      setBookingMsg("❌ Erreur lors de la réservation.");
    } finally {
      setBookingLoading(false);
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
  
  // Mock images
  const heroImage = `https://images.unsplash.com/photo-1542314831-c6a4d142481f?auto=format&fit=crop&q=80&w=2000`;
  const avatarId = agent.id * 7;
  const avatarImage = `https://images.unsplash.com/photo-${1500000000000 + avatarId}?w=400&h=400&fit=crop&q=80`;

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
            <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700" />
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
                {agent.user?.is_verified && (
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
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
                <h2 className="text-xl font-display font-bold text-white">Disponibilité type</h2>
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">Fuseau : Paris (CET)</span>
              </div>
              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-3">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{day}</span>
                    <div className={`w-full h-12 md:h-14 rounded-xl flex items-center justify-center border transition-colors ${AVAILABILITY[i] ? "bg-emerald-50 border-emerald-100" : "bg-white/5 border-white/10"}`}>
                      <span className={`w-2 h-2 rounded-full ${AVAILABILITY[i] ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-300"}`} />
                    </div>
                  </div>
                ))}
              </div>
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
                              <img src={`http://localhost:8000/storage/${review.user.avatar}`} alt={review.user.name} className="w-full h-full object-cover" />
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact card */}
            <div className="card-ak p-6 md:p-8 sticky top-28 border-ak-accent ring-1 ring-ak-accent/20 bg-ak-accent/20">
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl text-white mb-2">Réserver</h3>
                <p className="text-sm text-white/70">Confiez-lui l'organisation de votre prochain voyage d'exception.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2">Date souhaitée</label>
                  <input 
                    type="datetime-local" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-white focus:ring-1 focus:ring-ak-dark transition-all shadow-sm"
                  />
                </div>
                
                {bookingMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-bold p-4 rounded-xl border ${bookingMsg.includes('❌') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                  >
                    {bookingMsg}
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
                <button className="w-full py-4 bg-white/10 hover:bg-white/5 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-white/20 shadow-sm hover:border-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Appel découverte
                </button>
              </div>

              <div className="border-t border-white/20/50 mt-8 pt-6">
                <div className="flex justify-center gap-8 text-white/50">
                  {[
                    { label: "Email", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
                    { label: "Partager", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                  ].map(({ label, icon }) => (
                    <button key={label} className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                      <div className="p-3 bg-white/10 rounded-xl shadow-sm border border-white/10 group-hover:border-white/20 transition-colors">
                        {icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AgentLayout>
  );
}
