import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [travelType, setTravelType] = useState("touristique");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDestinations = async () => {
    try {
      const res = await api.get("/destinations");
      setDestinations(res.data.data);
    } catch {
      toast.error("Erreur lors du chargement des destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Le nom est obligatoire.");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("travel_type", travelType);
    if (description) formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await api.post("/admin/destinations", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Destination ajoutée avec succès !");
      setName("");
      setDescription("");
      setTravelType("touristique");
      setImage(null);
      fetchDestinations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette destination ?")) return;
    try {
      await api.delete(`/admin/destinations/${id}`);
      toast.success("Destination supprimée.");
      fetchDestinations();
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight">
            Destinations
          </h1>
          <p className="text-white/60 mt-2">
            Gérez les lieux qui seront affichés aux voyageurs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulaire d'ajout */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="card-ak p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Nouvelle Destination</h2>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Nom de la destination</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Île de Gorée"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-ak-accent focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Petite description attrayante..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-ak-accent focus:border-transparent outline-none min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Type de voyage</label>
                <select
                  value={travelType}
                  onChange={e => setTravelType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-ak-accent focus:border-transparent outline-none appearance-none"
                >
                  <option value="touristique" className="bg-gray-900 text-white">Touristique</option>
                  <option value="omra" className="bg-gray-900 text-white">Omra</option>
                  <option value="hajj" className="bg-gray-900 text-white">Hajj</option>
                  <option value="aventure" className="bg-gray-900 text-white">Aventure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Photo (optionnel)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files[0])}
                  className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-ak-accent text-gray-900 py-3 rounded-xl font-bold hover:bg-white transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Ajout..." : "Ajouter la destination"}
              </button>
            </form>
          </div>

          {/* Liste des destinations */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-ak-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : destinations.length === 0 ? (
              <div className="card-ak p-10 text-center">
                <p className="text-white/50">Aucune destination n'a encore été ajoutée.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destinations.map(dest => (
                  <motion.div key={dest.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="card-ak overflow-hidden group">
                    {dest.image_url ? (
                      <div className="h-40 w-full bg-white/5 relative border-b border-white/10">
                        <img 
                          src={`${import.meta.env.VITE_API_URL}/storage/${dest.image_url}`} 
                          alt={dest.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 w-full bg-white/5 flex items-center justify-center border-b border-white/10">
                        <span className="text-white/30 font-bold text-2xl">{dest.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-white">{dest.name}</h3>
                        <button 
                          onClick={() => handleDelete(dest.id)}
                          className="text-red-400 hover:text-white hover:bg-red-500/20 p-2 rounded-full transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-white/60 mt-2 line-clamp-2">{dest.description || "Aucune description."}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium capitalize">
                          {dest.travel_type}
                        </span>
                        {dest.latitude && dest.longitude && (
                          <span className="text-xs text-ak-accent flex items-center gap-1" title="Géolocalisation active">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Coordonnées trouvées
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
