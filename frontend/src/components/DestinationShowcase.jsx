import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Map, Moon, MountainSnow, Compass, Sparkles } from "lucide-react";

const THEMES = [
  {
    id: "touristique",
    title: "Évasion Touristique",
    desc: "Plongez dans les cultures du monde entier, des capitales vibrantes aux plages paradisiaques.",
    img: "/touristique_theme.png",
    color: "from-blue-900/80 to-blue-500/20",
    accent: "text-blue-400",
    icon: <Map className="w-6 h-6" />
  },
  {
    id: "omra",
    title: "Voyage Spirituel",
    desc: "Un accompagnement respectueux et organisé pour votre pèlerinage (Omra/Hajj) aux Lieux Saints.",
    img: "/omra_theme.png",
    color: "from-emerald-900/80 to-emerald-500/20",
    accent: "text-emerald-400",
    icon: <Moon className="w-6 h-6" />
  },
  {
    id: "aventure",
    title: "Adrénaline & Aventure",
    desc: "Pour les amateurs de sensations fortes : montagnes, déserts, et explorations hors des sentiers battus.",
    img: "/aventure_theme.png",
    color: "from-orange-900/80 to-orange-500/20",
    accent: "text-orange-400",
    icon: <MountainSnow className="w-6 h-6" />
  },
  {
    id: "afrique",
    title: "Afrique Authentique",
    desc: "Découvrez la Teranga sénégalaise, les safaris tanzaniens et l'âme d'un continent vibrant.",
    img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&h=900&fit=crop",
    color: "from-amber-900/80 to-amber-500/20",
    accent: "text-amber-400",
    icon: <Compass className="w-6 h-6" />
  },
  {
    id: "luxe",
    title: "Luxe & Détente",
    desc: "Villas privées, spas cinq étoiles et services sur-mesure pour un lâcher-prise total.",
    img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1600&h=900&fit=crop",
    color: "from-purple-900/80 to-purple-500/20",
    accent: "text-purple-400",
    icon: <Sparkles className="w-6 h-6" />
  }
];

export default function DestinationShowcase() {
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  return (
    <div className="relative w-full overflow-hidden rounded-[3rem] bg-[#0a192f] border border-white/10 shadow-2xl mb-24 min-h-[600px] flex flex-col md:flex-row">
      {/* Background Image transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className={`absolute inset-0 bg-gradient-to-r ${activeTheme.color} z-10 mix-blend-multiply`}></div>
          <img src={activeTheme.img} alt={activeTheme.title} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row w-full p-8 lg:p-16">
        
        {/* Left Side: Navigation */}
        <div className="w-full md:w-1/3 flex flex-col justify-center space-y-4 pr-8 border-r border-white/10">
          <h2 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-6">Inspirations Atlas</h2>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme)}
              className={`text-left text-xl lg:text-3xl font-display font-black transition-all duration-300 py-2 flex items-center gap-4 ${
                activeTheme.id === theme.id 
                  ? "text-white translate-x-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  : "text-white/30 hover:text-white/60 hover:translate-x-2"
              }`}
            >
              <span className={`flex items-center justify-center transition-all ${activeTheme.id === theme.id ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}>{theme.icon}</span>
              {theme.title}
            </button>
          ))}
        </div>

        {/* Right Side: Details & CTA */}
        <div className="w-full md:w-2/3 flex flex-col justify-center mt-12 md:mt-0 md:pl-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={`text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight drop-shadow-lg`}>
                L'essence de <span className={activeTheme.accent}>{activeTheme.title.split(' ')[0]}</span>
              </h3>
              <p className="text-xl text-white/80 max-w-lg leading-relaxed mb-10 font-light drop-shadow-md">
                {activeTheme.desc}
              </p>
              
              <Link to={`/theme/${activeTheme.id}`} className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] group">
                <span>Trouver un créateur pour ce voyage</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
