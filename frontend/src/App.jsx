import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import LoginPage           from "./pages/LoginPage";
import RegisterPage        from "./pages/RegisterPage";
import SearchAgentsPage    from "./pages/SearchAgentsPage";
import AgentProfilePage    from "./pages/AgentProfilePage";
import MesDemandesPage     from "./pages/MesDemandesPage";
import DisponibilitePage   from "./pages/DisponibilitePage";
import DashboardPage       from "./pages/DashboardPage";
import SettingsPage        from "./pages/SettingsPage";
import AdminDashboardPage  from "./pages/AdminDashboardPage";
import AdminDestinationsPage from "./pages/AdminDestinationsPage";
import ThemePage           from "./pages/ThemePage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "voyageur") return <Navigate to="/agents" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protegees */}
      <Route path="/dashboard"      element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/mes-demandes"   element={<PrivateRoute><MesDemandesPage /></PrivateRoute>} />
      <Route path="/agents"         element={<PrivateRoute><SearchAgentsPage /></PrivateRoute>} />
      <Route path="/agents/:id"     element={<PrivateRoute><AgentProfilePage /></PrivateRoute>} />
      <Route path="/theme/:id"      element={<PrivateRoute><ThemePage /></PrivateRoute>} />
      <Route path="/disponibilite"  element={<PrivateRoute><DisponibilitePage /></PrivateRoute>} />
      <Route path="/settings"       element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin"          element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/destinations" element={<AdminRoute><AdminDestinationsPage /></AdminRoute>} />

      {/* Catch all */}
      <Route path="/"  element={<HomeRedirect />} />
      <Route path="*"  element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
