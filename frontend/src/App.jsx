import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre de navigation Tailwind v4 */}
      <nav className="bg-white p-4 shadow-md flex gap-6 justify-center">
        <Link to="/" className="text-blue-500 font-bold hover:text-blue-700">Accueil</Link>
        <Link to="/login" className="text-blue-500 font-bold hover:text-blue-700">Connexion</Link>
      </nav>

      {/* Contenu qui change selon l'URL */}
      <div className="container mx-auto mt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

export default App