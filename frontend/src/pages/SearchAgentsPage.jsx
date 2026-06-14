import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useAuth } from "../context/AuthContext";

function AgentCard({ agent, index }) {
  const name = agent.user?.name || "Agent sans nom";
  const bio = agent.bio || "Aucune description disponible pour cet agent.";
  const zones = agent.zones?.map(z => z.zone) || [];
  
  // Real photos portraits based on ID
  const portraits = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", // Men 1
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", // Women 1
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", // Men 2
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop", // Women 2
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", // Men 3
    "https://images.unsplash.com/photo-1531123897727-8f129e1b88ce?w=400&h=400&fit=crop"  // Women 3
  ];
  const photoUrl = agent.user?.avatar 
    ? `http://localhost:8000/storage/${agent.user.avatar}`
    : portraits[agent.id % portraits.length];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      className="card-ak p-2 group flex flex-col h-full bg-white/5 relative overflow-hidden rounded-[2rem] border border-white/10 hover:border-ak-accent/50 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,150,102,0.15)]"
    >
      <div className="relative h-64 rounded-t-[1.5rem] rounded-b-2xl overflow-hidden mb-5">
        <img src={photoUrl} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ak-dark via-ak-dark/40 to-transparent opacity-80"></div>
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-2xl font-display font-black text-white mb-1 tracking-tight drop-shadow-md">{name}</h3>
          {agent.user?.is_verified && (
            <p className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-widest drop-shadow-md">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
              Expert Vérifié
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <p className="text-sm text-white/60 mb-6 line-clamp-3 leading-relaxed font-light">{bio}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {zones.slice(0, 3).map((z) => (
              <span key={z} className="text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-white/80 px-3 py-1.5 rounded-full">{z}</span>
            ))}
            {zones.length > 3 && (
              <span className="text-[10px] font-bold tracking-widest uppercase bg-ak-accent/20 border border-ak-accent/30 text-ak-accent px-3 py-1.5 rounded-full">+{zones.length - 3}</span>
            )}
          </div>
          
          <Link to={`/agents/${agent.id}`} className="w-full btn-ak flex items-center justify-center gap-2 relative overflow-hidden group/btn py-3.5 rounded-2xl">
            <span className="relative z-10 font-bold tracking-wide">Découvrir le profil</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Destinations Vedettes Mock
const DESTINATIONS = [
  { id: 1, name: "Kyoto, Japon", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", count: 12 },
  { id: 2, name: "Santorin, Grèce", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?auto=format&fit=crop&w=800&q=80", count: 8 },
  { id: 3, name: "Bali, Indonésie", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", count: 15 },
  { id: 4, name: "Marrakech, Maroc", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80", count: 6 },
];

export default function SearchAgentsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'agent' || user?.role === 'admin';
  
  const [search, setSearch] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agents");
        const items = response.data?.data?.data || [];
        setAgents(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Erreur chargement agents", error);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filtered = agents.filter((a) => {
    if (isAgent && a.user?.id === user?.id) return false;
    const name = a.user?.name || "";
    const bio = a.bio || "";
    const nameMatch = name.toLowerCase().includes(search.toLowerCase());
    const bioMatch = bio.toLowerCase().includes(search.toLowerCase());
    return search === "" || nameMatch || bioMatch;
  });

  return (
    <AgentLayout>
      <div className="max-w-7xl mx-auto px-4 pb-20 pt-10">
        
        {/* Header interactif */}
        {!isAgent ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ak-accent/10 text-ak-accent text-sm font-semibold mb-6 border border-ak-accent/20">
              <span className="w-2 h-2 rounded-full bg-ak-accent animate-pulse" />
              Le monde à portée de main
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-2xl">
              Explorez sans limites.
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-xl font-light">
              Trouvez le créateur de voyage idéal pour votre prochaine aventure, soutenu par des guides locaux certifiés.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Réseau des Confrères</h1>
            <p className="text-white/60">Recherchez et connectez-vous avec d'autres experts de la plateforme Atlas.</p>
          </motion.div>
        )}

        {/* Section Destinations Vedettes */}
        {!isAgent && (
          <div className="mb-20">
            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
              Destinations Vedettes
              <span className="h-px bg-white/20 flex-1 ml-4 hidden sm:block"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DESTINATIONS.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                    <p className="text-white/70 text-sm">{dest.count} guides locaux</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section Carte Interactive pour Voyageur */}
        {!isAgent && (
          <div className="mb-20">
            <div className="card-ak p-8 relative overflow-hidden bg-[#0a192f] border-white/10">
              {/* Effet lumineux */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-ak-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Explorez notre réseau d'experts mondiaux</h2>
                    <p className="text-white/70 leading-relaxed">
                      De Tokyo à Rio, nos guides certifiés sont prêts à concevoir votre voyage sur-mesure. Naviguez sur la carte interactive pour découvrir où se trouvent nos meilleurs créateurs d'aventure et trouvez l'inspiration pour votre prochaine destination.
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
                
                <div 
                  className="relative w-full h-[400px] lg:h-[550px] bg-black/20 rounded-[2rem] border border-white/10 overflow-hidden cursor-move shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
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
                                hover: { fill: "rgba(255, 150, 102, 0.2)", outline: "none", cursor: "pointer" },
                                pressed: { outline: "none" },
                              }}
                              onMouseEnter={() => setTooltipInfo({ isCountry: true, title: geo.properties.name })}
                              onMouseLeave={() => setTooltipInfo(null)}
                            />
                          ))
                        }
                      </Geographies>
                      
                      {/* Markers mock for Traveler map */}
                      {[
                        { coordinates: [139.6917, 35.6895], title: "Japon", color: "#34d399", guides: 24, desc: "Aventure & Culture" },
                        { coordinates: [2.3522, 48.8566], title: "France", color: "#ff9666", guides: 15, desc: "Histoire & Gastronomie" },
                        { coordinates: [115.1889, -8.4095], title: "Indonésie", color: "#a78bfa", guides: 32, desc: "Retraite & Plongée" },
                        { coordinates: [-74.006, 40.7128], title: "États-Unis", color: "#fb923c", guides: 45, desc: "Roadtrips & City Breaks" },
                        { coordinates: [39.8262, 21.4225], title: "Arabie Saoudite", color: "#10b981", guides: 18, desc: "Voyages Spirituels" }
                      ].map((marker, idx) => (
                        <Marker 
                          key={idx} 
                          coordinates={marker.coordinates}
                          onMouseEnter={() => setTooltipInfo(marker)}
                          onMouseLeave={() => setTooltipInfo(null)}
                          style={{ default: { outline: "none" }, hover: { outline: "none", cursor: "pointer" }, pressed: { outline: "none" } }}
                        >
                          <circle r={5 / zoom} fill={marker.color} />
                          <circle r={15 / zoom} fill="none" stroke={marker.color} className="animate-ping" style={{ animationDelay: `${idx * 0.5}s`, animationDuration: '3s' }} />
                        </Marker>
                      ))}
                    </ZoomableGroup>
                  </ComposableMap>
  
                  {/* Tooltip */}
                  {tooltipInfo && (
                    <div 
                      className="absolute z-50 pointer-events-none bg-[#0a192f]/95 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl transition-opacity duration-150 ease-out"
                      style={{ 
                        left: Math.min(mousePos.x + 15, document.body.clientWidth - 250), 
                        top: Math.min(mousePos.y + 15, 500) 
                      }}
                    >
                      {tooltipInfo.isCountry ? (
                        <div>
                          <h4 className="text-white font-bold">{tooltipInfo.title || "Territoire"}</h4>
                          <p className="text-white/50 text-xs mt-1">Pays partenaire Atlas</p>
                        </div>
                      ) : (
                        <div className="min-w-[180px]">
                          <h4 className="text-white font-bold mb-1">{tooltipInfo.title}</h4>
                          <p className="text-white/70 text-xs mb-3 font-medium bg-white/10 inline-block px-2 py-0.5 rounded-full">{tooltipInfo.desc}</p>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ak-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <p className="text-sm font-bold text-white">{tooltipInfo.guides} <span className="font-normal text-white/50 text-xs">guides locaux</span></p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Top Guides (L'ancien contenu) */}
        <div>
          {!isAgent && (
            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
              Trouvez votre Expert
              <span className="h-px bg-white/20 flex-1 ml-4 hidden sm:block"></span>
            </h2>
          )}

          <div className="bg-white/10 rounded-2xl border border-white/10 p-2 mb-10 shadow-sm flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative bg-white/5 rounded-xl overflow-hidden border border-transparent focus-within:border-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isAgent ? "Rechercher un confrère..." : "Rechercher par nom ou bio..."}
                className="w-full bg-transparent pl-12 pr-4 py-4 text-sm font-medium text-white focus:outline-none placeholder:text-white/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-ak-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <p className="font-display text-xl font-bold text-white mb-1">Aucun expert trouvé</p>
              <p className="text-white/50 text-sm">Modifiez vos critères pour voir plus de résultats.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Section SEO enrichie */}
        {!isAgent && (
          <div className="mt-24 mb-10 card-ak p-8 lg:p-12 bg-gradient-to-br from-white/5 to-transparent border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-ak-accent/20 flex items-center justify-center text-ak-accent mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Voyages Sur-Mesure</h3>
                <p className="text-white/60 text-sm leading-relaxed">Confiez la planification de vos vacances à des agents de voyage experts. Chaque itinéraire est personnalisé selon vos passions, votre budget et vos envies d'évasion, pour un séjour véritablement unique.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Expertise Locale</h3>
                <p className="text-white/60 text-sm leading-relaxed">Nos guides partenaires résident sur place et connaissent les trésors cachés de chaque pays. Profitez d'une immersion totale, loin du tourisme de masse, grâce à leurs conseils avisés et exclusifs.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Réservation Sécurisée</h3>
                <p className="text-white/60 text-sm leading-relaxed">Voyagez l'esprit tranquille. Notre plateforme garantit la sécurité de vos transactions et vous offre une assistance 24/7 durant toute la durée de votre séjour organisé via Atlas.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </AgentLayout>
  );
}
