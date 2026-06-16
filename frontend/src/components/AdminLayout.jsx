import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Tableau de Bord", path: "/admin" },
    { name: "Destinations", path: "/admin/destinations" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar Premium Admin */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Left side */}
            <div className="flex items-center gap-8">
              <Link to="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ak-accent text-gray-900 flex items-center justify-center rounded-xl font-bold text-xl">
                  A.
                </div>
                <span className="text-xl font-black text-white tracking-tight">Atlas <span className="text-ak-accent font-medium">Admin</span></span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-white/10 text-white" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 mr-4 hidden md:flex">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/50 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title="Déconnexion"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
