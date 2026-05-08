import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockDemandes, mockMissions } from "../mocks/agents";
import AgentLayout from "../components/AgentLayout";

const WEEKDAYS = ["LU", "MA", "ME", "JE", "VE", "SA", "DI"];
const CALENDAR = [[28,29,30,1,2,3,4],[5,6,7,8,9,10,11]];
const TODAY = 2;
const BLOCKED = [6];

export default function DashboardAgentPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, accepted: 0, views: 0 });
  const [newRequests, setNewRequests] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon apres-midi";
    return "Bonsoir";
  };

  useEffect(() => {
    // API: axios.get("/agent/stats")
    // API: axios.get("/agent/requests?status=pending&limit=3")
    // API: axios.get("/agent/missions")
    setStats({ pending: 3, accepted: 8, views: 124 });
    setNewRequests(mockDemandes.filter((d) => d.status === "pending").slice(0, 3));
    setMissions(mockMissions);
    setLoading(false);
  }, []);

  return (
    <AgentLayout>
      <main className="max-w-5xl mx-auto px-8 py-10 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Agent"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Voici un apercu de votre activite aujourd hui.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Demandes en attente", value: stats.pending,  color: "amber",   icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                { label: "Missions acceptees",  value: stats.accepted, color: "emerald", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                { label: "Vues du profil",      value: stats.views,    color: "indigo",  icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`w-10 h-10 bg-${s.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                  <p className="text-3xl font-black text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Nouvelles demandes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900">Nouvelles demandes</h2>
                <Link to="/mes-demandes" className="text-sm font-semibold text-indigo-600 hover:underline">Voir tout</Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : newRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                  <p className="text-4xl mb-3">📥</p>
                  <p className="text-gray-500 font-medium">Aucune nouvelle demande</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {newRequests.map((d) => (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                      <div className="text-2xl w-10 text-center flex-shrink-0">{d.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-gray-900 text-sm">{d.title}</p>
                          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">En attente</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{d.description}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg transition-colors">Accepter</button>
                        <button className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-lg transition-colors">Refuser</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1/3 */}
          <div className="space-y-5">
            {/* Calendrier */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Disponibilite cette semaine</h3>
              <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-400">{d}</div>
                ))}
              </div>
              {CALENDAR.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 gap-1 mb-1">
                  {row.map((date, di) => {
                    const isToday   = date === TODAY && ri === 0;
                    const isBlocked = BLOCKED.includes(date) && ri === 1;
                    const isPrev    = date > 20 && ri === 0;
                    return (
                      <button key={`${ri}-${di}`} className={`h-7 rounded-lg text-xs font-semibold transition-all ${
                        isToday   ? "bg-indigo-600 text-white"
                        : isBlocked ? "border-2 border-dashed border-gray-300 text-gray-400"
                        : isPrev  ? "text-gray-300"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}>{date}</button>
                    );
                  })}
                </div>
              ))}
              <button className="w-full mt-3 border-2 border-dashed border-gray-200 hover:border-indigo-300 text-gray-400 hover:text-indigo-500 py-2 rounded-xl text-xs font-semibold transition-all">
                + Ajouter un blocage
              </button>
            </div>

            {/* Missions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Missions en cours</h3>
              {missions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucune mission</p>
              ) : (
                <div className="space-y-3">
                  {missions.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{m.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{m.from ? `${m.from} → ${m.to}` : m.title}</p>
                        <p className="text-xs text-gray-400">Client: {m.client}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${m.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {m.status === "confirmed" ? "CONFIRME" : "EN ATTENTE"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AgentLayout>
  );
}
