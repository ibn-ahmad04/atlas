import { useState } from "react";
import { Link } from "react-router-dom";
import { mockDemandes } from "../mocks/agents";
import AgentLayout from "../components/AgentLayout";

const TABS = [
  { key: "all",      label: "Toutes" },
  { key: "pending",  label: "En attente", count: 3 },
  { key: "accepted", label: "Acceptees" },
  { key: "refused",  label: "Refusees" },
];

const STATUS = {
  pending:  { bg: "bg-amber-100 text-amber-700",    dot: "bg-amber-500",   label: "En attente" },
  accepted: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "Acceptee" },
  refused:  { bg: "bg-red-100 text-red-600",         dot: "bg-red-500",     label: "Refusee" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function DemandeCard({ d, onAccept, onRefuse }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
      <div className="text-2xl w-10 text-center flex-shrink-0 mt-0.5">{d.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <span className="text-xs text-gray-400 font-mono">REF: {d.id}</span>
            <h3 className="font-bold text-gray-900 text-base">{d.title}</h3>
          </div>
          <StatusBadge status={d.status} />
        </div>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">{d.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          {d.dateStart && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {d.dateStart} → {d.dateEnd}
            </span>
          )}
          {d.travelers && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {d.travelers} voyageurs
            </span>
          )}
          {d.price && (
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              {d.price}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {d.status === "pending" && (
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onAccept(d.id)}
            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Accepter
          </button>
          <button
            onClick={() => onRefuse(d.id)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-xl transition-colors"
          >
            Refuser
          </button>
        </div>
      )}
      {d.status === "accepted" && (
        <Link to={`/mes-demandes/${d.id}`} className="flex-shrink-0 text-xs font-semibold text-indigo-600 hover:underline mt-1">
          Voir details →
        </Link>
      )}
      {d.status === "refused" && (
        <span className="flex-shrink-0 text-xs text-gray-300 mt-1">Termine</span>
      )}
    </div>
  );
}

export default function MesDemandesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [demandes, setDemandes] = useState(mockDemandes);
  // API: axios.get("/agent/requests")

  const handleAccept = (id) => {
    setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, status: "accepted" } : d));
    // API: axios.patch(`/agent/requests/${id}`, { status: "accepted" })
  };

  const handleRefuse = (id) => {
    setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, status: "refused" } : d));
    // API: axios.patch(`/agent/requests/${id}`, { status: "refused" })
  };

  const filtered = activeTab === "all"
    ? demandes
    : demandes.filter((d) => d.status === activeTab);

  const pendingCount = demandes.filter((d) => d.status === "pending").length;

  return (
    <AgentLayout>
      <main className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Mes demandes</h1>
          <p className="text-gray-500">Gerez les demandes de voyage envoyees par vos clients.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {TABS.map((tab) => {
            const count = tab.key === "pending" ? pendingCount : null;
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
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 font-medium text-lg">Aucune demande dans cette categorie</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => (
              <DemandeCard key={d.id} d={d} onAccept={handleAccept} onRefuse={handleRefuse} />
            ))}
          </div>
        )}
      </main>
    </AgentLayout>
  );
}
