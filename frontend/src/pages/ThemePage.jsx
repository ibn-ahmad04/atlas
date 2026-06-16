import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import AgentLayout from "../components/AgentLayout";
import { Map, Moon, MountainSnow, Compass, Sparkles, Globe } from "lucide-react";

export default function ThemePage() {
  const { id } = useParams(); // 'omra', 'aventure', 'touristique', etc.
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme details
  const themes = {
    touristique: { title: "Destinations Touristiques", desc: "Découvrez les villes les plus prisées au monde.", icon: <Map className="w-16 h-16" /> },
    omra: { title: "Omra & Hajj", desc: "Accomplissez votre pèlerinage avec nos meilleurs guides spirituels.", icon: <Moon className="w-16 h-16" /> },
    aventure: { title: "Aventure & Nature", desc: "Repoussez vos limites dans des décors sauvages.", icon: <MountainSnow className="w-16 h-16" /> },
    afrique: { title: "L'Afrique Authentique", desc: "Plongez au cœur de la Téranga et des paysages grandioses.", icon: <Compass className="w-16 h-16" /> },
    luxe: { title: "Luxe & Détente", desc: "Des séjours exclusifs pour un confort absolu.", icon: <Sparkles className="w-16 h-16" /> },
  };

  const theme = themes[id] || { title: "Destinations", desc: "Explorez nos magnifiques lieux.", icon: <Globe className="w-16 h-16" /> };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        const allDest = res.data?.data || [];
        
        // Custom logic to match themes
        const filtered = allDest.filter(d => {
          if (id === 'omra') return d.travel_type === 'omra' || d.travel_type === 'hajj';
          return d.travel_type === id;
        });
        
        setDestinations(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [id]);

  return (
    <AgentLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-6 text-ak-accent drop-shadow-[0_0_15px_rgba(255,150,102,0.5)]"
          >
            {theme.icon}
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black font-display mb-6 text-white drop-shadow-2xl"
          >
            {theme.title}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto font-light"
          >
            {theme.desc}
          </motion.p>
        </div>

        {/* Grid of destinations */}
        {loading ? (
          <div className="flex justify-center py-20 relative z-10">
            <div className="w-12 h-12 border-4 border-ak-accent/20 border-t-ak-accent rounded-full animate-spin"/>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center text-white/60 p-12 card-ak border-white/10 rounded-3xl relative z-10">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-bold text-lg">Aucune destination ne correspond à ce thème pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                onClick={() => navigate(`/agents?dest=${encodeURIComponent(dest.name)}&category=${id}`)}
                className="group cursor-pointer rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-ak-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,150,102,0.15)] relative"
              >
                {dest.image_url ? (
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}/storage/${dest.image_url}`} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent opacity-90" />
                  </div>
                ) : (
                  <div className="h-64 bg-white/5 flex items-center justify-center relative">
                    <Map className="w-16 h-16 text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-display font-black text-white mb-3 group-hover:text-ak-accent transition-colors tracking-tight">{dest.name}</h3>
                  <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">{dest.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
