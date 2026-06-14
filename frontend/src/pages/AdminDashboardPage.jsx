import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending"); // pending, users, stats
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPendingAgents = async () => {
    try {
      const res = await api.get("/admin/agents-pending");
      setAgents(res.data.data);
    } catch {
      toast.error("Erreur lors du chargement des agents en attente.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch {
      toast.error("Erreur lors du chargement des utilisateurs.");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.data);
    } catch {
      toast.error("Erreur lors du chargement des statistiques.");
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === "pending") fetchPendingAgents().finally(() => setLoading(false));
    if (activeTab === "users") fetchUsers().finally(() => setLoading(false));
    if (activeTab === "stats") fetchStats().finally(() => setLoading(false));
  }, [activeTab]);

  const handleValidate = async (id) => {
    try {
      await api.patch(`/admin/agents/${id}/validate`);
      toast.success("Agent validé avec succès !");
      fetchPendingAgents();
    } catch {
      toast.error("Erreur lors de la validation.");
    }
  };

  const handleRefuse = async (id) => {
    if (!window.confirm("Voulez-vous vraiment refuser cet agent ?")) return;
    try {
      await api.patch(`/admin/agents/${id}/refuse`);
      toast.success("Agent refusé.");
      fetchPendingAgents();
    } catch {
      toast.error("Erreur lors du refus.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AgentLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-16 pt-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-black text-atlas-navy-900 tracking-tight">
            Administration
          </h1>
          <p className="text-atlas-navy-900/60 mt-2">
            Bonjour {user?.name}, gérez la plateforme et validez les agents.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-atlas-stone-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "pending" ? "text-atlas-navy-900" : "text-atlas-navy-900/40 hover:text-atlas-navy-900/70"
            }`}
          >
            Agents en attente
            {activeTab === "pending" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-atlas-gold" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "users" ? "text-atlas-navy-900" : "text-atlas-navy-900/40 hover:text-atlas-navy-900/70"
            }`}
          >
            Utilisateurs
            {activeTab === "users" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-atlas-gold" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "stats" ? "text-atlas-navy-900" : "text-atlas-navy-900/40 hover:text-atlas-navy-900/70"
            }`}
          >
            Statistiques
            {activeTab === "stats" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-atlas-gold" />
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-atlas-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            
            {/* PENDING AGENTS */}
            {activeTab === "pending" && (
              <div className="space-y-4">
                {agents.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-atlas-stone-200 rounded-2xl shadow-sm">
                    <p className="text-atlas-navy-900/50">Aucun agent en attente de validation.</p>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <motion.div key={agent.id} variants={itemVariants} className="bg-white p-6 rounded-2xl border border-atlas-stone-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center rounded-full text-lg">
                          {agent.user?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                          <h3 className="font-bold text-atlas-navy-900 text-lg">{agent.user?.name}</h3>
                          <p className="text-sm text-atlas-navy-900/60">{agent.user?.email}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="text-xs px-2 py-1 bg-atlas-stone-100 text-atlas-navy-900 rounded-md">Type: {agent.type || "Non défini"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleRefuse(agent.id)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Refuser</button>
                        <button onClick={() => handleValidate(agent.id)} className="px-4 py-2 text-sm font-medium text-white bg-atlas-gold hover:bg-yellow-500 rounded-lg transition-colors shadow-sm">Valider le profil</button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <div className="bg-white rounded-2xl border border-atlas-stone-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-atlas-stone-50 text-atlas-navy-900/60 font-medium">
                    <tr>
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Rôle</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Inscrit le</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-atlas-stone-100">
                    {users.map(u => (
                      <motion.tr variants={itemVariants} key={u.id} className="hover:bg-atlas-stone-50/50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-atlas-navy-900">{u.name}</p>
                          <p className="text-xs text-atlas-navy-900/50">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.role === 'agent' && u.agent_profile ? (
                            <span className={`text-xs ${u.agent_profile.status === 'valide' ? 'text-green-600' : u.agent_profile.status === 'en_attente' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {u.agent_profile.status}
                            </span>
                          ) : (
                            <span className="text-xs text-atlas-navy-900/40">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-atlas-navy-900/60">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* STATS */}
            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-atlas-stone-200 shadow-sm">
                  <p className="text-sm font-medium text-atlas-navy-900/50 uppercase tracking-widest">Total Utilisateurs</p>
                  <p className="text-5xl font-black text-atlas-navy-900 mt-4">{stats.total_users}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-atlas-stone-200 shadow-sm">
                  <p className="text-sm font-medium text-atlas-navy-900/50 uppercase tracking-widest">Agents en Attente</p>
                  <p className="text-5xl font-black text-atlas-gold mt-4">{stats.pending_agents}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-atlas-stone-200 shadow-sm">
                  <p className="text-sm font-medium text-atlas-navy-900/50 uppercase tracking-widest">Réservations Aujourd'hui</p>
                  <p className="text-5xl font-black text-green-500 mt-4">{stats.today_bookings}</p>
                </motion.div>
              </div>
            )}
            
          </motion.div>
        )}
      </div>
    </AgentLayout>
  );
}
