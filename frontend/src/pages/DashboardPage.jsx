import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, refused: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/bookings");
        const bookings = response.data?.data?.data || [];
        
        setStats({
          total: bookings.length,
          pending: bookings.filter(b => b.status === "en_attente").length,
          accepted: bookings.filter(b => b.status === "acceptee").length,
          refused: bookings.filter(b => b.status === "refusee").length,
        });
      } catch (err) {
        console.error("Erreur chargement stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AgentLayout>
      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Bonjour, {user?.name || "Agent"} 👋</h1>
          <p className="text-gray-500 text-lg">Voici un aperçu de votre activité sur Atlas.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Carte Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm font-semibold mb-2">Total Réservations</span>
              <span className="text-4xl font-black text-gray-900">{stats.total}</span>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-amber-600 text-sm font-semibold mb-2">En Attente</span>
              <span className="text-4xl font-black text-amber-500">{stats.pending}</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-emerald-600 text-sm font-semibold mb-2">Acceptées</span>
              <span className="text-4xl font-black text-emerald-500">{stats.accepted}</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-red-600 text-sm font-semibold mb-2">Refusées</span>
              <span className="text-4xl font-black text-red-500">{stats.refused}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gérer vos demandes</h2>
            <p className="text-gray-500 mb-6">Vous avez {stats.pending} demande(s) en attente de réponse. N'oubliez pas de les traiter rapidement !</p>
            <Link to="/mes-demandes" className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Voir les demandes
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vos disponibilités</h2>
            <p className="text-gray-500 mb-6">Mettez à jour vos créneaux horaires pour recevoir plus de demandes ciblées.</p>
            <Link to="/disponibilite" className="inline-flex items-center justify-center bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-200 px-6 py-3 rounded-xl font-bold transition-all hover:bg-indigo-50">
              Modifier mes dispos
            </Link>
          </div>
        </div>
      </main>
    </AgentLayout>
  );
}
