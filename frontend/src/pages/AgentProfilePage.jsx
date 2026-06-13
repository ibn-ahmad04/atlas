import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";

const DAYS = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
const AVAILABILITY = [true, true, true, false, true, false, false];

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await api.get(`/agents/${id}`);
        setAgent(response.data.data);
      } catch (err) {
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
    } catch (err) {
      setBookingMsg("❌ Erreur lors de la réservation.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <AgentLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </AgentLayout>
  );

  if (error || !agent) return (
    <AgentLayout>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    </AgentLayout>
  );

  const name = agent.user?.name || "Agent";
  const bio = agent.bio || "Pas de biographie renseignée.";
  const languages = agent.languages?.map(l => l.language) || [];

  return (
    <AgentLayout>
      <main className="max-w-5xl mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/agents" className="hover:text-indigo-600 transition-colors">Agents</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{name}</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-6">
          <div className="h-44 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 relative flex items-center justify-center overflow-hidden">
            <span className="text-[180px] font-black text-indigo-100 select-none leading-none">{name.charAt(0)}</span>
          </div>
          <div className="px-8 pb-7 relative">
            <div className="absolute -top-10 left-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white font-black text-2xl">{name.charAt(0)}</span>
              </div>
            </div>
            <div className="pt-14">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full">Agent Atlas</span>
                {languages.map((l) => (
                  <span key={l} className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 rounded">
                    {l}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">{name}</h1>
              <p className="text-gray-500 text-sm line-clamp-2">{bio}</p>
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Vision */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-indigo-500">✦</span> Bio & Vision
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">{bio}</p>
            </div>

            {/* Zones */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-3">Zones d'expertise</h2>
              <div className="flex flex-wrap gap-2">
                {agent.zones?.map((z) => (
                  <span key={z.id} className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3.5 py-1.5 rounded-full border border-indigo-100">{z.zone}</span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900">Disponibilité (Mock)</h2>
                <span className="text-xs text-gray-400">Fuseau : Paris (CET)</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400 font-semibold">{day}</span>
                    <div className={`w-full h-12 rounded-xl flex items-center justify-center ${AVAILABILITY[i] ? "bg-emerald-50" : "bg-gray-50"}`}>
                      <span className={`w-2 h-2 rounded-full ${AVAILABILITY[i] ? "bg-emerald-500" : "bg-gray-300"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-6">
              <h3 className="font-black text-gray-900 mb-1">Réserver cet agent</h3>
              <p className="text-xs text-gray-400 mb-5">Demandez une prise en charge personnalisée</p>

              <div className="space-y-3">
                <input 
                  type="datetime-local" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
                
                {bookingMsg && (
                  <div className={`text-xs p-2 rounded ${bookingMsg.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    {bookingMsg}
                  </div>
                )}

                <button 
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:bg-indigo-400"
                >
                  {bookingLoading ? "Envoi..." : "Envoyer la demande"}
                </button>
                <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Planifier un appel
                </button>
              </div>

              <div className="border-t border-gray-100 mt-5 pt-4">
                <div className="flex justify-around text-gray-400">
                  {[
                    { label: "Email", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
                    { label: "Partager", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                  ].map(({ label, icon }) => (
                    <button key={label} className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors">
                      {icon}
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AgentLayout>
  );
}
