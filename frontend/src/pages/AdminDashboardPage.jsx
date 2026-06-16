import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending"); // pending, users, reports, stats
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
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

  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data.data);
    } catch {
      toast.error("Erreur lors du chargement des signalements.");
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
    if (activeTab === "reports") fetchReports().finally(() => setLoading(false));
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

  const handleRefuseAgent = async (id) => {
    if (!window.confirm("Voulez-vous vraiment refuser cet agent ?")) return;
    try {
      await api.patch(`/admin/agents/${id}/refuse`);
      toast.success("Agent refusé.");
      fetchPendingAgents();
    } catch {
      toast.error("Erreur lors du refus.");
    }
  };

  const handleBanUser = async (id) => {
    if (!window.confirm("BANNISSEMENT : Voulez-vous vraiment supprimer définitivement cet utilisateur ?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Utilisateur banni et supprimé.");
      if (activeTab === "users") fetchUsers();
      if (activeTab === "reports") fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du bannissement.");
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
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="text-white/60 mt-2">
            Gérez les utilisateurs, les certifications et les signalements.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "pending" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Certifications en attente
            {activeTab === "pending" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ak-accent" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "users" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Utilisateurs & Sanctions
            {activeTab === "users" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ak-accent" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "reports" ? "text-red-500" : "text-white/40 hover:text-red-500/70"
            }`}
          >
            Signalements
            {activeTab === "reports" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "stats" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Statistiques
            {activeTab === "stats" && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ak-accent" />
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-ak-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            
            {/* PENDING AGENTS */}
            {activeTab === "pending" && (
              <div className="space-y-4">
                {agents.length === 0 ? (
                  <div className="text-center py-20 card-ak shadow-sm">
                    <p className="text-white/50">Aucun agent en attente de validation.</p>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <motion.div key={agent.id} variants={itemVariants} className="card-ak p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 text-white font-bold flex items-center justify-center rounded-full text-lg border border-white/20">
                          {agent.user?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{agent.user?.name}</h3>
                          <p className="text-sm text-white/60">{agent.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleRefuseAgent(agent.id)} className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors">Refuser</button>
                        <button onClick={() => handleValidate(agent.id)} className="px-4 py-2 text-sm font-medium text-gray-900 bg-ak-accent hover:bg-white rounded-lg transition-colors shadow-sm">Valider le profil</button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* USERS & SANCTIONS */}
            {activeTab === "users" && (
              <div className="card-ak overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/60 font-medium border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Rôle</th>
                      <th className="px-6 py-4">Signalements (Reçus)</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <motion.tr variants={itemVariants} key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-xs text-white/50">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : u.role === 'agent' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.reports_received?.length > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              {u.reports_received.length} Signalement(s)
                            </span>
                          ) : (
                            <span className="text-xs text-white/40">Aucun</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.role !== 'admin' && (
                            <button onClick={() => handleBanUser(u.id)} className="text-xs font-bold text-red-400 hover:text-white px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 rounded-md transition-colors">
                              Bannir / Supprimer
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* REPORTS */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-20 card-ak shadow-sm">
                    <p className="text-white/50">Aucun signalement n'a été fait pour le moment.</p>
                  </div>
                ) : (
                  reports.map(report => (
                    <motion.div key={report.id} variants={itemVariants} className="card-ak p-6 border-l-4 border-l-red-500 flex flex-col md:flex-row items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-2 py-1 rounded">Signalement #{report.id}</span>
                          <span className="text-xs text-white/50">{new Date(report.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-white">
                          <span className="font-bold">{report.reporter?.name}</span> a signalé <span className="font-bold text-red-400">{report.reported?.name}</span>
                        </p>
                        <p className="mt-2 text-white font-medium">Motif : {report.reason}</p>
                        {report.details && (
                          <p className="mt-1 text-sm text-white/70 p-3 bg-white/5 rounded-lg italic">"{report.details}"</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleBanUser(report.reported_id)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm">
                          Bannir l'accusé
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* STATS */}
            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="card-ak p-6">
                  <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Total Utilisateurs</p>
                  <p className="text-5xl font-black text-white mt-4">{stats.total_users}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="card-ak p-6">
                  <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Agents en Attente</p>
                  <p className="text-5xl font-black text-ak-accent mt-4">{stats.pending_agents}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="card-ak p-6">
                  <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Réservations Aujourd'hui</p>
                  <p className="text-5xl font-black text-emerald-400 mt-4">{stats.today_bookings}</p>
                </motion.div>
              </div>
            )}
            
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
