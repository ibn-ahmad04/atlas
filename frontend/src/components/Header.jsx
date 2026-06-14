import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const getNavForRole = (role) => {
  if (role === "voyageur") {
    return [
      { key: "agents",        label: "Explorer",    path: "/agents" },
      { key: "demandes",      label: "Historique",  path: "/mes-demandes" },
    ];
  }

  // Default agent nav
  return [
    { key: "dashboard",     label: "Vue d'ensemble", path: "/dashboard" },
    { key: "demandes",      label: "Réservations",   path: "/mes-demandes" },
    { key: "profil",        label: "Mon espace",     path: "/agents/1" },
    { key: "disponibilite", label: "Planning",       path: "/disponibilite" },
    { key: "agents",        label: "Réseau",         path: "/agents" },
  ];
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/login"); };

  const navItems = getNavForRole(user?.role);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-header px-8 py-4 flex items-center justify-between bg-white/10 border border-white/20 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]"
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-ak-accent rounded-full flex items-center justify-center text-gray-900 font-display font-bold group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,150,102,0.4)]">
            A.
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block text-white">Atlas</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  isActive ? "text-gray-900" : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-tab"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="flex items-center gap-4">
          <Link to="/settings" className="flex items-center gap-2 group" title="Mon espace">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-display font-bold text-sm shadow-sm backdrop-blur-md overflow-hidden group-hover:border-ak-accent transition-colors">
              {user?.avatar ? (
                <img src={`http://localhost:8000/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/10"
            title="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </motion.header>
    </div>
  );
}
