import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, refused: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mapMarkers = [
    // --- Japon ---
    { coordinates: [139.6917, 35.6895], color: "#c084fc", title: "Tokyo, Japon", desc: "Urbain & Technologie", requests: 42, budget: "3 500 €" },
    { coordinates: [135.7681, 35.0116], color: "#ff9666", title: "Kyoto, Japon", desc: "Temples & Culture", requests: 35, budget: "2 800 €" },
    { coordinates: [142.3648, 43.7667], color: "#60a5fa", title: "Hokkaido, Japon", desc: "Nature & Ski", requests: 12, budget: "4 100 €" },
    
    // --- France ---
    { coordinates: [2.3522, 48.8566], color: "#ff9666", title: "Paris, France", desc: "Séjour Culturel", requests: 85, budget: "2 100 €" },
    { coordinates: [7.2620, 43.7102], color: "#34d399", title: "Nice, France", desc: "Détente Riviera", requests: 40, budget: "3 200 €" },
    { coordinates: [6.8694, 45.9237], color: "#60a5fa", title: "Chamonix, France", desc: "Alpinisme Extrême", requests: 22, budget: "1 500 €" },

    // --- USA ---
    { coordinates: [-74.006, 40.7128], color: "#c084fc", title: "New York, USA", desc: "City Break Shopping", requests: 65, budget: "3 200 €" },
    { coordinates: [-118.2437, 34.0522], color: "#facc15", title: "Los Angeles, USA", desc: "Cinéma & Plage", requests: 48, budget: "3 900 €" },
    { coordinates: [-111.8224, 36.1069], color: "#ef4444", title: "Grand Canyon, USA", desc: "Roadtrip Aventure", requests: 31, budget: "2 500 €" },

    // --- Indonésie ---
    { coordinates: [115.1889, -8.4095], color: "#34d399", title: "Bali (Sud), Indonésie", desc: "Surf & Plage", requests: 54, budget: "1 800 €" },
    { coordinates: [115.2615, -8.5069], color: "#a78bfa", title: "Ubud, Indonésie", desc: "Retraite Spirituelle", requests: 38, budget: "2 100 €" },
    { coordinates: [119.4536, -8.5522], color: "#fb923c", title: "Komodo, Indonésie", desc: "Plongée & Dragons", requests: 15, budget: "3 400 €" },

    // --- Muslim-Friendly & Héritage Islamique ---
    { coordinates: [39.8262, 21.4225], color: "#10b981", title: "La Mecque, Arabie Saoudite", desc: "Pèlerinage (Omra)", requests: 120, budget: "2 500 €" },
    { coordinates: [39.6110, 24.4672], color: "#34d399", title: "Médine, Arabie Saoudite", desc: "Visite Spirituelle", requests: 95, budget: "1 800 €" },
    { coordinates: [28.9784, 41.0082], color: "#facc15", title: "Istanbul, Turquie", desc: "Héritage Islamique & Culture", requests: 78, budget: "1 500 €" },
    { coordinates: [101.6869, 3.1390], color: "#60a5fa", title: "Kuala Lumpur, Malaisie", desc: "Séjour Halal & Shopping", requests: 62, budget: "2 200 €" },
    { coordinates: [-8.0083, 31.6295], color: "#ff9666", title: "Marrakech, Maroc", desc: "Tradition & Détente Familiale", requests: 55, budget: "1 200 €" },
    { coordinates: [55.2708, 25.2048], color: "#c084fc", title: "Dubaï, EAU", desc: "Luxe & Famille (Halal Friendly)", requests: 88, budget: "4 500 €" },

    // --- Autres ---
    { coordinates: [-43.1729, -22.9068], color: "#facc15", title: "Rio de Janeiro, Brésil", desc: "Carnaval", requests: 28, budget: "2 800 €" },
    { coordinates: [18.4232, -33.9249], color: "#10b981", title: "Le Cap, Afrique du Sud", desc: "Safari Nature", requests: 19, budget: "3 500 €" },
    { coordinates: [-21.94, 64.1466], color: "#60a5fa", title: "Reykjavik, Islande", desc: "Aurores Boréales", requests: 27, budget: "3 800 €" }
  ];

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
        
      }
    };
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const heroImg = "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200";

  return (
    <AgentLayout>
      <div className="max-w-6xl mx-auto space-y-16 pb-16">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-center gap-10 mt-6"
        >
          {/* Left: Image with floating glass elements */}
          <div className="relative w-full lg:w-1/2 h-[450px] rounded-3xl overflow-hidden shadow-2xl">
            <img src={heroImg} alt="Adventure" className="w-full h-full object-cover" />
            
            {/* Floating Glass Badge 1 */}
            <div className="absolute top-8 left-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 bg-ak-accent rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Expert Atlas</p>
                <p className="text-white/70 text-xs">Partenaire certifié</p>
              </div>
            </div>

            {/* Floating Glass Badge 2 */}
            <div className="absolute bottom-12 right-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-lg">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-white mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-white font-bold text-sm">Réservations</p>
              <p className="text-white/70 text-xs text-center">Gérez tout ici</p>
            </div>
          </div>

          {/* Right: Typography */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.1] tracking-tight">
              Créez Leur<br />Aventure.
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Bonjour, <strong>{user?.name || "Agent"}</strong>. Bienvenue sur votre espace. Gérez vos demandes entrantes, consultez vos statistiques et planifiez vos prochaines disponibilités.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <Link to="/mes-demandes" className="btn-ak py-3.5 px-8 text-base shadow-ak-hover">
                Voir les demandes
              </Link>
              <Link to="/disponibilite" className="btn-ak-outline py-3.5 px-6 text-base">
                Planning
              </Link>
            </div>
          </div>
        </motion.div>

        {/* STATS SECTION (Storytelling Layout style) */}
        <div className="space-y-6">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Vos Statistiques</h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stat 1 */}
            <motion.div variants={itemVariants} className="card-ak p-8 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              <div>
                <p className="text-5xl font-display font-black text-white mb-2">{stats.total}</p>
                <p className="text-white/70 font-medium">Demandes Totales</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-ak-accent shadow-[0_0_20px_rgba(255,150,102,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={itemVariants} className="card-ak p-8 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              <div>
                <p className="text-5xl font-display font-black text-white mb-2">{stats.pending}</p>
                <p className="text-white/70 font-medium">En Attente</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div variants={itemVariants} className="card-ak p-8 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              <div>
                <p className="text-5xl font-display font-black text-white mb-2">{stats.accepted}</p>
                <p className="text-white/70 font-medium">Voyages Organisés</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* NOUVELLE SECTION : Besoins du Marché */}
        <div className="space-y-6 pt-10">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Besoins du Marché</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Voyages de Noces au Japon", trend: "+45%", icon: "🇯🇵" },
              { label: "Retraites Spirituelles à Bali", trend: "+30%", icon: "🧘" },
              { label: "Roadtrip en Islande", trend: "+25%", icon: "🚙" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="card-ak p-6 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h4 className="text-white font-bold">{item.label}</h4>
                    <p className="text-emerald-400 text-sm font-medium">{item.trend} de demandes</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NOUVELLE SECTION : Ratios & Performances (Angles Créatifs) */}
        <div className="space-y-6 pt-10">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Ratios & Performances</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-ak p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <h4 className="text-white/60 text-sm font-medium mb-1">Panier Moyen</h4>
              <p className="text-3xl font-display font-bold text-white">1 250 €</p>
              <div className="mt-4 w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-purple-400 mt-2 font-medium">+12% ce mois-ci</p>
            </div>
            
            <div className="card-ak p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <h4 className="text-white/60 text-sm font-medium mb-1">Taux de Conversion</h4>
              <p className="text-3xl font-display font-bold text-white">68%</p>
              <div className="mt-4 w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-xs text-emerald-400 mt-2 font-medium">Excellente performance</p>
            </div>

            <div className="card-ak p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <h4 className="text-white/60 text-sm font-medium mb-1">Satisfaction Client</h4>
              <p className="text-3xl font-display font-bold text-white">4.9/5</p>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className={`w-4 h-4 ${star === 5 ? 'text-blue-400/50' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="text-xs text-blue-400 mt-2 font-medium">Basé sur 124 avis</p>
            </div>

            <div className="card-ak p-6 bg-gradient-to-br from-ak-accent/10 to-transparent border-ak-accent/20">
              <h4 className="text-white/60 text-sm font-medium mb-1">Marge Opérationnelle</h4>
              <p className="text-3xl font-display font-bold text-white">22%</p>
              <div className="mt-4 flex gap-1 h-1.5">
                <div className="bg-ak-accent/30 w-1/4 rounded-l-full"></div>
                <div className="bg-ak-accent/60 w-1/2"></div>
                <div className="bg-ak-accent w-1/4 rounded-r-full"></div>
              </div>
              <p className="text-xs text-ak-accent mt-2 font-medium">Objectif atteint</p>
            </div>
          </div>
        </div>

        {/* NOUVELLE SECTION : Activité en Direct (Abstract Map) */}
        <div className="pt-10 mb-20">
          <div className="card-ak p-8 relative overflow-hidden bg-[#0a192f] border-white/10">
            {/* Effet lumineux */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Radar
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Mappemonde des Requêtes</h2>
                  <p className="text-white/70 leading-relaxed">
                    Naviguez librement, zoomez et découvrez les demandes de voyages en temps réel. Identifiez les zones géographiques avec une forte demande pour optimiser vos offres.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setZoom(z => Math.max(z / 1.5, 1))} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <button onClick={() => setZoom(z => Math.min(z * 1.5, 8))} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              </div>
              
              {/* Vraie Carte interactive avec react-simple-maps */}
              <div 
                className="relative w-full h-[500px] lg:h-[650px] bg-black/20 rounded-[2rem] border border-white/10 overflow-hidden cursor-move shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseLeave={() => setTooltipInfo(null)}
              >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 140 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ZoomableGroup 
                    zoom={zoom} 
                    center={center}
                    onMoveEnd={({ coordinates, zoom: newZoom }) => {
                      setCenter(coordinates);
                      setZoom(newZoom);
                    }}
                  >
                    <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="rgba(255, 255, 255, 0.05)"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth={0.5 / zoom}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "rgba(16, 185, 129, 0.3)", outline: "none", cursor: "pointer" },
                              pressed: { outline: "none" },
                            }}
                            onMouseEnter={() => {
                              setTooltipInfo({
                                isCountry: true,
                                title: geo.properties.name || "Territoire Inconnu",
                              });
                            }}
                            onMouseLeave={() => setTooltipInfo(null)}
                          />
                        ))
                      }
                    </Geographies>

                    {/* Marqueurs enrichis avec Tooltips */}
                    {mapMarkers.map((marker, idx) => (
                      <Marker 
                        key={idx} 
                        coordinates={marker.coordinates}
                        onMouseEnter={() => setTooltipInfo(marker)}
                        onMouseLeave={() => setTooltipInfo(null)}
                        style={{ default: { outline: "none" }, hover: { outline: "none", cursor: "pointer" }, pressed: { outline: "none" } }}
                      >
                        <circle r={4 / zoom} fill={marker.color} />
                        <circle r={14 / zoom} fill="none" stroke={marker.color} className="animate-ping" style={{ animationDelay: `${idx * 0.5}s`, animationDuration: '3s' }} />
                      </Marker>
                    ))}
                  </ZoomableGroup>
                </ComposableMap>

                {/* Bulle d'Information Volante (Tooltip) */}
                {tooltipInfo && (
                  <div 
                    className="absolute z-50 pointer-events-none bg-[#0a192f]/95 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl transition-opacity duration-150 ease-out"
                    style={{ 
                      left: Math.min(mousePos.x + 15, document.body.clientWidth - 250), 
                      top: Math.min(mousePos.y + 15, 600) 
                    }}
                  >
                    {tooltipInfo.isCountry ? (
                      <div>
                        <h4 className="text-white font-bold">{tooltipInfo.title}</h4>
                        <p className="text-white/50 text-xs mt-1">Survolez les points pour voir les détails</p>
                      </div>
                    ) : (
                      <div className="min-w-[180px]">
                        <h4 className="text-white font-bold mb-1">{tooltipInfo.title}</h4>
                        <p className="text-white/70 text-xs mb-3 font-medium bg-white/10 inline-block px-2 py-0.5 rounded-full">{tooltipInfo.desc}</p>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Demandes</p>
                            <p className="text-emerald-400 font-bold">{tooltipInfo.requests} actives</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Budget</p>
                            <p className="text-ak-accent font-bold">{tooltipInfo.budget}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
