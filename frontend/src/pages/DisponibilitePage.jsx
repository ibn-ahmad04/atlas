import { useState, useCallback } from "react";
import AgentLayout from "../components/AgentLayout";
import { motion, AnimatePresence } from "framer-motion";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const DAYS_LABEL = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Lundi = 0
}

// Order of toggle
const STATUS_ORDER = ["available", "unavailable", "partial"];

const STATUS = {
  available:   { bg: "bg-emerald-400", label: "Disponible",   border: "border-emerald-400/50", glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]" },
  unavailable: { bg: "bg-red-400",     label: "Indisponible", border: "border-red-400/50",     glow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]" },
  partial:     { bg: "bg-amber-400",   label: "Partiel",      border: "border-amber-400/50",   glow: "shadow-[0_0_15px_rgba(251,191,36,0.3)]" },
};

// Mock initial
const INITIAL_BLOCKED = [6, 7, 13, 20, 21, 27, 28];
const INITIAL_PARTIAL = [3, 10, 17, 24];

export default function DisponibilitePage() {
  const today = new Date();
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [dayStatus, setDayStatus]       = useState(() => {
    const init = {};
    INITIAL_BLOCKED.forEach((d) => { init[d] = "unavailable"; });
    INITIAL_PARTIAL.forEach((d)  => { init[d] = "partial"; });
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const daysInMonth  = getDaysInMonth(currentYear, currentMonth);
  const firstDayIdx  = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const handleDayClick = useCallback((day) => {
    setDayStatus(prev => {
      const currentStatus = prev[day] || "available";
      const currentIndex = STATUS_ORDER.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
      const nextStatus = STATUS_ORDER[nextIndex];

      const newStatusMap = { ...prev };
      if (nextStatus === "available") {
        delete newStatusMap[day]; // available is default, saves space
      } else {
        newStatusMap[day] = nextStatus;
      }
      return newStatusMap;
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = {
    available:   Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((d) => !dayStatus[d]).length,
    unavailable: Object.values(dayStatus).filter((s) => s === "unavailable").length,
    partial:     Object.values(dayStatus).filter((s) => s === "partial").length,
  };

  return (
    <AgentLayout>
      <div className="max-w-5xl mx-auto py-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2 tracking-tight">Mon Calendrier</h1>
            <p className="text-white/70 text-sm max-w-xl">
              Cliquez directement sur un jour pour modifier sa disponibilité. Les changements s'appliquent immédiatement en local.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-ak flex items-center justify-center gap-2 relative overflow-hidden min-w-[180px]"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Enregistrement...
              </>
            ) : saved ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Sauvegardé !
              </>
            ) : (
              "Publier le calendrier"
            )}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendrier Artistique - 3/4 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 card-ak p-6 md:p-10 relative overflow-hidden"
          >
            {/* Soft decorative background glows inside calendar */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ak-accent/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

            {/* Nav mois */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={prevMonth}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-sm backdrop-blur-md hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h2 className="text-3xl font-display font-bold text-white capitalize tracking-tight flex items-center gap-3">
                {MONTHS[currentMonth]} <span className="text-white/40 font-light">{currentYear}</span>
              </h2>
              <button
                onClick={nextMonth}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-sm backdrop-blur-md hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 mb-4">
              {DAYS_LABEL.map((d) => (
                <div key={d} className="text-center text-xs font-bold text-white/40 uppercase tracking-widest">{d}</div>
              ))}
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-3 sm:gap-4">
              {Array.from({ length: firstDayIdx }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20" />
              ))}

              <AnimatePresence>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const statusKey = dayStatus[day] || "available";
                  const s = STATUS[statusKey];
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  const isPast =
                    new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <motion.button
                      layout
                      key={day}
                      onClick={() => !isPast && handleDayClick(day)}
                      disabled={isPast}
                      whileHover={!isPast ? { scale: 1.05 } : {}}
                      whileTap={!isPast ? { scale: 0.95 } : {}}
                      className={`relative h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isPast
                          ? "opacity-30 cursor-not-allowed bg-white/5"
                          : `bg-white/5 border hover:bg-white/10 backdrop-blur-sm cursor-pointer ${s.border} ${statusKey !== 'available' ? s.glow : ''}`
                      } ${isToday && statusKey === 'available' ? 'ring-2 ring-ak-accent ring-offset-2 ring-offset-[#071913]' : ''}`}
                    >
                      <span className={`text-lg sm:text-xl font-display font-bold ${isPast ? 'text-white/50' : 'text-white'}`}>
                        {day}
                      </span>
                      {!isPast && (
                        <span className="text-[10px] sm:text-xs font-medium text-white/60 mt-1">
                          {s.label}
                        </span>
                      )}
                      
                      {/* Indicator dot */}
                      {!isPast && statusKey !== "available" && (
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${s.bg}`} />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT 1/4 - Stats Artistiques */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Legende Interactive (Visual Only) */}
            <div className="card-ak p-6">
              <h3 className="font-display font-bold text-white mb-6">Légende</h3>
              <div className="space-y-4">
                {Object.entries(STATUS).map(([key, s]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${s.bg} ${s.glow}`} />
                    <span className="text-sm font-medium text-white/80">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="card-ak p-6 flex-1 flex flex-col">
              <h3 className="font-display font-bold text-white mb-6">Aperçu mensuel</h3>
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-sm text-white/60 font-medium">Jours disponibles</span>
                    <span className="text-2xl font-display font-bold text-emerald-400">{stats.available}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${(stats.available / daysInMonth) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-sm text-white/60 font-medium">Jours indisponibles</span>
                    <span className="text-2xl font-display font-bold text-red-400">{stats.unavailable}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400" style={{ width: `${(stats.unavailable / daysInMonth) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-sm text-white/60 font-medium">Disponibilité partielle</span>
                    <span className="text-2xl font-display font-bold text-amber-400">{stats.partial}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${(stats.partial / daysInMonth) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AgentLayout>
  );
}
