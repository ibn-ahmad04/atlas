import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { key: "all",      label: "Toutes" },
  { key: "en_attente",  label: "En attente" },
  { key: "acceptee", label: "Acceptées" },
  { key: "refusee",  label: "Refusées" },
];

const STATUS = {
  en_attente:  { bg: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500", label: "En attente" },
  acceptee: { bg: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-500", label: "Acceptée" },
  refusee:  { bg: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500", label: "Refusée" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.en_attente;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${s.bg} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'en_attente' ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}

function DemandeCard({ d, role, onUpdateStatus, index }) {
  const otherPartyName = role === "agent" 
    ? (d.traveler?.name || "Voyageur")
    : (d.agent_profile?.user?.name || "Agent");

  // Mock avatar
  const avatarId = d.id * 7;
  const avatarUrl = `https://images.unsplash.com/photo-${1500000000000 + avatarId}?w=100&h=100&fit=crop&q=80`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
      className="card-ak p-4 flex flex-col md:flex-row md:items-center gap-4 group hover:border-white/30"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0 shadow-sm border border-ak-border">
           <img src={avatarUrl} alt={otherPartyName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-white truncate">{otherPartyName}</h3>
            <span className="text-[10px] text-white/50 font-mono bg-white/10 px-1.5 py-0.5 rounded">#{d.id}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-white/70">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {d.slot_start.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
        <StatusBadge status={d.status} />

        {role === "agent" && d.status === "en_attente" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus(d.id, "acceptee")}
              className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Accepter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button
              onClick={() => onUpdateStatus(d.id, "refusee")}
              className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Refuser"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MesDemandesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await api.get("/bookings");
        const items = response.data?.data?.data || [];
        setDemandes(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Erreur chargement bookings", err);
        setDemandes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const endpoint = newStatus === "acceptee" ? "accept" : "refuse";
      await api.patch(`/bookings/${id}/${endpoint}`);
      setDemandes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
    } catch (err) {
      console.error("Erreur mise à jour statut", err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const filtered = activeTab === "all"
    ? demandes
    : demandes.filter((d) => d.status === activeTab);

  const pendingCount = demandes.filter((d) => d.status === "en_attente").length;

  return (
    <AgentLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2 tracking-tight">Historique des demandes</h1>
          <p className="text-white/70 text-sm">
            {user?.role === "agent" 
              ? "Gérez les demandes de réservation et organisez votre emploi du temps."
              : "Suivez l'état de vos demandes de réservation auprès des agents."}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => {
            const count = tab.key === "en_attente" ? pendingCount : null;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="demandes-tab"
                    className="absolute inset-0 bg-ak-dark rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {count > 0 && (
                  <span className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-ak-dark text-white'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center flex flex-col items-center border border-dashed border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm"
          >
            <div className="w-16 h-16 bg-white/10 text-white/50 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </div>
            <p className="font-display text-lg font-bold text-white mb-1">Aucune demande</p>
            <p className="text-white/70 text-sm">Votre boîte de réception est vide pour cette catégorie.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((d, index) => (
                <DemandeCard key={d.id} d={d} role={user?.role} onUpdateStatus={handleUpdateStatus} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
