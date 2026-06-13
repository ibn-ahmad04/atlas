import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getNavForRole = (role) => {
  if (role === "voyageur") {
    return [
      {
        section: "Plateforme",
        items: [
          { key: "agents",        label: "Explorer les agents", path: "/agents",         icon: "users",    badge: null },
        ],
      },
      {
        section: "Mes réservations",
        items: [
          { key: "demandes",      label: "Mes demandes",        path: "/mes-demandes",   icon: "inbox",    badge: null },
        ],
      },
    ];
  }

  // Default agent nav
  return [
    {
      section: "Principal",
      items: [
        { key: "dashboard",     label: "Dashboard",       path: "/dashboard",      icon: "grid",     badge: null },
        { key: "demandes",      label: "Mes demandes",    path: "/mes-demandes",   icon: "inbox",    badge: 3 },
      ],
    },
    {
      section: "Mon profil",
      items: [
        { key: "profil",        label: "Mon profil",      path: "/agents/1",       icon: "user",     badge: null },
        { key: "disponibilite", label: "Disponibilite",   path: "/disponibilite",  icon: "calendar", badge: null },
      ],
    },
    {
      section: "Plateforme",
      items: [
        { key: "agents",        label: "Autres agents",   path: "/agents",         icon: "users",    badge: null },
      ],
    },
  ];
};

function Icon({ type, className = "w-4 h-4" }) {
  const map = {
    grid: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    inbox: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    logout: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo + toggle */}
      <div className={`relative flex items-center h-16 border-b border-gray-100 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {collapsed ? (
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
        ) : (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-black text-gray-900">Atlas</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center w-6 h-6 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm ${
            collapsed ? "absolute -right-3 top-5" : ""
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
      <div className={`border-b border-gray-100 ${collapsed ? "py-3 flex justify-center" : "px-4 py-4"}`}>
        {collapsed ? (
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || "A"}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || "A"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Utilisateur"}</p>
              <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                {user?.role || "Agent"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {getNavForRole(user?.role).map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
                {group.section}
              </p>
            )}
            {collapsed && <div className="border-t border-gray-100 my-1" />}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={`relative flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon type={item.icon} />

                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? "bg-white/25 text-white" : "bg-amber-100 text-amber-700"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Badge point quand collapsed */}
                    {collapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                    )}

                    {/* Tooltip collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                        {item.label}
                        {item.badge && (
                          <span className="ml-1.5 bg-amber-500 text-white text-xs px-1 py-0.5 rounded-full">
                            {item.badge}
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
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`relative w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-all group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Icon type="logout" />
          {!collapsed && <span>Deconnexion</span>}
          {collapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
              Deconnexion
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
