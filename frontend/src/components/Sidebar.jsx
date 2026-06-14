import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getNavForRole = (role) => {
  if (role === "admin") {
    return [
      {
        section: "Administration",
        items: [
          { key: "dashboard", label: "Dashboard Admin", path: "/admin", icon: "grid", badge: null },
        ],
      },
    ];
  }

  if (role === "voyageur") {
    return [
      {
        section: "Plateforme",
        items: [
          { key: "agents",        label: "Explorer", path: "/agents",         icon: "compass",    badge: null },
        ],
      },
      {
        section: "Mes réservations",
        items: [
          { key: "demandes",      label: "Historique",        path: "/mes-demandes",   icon: "book",    badge: null },
        ],
      },
    ];
  }

  // Default agent nav
  return [
    {
      section: "Principal",
      items: [
        { key: "dashboard",     label: "Vue d'ensemble",       path: "/dashboard",      icon: "grid",     badge: null },
        { key: "demandes",      label: "Réservations",    path: "/mes-demandes",   icon: "inbox",    badge: 3 },
      ],
    },
    {
      section: "Personnel",
      items: [
        { key: "profil",        label: "Mon espace",      path: "/agents/1",       icon: "user",     badge: null },
        { key: "disponibilite", label: "Calendrier",   path: "/disponibilite",  icon: "calendar", badge: null },
      ],
    },
    {
      section: "Réseau",
      items: [
        { key: "agents",        label: "Confrères",   path: "/agents",         icon: "users",    badge: null },
      ],
    },
  ];
};

function Icon({ type, className = "w-5 h-5" }) {
  const map = {
    grid: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    inbox: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    compass: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    logout: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  };
  return map[type] || null;
}

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-atlas-stone-200 flex flex-col z-30 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo + toggle */}
      <div className={`relative flex items-center h-20 border-b border-atlas-stone-100 px-6 ${collapsed ? "justify-center px-0" : "justify-between"}`}>
        {collapsed ? (
          <div className="w-10 h-10 bg-atlas-navy-900 rounded-sm flex items-center justify-center">
            <span className="text-atlas-gold font-serif text-lg font-medium">A</span>
          </div>
        ) : (
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <span className="text-atlas-gold font-serif text-2xl font-bold">A.</span>
            </div>
            <span className="font-serif text-xl font-bold text-atlas-navy-900 tracking-wide">Atlas</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center w-6 h-6 rounded-full border border-atlas-stone-200 bg-white text-atlas-navy-900/40 hover:text-atlas-navy-900 hover:border-atlas-stone-300 transition-all shadow-sm ${
            collapsed ? "absolute -right-3 top-7" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Agent info */}
      <div className={`border-b border-atlas-stone-100 ${collapsed ? "py-4 flex justify-center" : "px-6 py-6"}`}>
        {collapsed ? (
          <div className="w-10 h-10 bg-atlas-stone-100 text-atlas-navy-900 rounded-full flex items-center justify-center border border-atlas-stone-200">
            <span className="font-medium text-sm">{user?.name?.charAt(0) || "A"}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-atlas-stone-100 text-atlas-navy-900 border border-atlas-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-lg">{user?.name?.charAt(0) || "A"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-atlas-navy-900 truncate">{user?.name || "Utilisateur"}</p>
              <span className="text-xs text-atlas-gold font-medium uppercase tracking-widest mt-0.5 block">
                {user?.role || "Agent"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {getNavForRole(user?.role).map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-atlas-navy-900/40 uppercase tracking-widest px-3 mb-3">
                {group.section}
              </p>
            )}
            {collapsed && <div className="border-t border-atlas-stone-100 my-4" />}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={`relative flex items-center gap-4 px-3 py-2.5 rounded-sm text-sm font-medium transition-all group ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-atlas-stone-100 text-atlas-navy-900 border-l-2 border-atlas-gold"
                        : "text-atlas-navy-700/70 hover:bg-atlas-stone-50 hover:text-atlas-navy-900 border-l-2 border-transparent"
                    }`}
                  >
                    <span className={isActive ? "text-atlas-gold" : "text-atlas-navy-900/40 group-hover:text-atlas-gold transition-colors"}>
                      <Icon type={item.icon} />
                    </span>

                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                            isActive ? "bg-atlas-gold text-white" : "bg-atlas-stone-200 text-atlas-navy-900"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Badge point quand collapsed */}
                    {collapsed && item.badge && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-atlas-gold rounded-full" />
                    )}

                    {/* Tooltip collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-4 px-3 py-2 bg-atlas-navy-900 text-white text-xs font-medium rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-premium">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 bg-atlas-gold text-white text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            {item.badge} NOUV
                          </span>
                        )}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-atlas-stone-100">
        <button
          onClick={handleLogout}
          className={`relative w-full flex items-center gap-4 px-3 py-3 rounded-sm text-sm font-medium text-atlas-navy-900/60 hover:bg-red-50 hover:text-red-600 transition-all group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Icon type="logout" />
          {!collapsed && <span>Déconnexion</span>}
          {collapsed && (
            <span className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-premium">
              Déconnexion
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
