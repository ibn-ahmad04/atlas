import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";

const TABS = [
  { key: "all",      label: "Toutes" },
  { key: "en_attente",  label: "En attente" },
  { key: "acceptee", label: "Acceptées" },
  { key: "refusee",  label: "Refusées" },
];

const STATUS = {
  en_attente:  { bg: "bg-amber-100 text-amber-700",    dot: "bg-amber-500",   label: "En attente" },
  acceptee: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "Acceptée" },
  refusee:  { bg: "bg-red-100 text-red-600",         dot: "bg-red-500",     label: "Refusée" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.en_attente;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function DemandeCard({ d, role, onUpdateStatus }) {
  // If role === "agent", the other party is d.traveler.name.
  // If role === "voyageur", the other party is d.agent_profile.user.name.
  const otherPartyName = role === "agent" 
    ? (d.traveler?.name || "Voyageur inconnu")
    : (d.agent_profile?.user?.name || "Agent inconnu");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
      <div className="text-2xl w-10 text-center flex-shrink-0 mt-0.5">🗓️</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <span className="text-xs text-gray-400 font-mono">REF: #{d.id}</span>
            <h3 className="font-bold text-gray-900 text-base">Réservation avec {otherPartyName}</h3>
          </div>
          <StatusBadge status={d.status} />
        </div>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
          Statut actuel de la demande : {d.status}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {d.slot_start} → {d.slot_end}
          </span>
        </div>
      </div>

      {/* Actions (Agent uniquement) */}
      {role === "agent" && d.status === "en_attente" && (
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onUpdateStatus(d.id, "acceptee")}
            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Accepter
          </button>
          <button
            onClick={() => onUpdateStatus(d.id, "refusee")}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-xl transition-colors"
          >
            Refuser
          </button>
        </div>
      )}
    </div>
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
        // Similar to agents, paginate returns an object
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
      <main className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Historique des demandes</h1>
          <p className="text-gray-500">
            {user?.role === "agent" 
              ? "Gérez les demandes de voyage envoyées par vos clients."
              : "Suivez l'état de vos demandes auprès des agents."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {TABS.map((tab) => {
            const count = tab.key === "en_attente" ? pendingCount : null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-20">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 font-medium text-lg">Aucune demande dans cette catégorie</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => (
              <DemandeCard key={d.id} d={d} role={user?.role} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        )}
      </main>
    </AgentLayout>
  );
}
