import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, BookOpen, Kanban, CheckSquare, Calendar, Table, ArrowRight } from 'lucide-react';

export default function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    courses,
    tasks,
    notes,
    scheduleEvents,
    databases,
    setActiveTab,
    setSelectedCourseDetail
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const q = query.toLowerCase();

  const filteredCourses = courses.filter(
    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  );
  const filteredTasks = tasks.filter(
    (t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
  );
  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(q));
  const filteredEvents = scheduleEvents.filter((e) => e.title.toLowerCase().includes(q));
  const filteredDatabases = databases.filter((db) => db.title.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto my-auto">
      <div className="card-myits bg-[#1b1c24] border-[#2d2f3e] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-0 relative my-auto">
        {/* Search Input */}
        <div className="p-4 border-b border-[#282a36] bg-[#16171d] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#0099dd]" />
          <input
            type="text"
            placeholder="Cari tugas, matkul, event kalender, atau database Notion (⌘K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-[#676d80]"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg bg-[#22242f] text-[#8e94a5] hover:text-white text-xs font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4">
          {/* Events */}
          {filteredEvents.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#73798c] uppercase tracking-wider block">
                Jadwal & Kalender ({filteredEvents.length})
              </span>
              {filteredEvents.map((e) => (
                <div
                  key={e.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('kalender');
                  }}
                  className="p-3 rounded-xl bg-[#16171d] hover:bg-[#22242e] border border-[#272935] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#0099dd]" />
                    <div>
                      <p className="text-xs font-bold text-white">{e.title}</p>
                      <p className="text-[10px] text-[#787e91]">{e.date} • {e.time}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#646a7c]" />
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#73798c] uppercase tracking-wider block">
                Tugas & Project ({filteredTasks.length})
              </span>
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('tugas');
                  }}
                  className="p-3 rounded-xl bg-[#16171d] hover:bg-[#22242e] border border-[#272935] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Kanban className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{t.title}</p>
                      <p className="text-[10px] text-[#787e91]">Tenggat: {t.dueDate} • Status: {t.status}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#646a7c]" />
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {filteredNotes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#73798c] uppercase tracking-wider block">
                Catatan ({filteredNotes.length})
              </span>
              {filteredNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('catatan');
                  }}
                  className="p-3 rounded-xl bg-[#16171d] hover:bg-[#22242e] border border-[#272935] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{n.title}</p>
                      <p className="text-[10px] text-[#787e91]">Kategori: {n.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#646a7c]" />
                </div>
              ))}
            </div>
          )}

          {/* Databases */}
          {filteredDatabases.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#73798c] uppercase tracking-wider block">
                Notion Databases ({filteredDatabases.length})
              </span>
              {filteredDatabases.map((db) => (
                <div
                  key={db.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('catatan');
                  }}
                  className="p-3 rounded-xl bg-[#16171d] hover:bg-[#22242e] border border-[#272935] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Table className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{db.title}</p>
                      <p className="text-[10px] text-[#787e91]">{db.rows.length} Total Data Baris</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#646a7c]" />
                </div>
              ))}
            </div>
          )}

          {filteredEvents.length === 0 &&
            filteredTasks.length === 0 &&
            filteredNotes.length === 0 &&
            filteredDatabases.length === 0 && (
              <div className="p-8 text-center text-xs text-[#73798c]">
                Tidak ada hasil ditemukan untuk "{query}".
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
