import { useState } from "react";
import AgentLayout from "../components/AgentLayout";

const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
];
const DAYS_LABEL = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  // Lundi = 0
  return day === 0 ? 6 : day - 1;
}

const STATUS = {
  available:   { bg: "bg-emerald-500", label: "Disponible",    light: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  unavailable: { bg: "bg-red-400",     label: "Indisponible",  light: "bg-red-50 border-red-200 text-red-600" },
  partial:     { bg: "bg-amber-400",   label: "Partiel",       light: "bg-amber-50 border-amber-200 text-amber-700" },
};

// Mock initial — remplacer par axios.get("/agent/availability")
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
  const [selectedDay, setSelectedDay]   = useState(null);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  const daysInMonth  = getDaysInMonth(currentYear, currentMonth);
  const firstDayIdx  = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const toggleDay = (day) => {
    setSelectedDay(day);
  };

  const setStatus = (day, status) => {
    setDayStatus((prev) => {
      const next = { ...prev };
      if (next[day] === status) delete next[day]; // toggle off
      else next[day] = status;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    // API: axios.post("/agent/availability", { year: currentYear, month: currentMonth, dayStatus })
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
      <main className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Disponibilite</h1>
          <p className="text-gray-500">Gerez vos jours disponibles pour recevoir des demandes de voyage.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendrier - 2/3 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {/* Nav mois */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <h2 className="text-base font-black text-gray-900">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS_LABEL.map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
                ))}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7 gap-1">
                {/* Cases vides avant le 1er */}
                {Array.from({ length: firstDayIdx }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Jours du mois */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const status = dayStatus[day];
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  const isSelected = selectedDay === day;
                  const isPast =
                    new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && toggleDay(day)}
                      disabled={isPast}
                      className={`relative h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center ${
                        isPast
                          ? "text-gray-200 cursor-not-allowed"
                          : isSelected
                          ? "ring-2 ring-indigo-500 ring-offset-1"
                          : "hover:ring-2 hover:ring-indigo-300 hover:ring-offset-1"
                      } ${
                        status === "unavailable"
                          ? "bg-red-100 text-red-600"
                          : status === "partial"
                          ? "bg-amber-100 text-amber-700"
                          : isToday
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-indigo-50"
                      }`}
                    >
                      {day}
                      {status && !isPast && (
                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${STATUS[status].bg}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legende */}
              <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">
                {Object.entries(STATUS).map(([key, s]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.bg}`} />
                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-xs text-gray-500 font-medium">Aujourd hui</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 */}
          <div className="space-y-4">
            {/* Stats du mois */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Ce mois</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm text-gray-600">Disponible</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.available}j</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-sm text-gray-600">Indisponible</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.unavailable}j</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-sm text-gray-600">Partiel</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{stats.partial}j</span>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-4">
                <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.available / daysInMonth) * 100}%` }} />
                  <div className="bg-amber-400 transition-all"  style={{ width: `${(stats.partial / daysInMonth) * 100}%` }} />
                  <div className="bg-red-400 transition-all"    style={{ width: `${(stats.unavailable / daysInMonth) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-right">
                  {Math.round((stats.available / daysInMonth) * 100)}% disponible
                </p>
              </div>
            </div>

            {/* Modifier un jour selectionne */}
            {selectedDay ? (
              <div className="bg-white rounded-2xl border border-indigo-200 p-5">
                <h3 className="font-bold text-gray-900 mb-1">
                  {selectedDay} {MONTHS[currentMonth]}
                </h3>
                <p className="text-xs text-gray-400 mb-4">Choisissez le statut de ce jour</p>
                <div className="space-y-2">
                  {Object.entries(STATUS).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => setStatus(selectedDay, key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        dayStatus[selectedDay] === key
                          ? s.light + " border-current"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.bg}`} />
                      {s.label}
                      {dayStatus[selectedDay] === key && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                  {dayStatus[selectedDay] && (
                    <button
                      onClick={() => setStatus(selectedDay, dayStatus[selectedDay])}
                      className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors pt-1"
                    >
                      Reinitialiser ce jour
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-5 text-center">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm text-gray-400 font-medium">Cliquez sur un jour pour modifier son statut</p>
              </div>
            )}

            {/* Bouton sauvegarder */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Sauvegarde...
                </>
              ) : saved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Sauvegarde !
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Sauvegarder les modifications
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </AgentLayout>
  );
}
