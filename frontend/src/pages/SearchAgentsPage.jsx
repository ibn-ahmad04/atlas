import { useState } from "react";
import { Link } from "react-router-dom";
import { mockAgents } from "../mocks/agents";
import AgentLayout from "../components/AgentLayout";

const BADGE_COLORS = {
  "ULTRA LUXE":  "bg-indigo-100 text-indigo-700",
  "TOP RATED":   "bg-amber-100 text-amber-700",
  "AVENTURE":    "bg-red-600 text-white",
  "CULTURE & ART":"bg-purple-100 text-purple-700",
  "PREMIUM":     "bg-pink-100 text-pink-700",
};

const GRADIENTS = [
  "from-indigo-200 via-purple-100 to-indigo-300",
  "from-indigo-600 via-purple-600 to-indigo-800",
  "from-rose-100 via-pink-100 to-purple-200",
];

function AgentCard({ agent, index }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`relative h-40 bg-gradient-to-br ${GRADIENTS[index % 3]} flex items-center justify-center`}>
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {agent.badges.map((b) => (
            <span key={b} className={`text-xs font-bold px-2 py-0.5 rounded-full ${BADGE_COLORS[b] || "bg-gray-100 text-gray-600"}`}>{b}</span>
          ))}
        </div>
        <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div className="absolute bottom-3 right-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-xs font-bold text-gray-800">{agent.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-0.5">{agent.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{agent.specialty}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {agent.zones.map((z) => (
            <span key={z} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{z}</span>
          ))}
          {agent.extraZones > 0 && (
            <span className="text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-semibold">+{agent.extraZones}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          {agent.available
            ? <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Disponible</span>
            : agent.reviews
              ? <span className="text-xs text-gray-400">{agent.reviews}</span>
              : <span />
          }
          <Link to={`/agents/${agent.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
            Voir le profil
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SearchAgentsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ expertise: "", disponibilite: "", langues: "" });
  const [agents] = useState(mockAgents);
  // API: axios.get("/agents", { params: { search, ...filters } })

  const filtered = agents.filter((a) =>
    search === "" ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AgentLayout>
      <main className="max-w-5xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Autres agents</h1>
          <p className="text-gray-500">Consultez les profils de vos collegues agents sur la plateforme.</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un agent..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* Filters */}
          {[
            { key: "expertise",    label: "Expertise",     opts: ["Toutes les destinations", "Luxe & Conciergerie", "Aventure", "Culture & Art"] },
            { key: "disponibilite",label: "Disponibilite", opts: ["Immediate", "Cette semaine", "Ce mois"] },
            { key: "langues",      label: "Langues",       opts: ["Francais & Anglais", "Arabe", "Espagnol", "Mandarin"] },
          ].map((f) => (
            <div key={f.key} className="relative min-w-36">
              <select
                value={filters[f.key]}
                onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">{f.label}</option>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Resultats */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg font-medium">Aucun agent trouve</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{filtered.length} agent{filtered.length > 1 ? "s" : ""} trouve{filtered.length > 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </AgentLayout>
  );
}
