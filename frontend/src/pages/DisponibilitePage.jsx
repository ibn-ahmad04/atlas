import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";

export default function DisponibilitePage() {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailStart, setNewAvailStart] = useState("");
  const [newAvailEnd, setNewAvailEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user && user.role === 'agent' && user.agent_profile?.id) {
      api.get(`/agents/${user.agent_profile.id}/availabilities`).then(res => {
        setAvailabilities(res.data?.data || []);
      }).catch(err => console.error(err));
    }
  }, [user]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    if (!newAvailStart || !newAvailEnd) return;
    try {
      setLoading(true);
      const res = await api.post("/availabilities", {
        start_date: newAvailStart,
        end_date: newAvailEnd
      });
      setAvailabilities([...availabilities, res.data.data]);
      setNewAvailStart("");
      setNewAvailEnd("");
      setSuccessMsg("Créneau de disponibilité ajouté !");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch(err) {
      setErrorMsg(err.response?.data?.message || "Erreur lors de l'ajout du créneau.");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce créneau ?")) return;
    try {
      setLoading(true);
      await api.delete(`/availabilities/${id}`);
      setAvailabilities(availabilities.filter(a => a.id !== id));
      setSuccessMsg("Créneau supprimé !");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch(err) {
      setErrorMsg(err.response?.data?.message || "Erreur lors de la suppression.");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentLayout>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2 tracking-tight">Mon Planning</h1>
          <p className="text-white/70 text-sm max-w-xl">
            Gérez vos créneaux de disponibilité. Les voyageurs ne pourront réserver que sur les dates que vous ajoutez ici.
          </p>
        </motion.div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liste des créneaux */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 card-ak p-6 md:p-8"
          >
            <h2 className="text-xl font-display font-bold text-white mb-6">Vos créneaux de disponibilité</h2>
            <div className="space-y-4">
              {availabilities.length > 0 ? (
                availabilities.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-sm text-emerald-400 font-bold mb-0.5">
                        Du {new Date(slot.start_date).toLocaleDateString('fr-FR')} au {new Date(slot.end_date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-white/50 uppercase tracking-widest">{slot.status}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAvailability(slot.id)}
                      className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded-lg transition-colors"
                      title="Supprimer ce créneau"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/20 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <p className="text-sm text-white/50">Aucun créneau renseigné.</p>
                  <p className="text-xs text-white/40 mt-1">Les voyageurs ne pourront pas réserver de voyage avec vous.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Ajouter un créneau */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-ak p-6 md:p-8 flex flex-col h-fit relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-ak-accent/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <h3 className="font-display font-bold text-white mb-6">Ajouter une disponibilité</h3>
            <form onSubmit={handleAddAvailability} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Date de début</label>
                <input
                  type="date"
                  required
                  value={newAvailStart}
                  onChange={(e) => setNewAvailStart(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Date de fin</label>
                <input
                  type="date"
                  required
                  value={newAvailEnd}
                  onChange={(e) => setNewAvailEnd(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ak-accent focus:ring-1 focus:ring-ak-accent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !newAvailStart || !newAvailEnd}
                className="w-full py-3 bg-ak-accent text-black font-bold text-sm rounded-xl mt-4 disabled:opacity-50 hover:bg-ak-accent/90 transition-colors shadow-lg shadow-ak-accent/20"
              >
                {loading ? "Ajout..." : "Enregistrer ce créneau"}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </AgentLayout>
  );
}
