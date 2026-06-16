import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useAuth } from "../context/AuthContext";
import DestinationShowcase from "../components/DestinationShowcase";
import { Globe, Map, Moon, MountainSnow, Compass, Sparkles } from "lucide-react";

function AgentCard({ agent, index }) {
  const name = agent.user?.name || "Agent sans nom";
  const bio = agent.bio || "Aucune description disponible pour cet agent.";
  const zones = agent.zones?.map(z => z.zone) || [];
  
  const portraits = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  ];
  const photoUrl = agent.user?.avatar 
    ? (agent.user.avatar.startsWith('http') ? agent.user.avatar : `http://localhost:8000/storage/${agent.user.avatar}`)
    : portraits[agent.id % portraits.length];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
      className="card-ak p-2 group flex flex-col h-full bg-white/5 relative overflow-hidden rounded-[2rem] border border-white/10 hover:border-ak-accent/50 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,150,102,0.15)]"
    >
      <div className="relative h-64 rounded-t-[1.5rem] rounded-b-2xl overflow-hidden mb-5">
        <img src={photoUrl} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ak-dark via-ak-dark/40 to-transparent opacity-80"></div>
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-2xl font-display font-black text-white mb-1 tracking-tight drop-shadow-md">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">{agent.hourly_rate || 20}€ / h</span>
            {Boolean(agent.user?.is_verified) && (
              <p className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-widest drop-shadow-md">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                Expert
              </p>
            )}
          </div>
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
            <span className="relative z-10 font-bold tracking-wide">Découvrir</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SearchAgentsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'agent' || user?.role === 'admin';
  
  const [agents, setAgents] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Map State
  const [center, setCenter] = useState([10, 30]);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "all";
  const initialDest = queryParams.get("dest") || "";

  // Filter State
  const [searchDest, setSearchDest] = useState(initialDest);
  const [searchDate, setSearchDate] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("recommended"); // recommended, price_asc, price_desc, rating
  const [zoom, setZoom] = useState(1);

  // Sync state if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    const dest = params.get("dest");
    if (cat !== null) setActiveCategory(cat);
    if (dest !== null) setSearchDest(dest);
  }, [location.search]);

  // Dynamic zoom effect
  useEffect(() => {
    if (searchDest || activeCategory !== 'all') {
      setZoom(2.5);
    } else {
      setZoom(1);
    }
  }, [searchDest, activeCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, destsRes] = await Promise.all([
          api.get("/agents"),
          api.get("/destinations")
        ]);
        const items = agentsRes.data?.data?.data || [];
        setAgents(Array.isArray(items) ? items : []);
        setDestinations(destsRes.data?.data || []);
      } catch (error) {
        setAgents([]);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { id: "all", label: "Toutes", icon: <Globe className="w-5 h-5" /> },
    { id: "touristique", label: "Tourisme", icon: <Map className="w-5 h-5" /> },
    { id: "omra", label: "Omra & Hajj", icon: <Moon className="w-5 h-5" /> },
    { id: "aventure", label: "Aventure", icon: <MountainSnow className="w-5 h-5" /> },
    { id: "afrique", label: "Afrique", icon: <Compass className="w-5 h-5" /> },
    { id: "luxe", label: "Luxe", icon: <Sparkles className="w-5 h-5" /> }
  ];

  const categoryKeywords = {
    touristique: ["Paris", "Tokyo", "Rome", "Casablanca", "Kyoto", "Europe", "Asie"],
    omra: ["La Mecque", "Médine", "Moyen-Orient", "Arabie"],
    aventure: ["Mont Blanc", "Bali", "Aventure", "Amériques"],
    afrique: ["Sénégal", "Afrique", "Dakar", "Maroc"],
    luxe: ["Paris", "Bali", "Indonésie", "Europe"]
  };

  const filteredAgents = useMemo(() => {
    let result = agents.filter(a => {
      if (isAgent && a.user?.id === user?.id) return false;
      return true;
    });

    // 1. Filter by Destination Name (zones matching)
    if (searchDest) {
      const s = searchDest.toLowerCase();
      result = result.filter(a => 
        (a.user?.name || "").toLowerCase().includes(s) || 
        (a.zones || []).some(z => z.zone.toLowerCase().includes(s))
      );
    }

    // 2. Filter by Category
    if (activeCategory !== 'all') {
      const keywords = categoryKeywords[activeCategory] || [];
      if (keywords.length > 0) {
        result = result.filter(a => {
          return (a.zones || []).some(z => 
            keywords.some(kw => z.zone.toLowerCase().includes(kw.toLowerCase()))
          );
        });
      }
    }

    // 3. Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.hourly_rate || 20) - (b.hourly_rate || 20));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.hourly_rate || 20) - (a.hourly_rate || 20));
    }

    return result;
  }, [agents, searchDest, searchDate, sortBy, isAgent, user]);

  const mapMarkers = useMemo(() => {
    return destinations
      .filter(d => d.latitude && d.longitude && (activeCategory === 'all' || d.travel_type === activeCategory))
      .map(d => ({
        id: d.id,
        name: d.name,
        desc: d.description,
        type: d.travel_type,
        coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)],
        color: d.travel_type === 'omra' || d.travel_type === 'hajj' ? '#34d399' : '#ff9666'
      }));
  }, [destinations, activeCategory]);

  return (
    <AgentLayout>
      <div className="max-w-7xl mx-auto px-4 pb-20 pt-10">
        
        {/* Header interactif */}
        {!isAgent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ak-accent/10 text-ak-accent text-sm font-semibold mb-6 border border-ak-accent/20">
              <span className="w-2 h-2 rounded-full bg-ak-accent animate-pulse" />
              Intelligence Atlas V2
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-2xl">
              Votre aventure sur-mesure.
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-xl font-light">
              Tapez une destination, choisissez vos dates et trouvez l'expert parfait pour organiser votre séjour.
            </p>
          </motion.div>
        )}

        {/* Section Recherche Avancée en premier */}
        {!isAgent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative z-20"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input 
                  type="text" 
                  value={searchDest}
                  onChange={e => setSearchDest(e.target.value)}
                  placeholder="Destination (ex: Paris, La Mecque, Bali...)" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-ak-accent transition-colors"
                />
              </div>
              <div className="md:w-1/4 relative">
                <input 
                  type="date" 
                  value={searchDate}
                  onChange={e => setSearchDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-ak-accent transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="md:w-1/4 relative">
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-ak-accent appearance-none transition-colors"
                >
                  <option value="recommended" className="bg-[#0a192f]">Recommandés</option>
                  <option value="price_asc" className="bg-[#0a192f]">Prix croissants</option>
                  <option value="price_desc" className="bg-[#0a192f]">Prix décroissants</option>
                </select>
              </div>
            </div>

            {/* Catégories de voyage */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat.id 
                      ? "bg-ak-accent text-black shadow-[0_0_20px_rgba(255,150,102,0.4)]" 
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center justify-center">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}



        {/* Inspiration et Catégories */}
        {!isAgent && !searchDest && activeCategory === 'all' && (
          <div className="mb-12">
            <DestinationShowcase />
          </div>
        )}

        {/* Section Liste des Agents au milieu */}
        <div className="mb-16">
          {!isAgent && (
            <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
              Experts correspondants
              <span className="h-px bg-white/20 flex-1 ml-4 hidden sm:block"></span>
            </h2>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-ak-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <p className="font-display text-xl font-bold text-white mb-1">Aucun expert trouvé</p>
              <p className="text-white/50 text-sm">Modifiez vos critères pour voir plus de résultats.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredAgents.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Section Carte Interactive Dynamique tout en bas */}
        {!isAgent && (
          <div className="mt-12">
            <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
              Carte des Destinations
              <span className="h-px bg-white/20 flex-1 ml-4 hidden sm:block"></span>
            </h2>
            <div className="card-ak p-4 relative overflow-hidden bg-[#0a192f] border-white/10 rounded-[3rem]">
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button onClick={() => setZoom(z => Math.max(z / 1.5, 1))} className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <button onClick={() => setZoom(z => Math.min(z * 1.5, 8))} className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              
              <div 
                className="relative w-full h-[350px] lg:h-[600px] bg-transparent rounded-[2.5rem] overflow-hidden cursor-move"
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
                        geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#1e293b"
                            stroke="#334155"
                            strokeWidth={0.5}
                            style={{ default: { outline: "none" }, hover: { fill: "#3b82f6", outline: "none" }, pressed: { outline: "none" } }}
                          />
                        ))
                      }
                    </Geographies>
                    
                    {mapMarkers.map((marker, idx) => (
                      <Marker 
                        key={idx} 
                        coordinates={marker.coordinates}
                        onMouseEnter={() => setTooltipInfo(marker)}
                        onMouseLeave={() => setTooltipInfo(null)}
                        style={{ default: { outline: "none" }, hover: { outline: "none", cursor: "pointer" }, pressed: { outline: "none" } }}
                      >
                        <circle r={6 / zoom} fill={marker.color} />
                        <circle r={18 / zoom} fill="none" stroke={marker.color} className="animate-ping" style={{ animationDelay: `${idx * 0.3}s`, animationDuration: '2.5s' }} />
                      </Marker>
                    ))}
                  </ZoomableGroup>
                </ComposableMap>

                {/* Tooltip */}
                {tooltipInfo && (
                  <div 
                    className="absolute z-50 pointer-events-none bg-[#0a192f]/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl transition-opacity duration-150"
                    style={{ 
                      left: Math.min(mousePos.x + 15, document.body.clientWidth - 250), 
                      top: Math.min(mousePos.y + 15, 450) 
                    }}
                  >
                    <div className="min-w-[180px]">
                      <h4 className="text-white font-bold mb-1">{tooltipInfo.name}</h4>
                      <p className="text-white/70 text-xs mb-3 font-medium bg-white/10 inline-block px-2 py-0.5 rounded-full capitalize">{tooltipInfo.type}</p>
                      <p className="text-white/50 text-[10px] leading-tight line-clamp-2">{tooltipInfo.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AgentLayout>
  );
}
