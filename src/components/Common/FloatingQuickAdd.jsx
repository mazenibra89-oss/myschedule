import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Kanban, BookOpen, Calendar, Smile, X } from 'lucide-react';

export default function FloatingQuickAdd() {
  const { setIsQuickAddOpen, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 animate-fade-in">
          {/* Quick Task */}
          <button
            onClick={() => {
              setIsOpen(false);
              setIsQuickAddOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1b1c24] border border-purple-500/40 text-purple-300 text-xs font-semibold shadow-xl hover:scale-105 transition-all"
          >
            <span>Tugas / Project Baru</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Kanban className="w-4 h-4 text-purple-400" />
            </div>
          </button>

          {/* Quick Event */}
          <button
            onClick={() => {
              setIsOpen(false);
              setActiveTab('kalender');
            }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1b1c24] border border-[#0099dd]/40 text-[#38bdf8] text-xs font-semibold shadow-xl hover:scale-105 transition-all"
          >
            <span>Jadwal / Ujian Baru</span>
            <div className="w-7 h-7 rounded-lg bg-[#0099dd]/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#0099dd]" />
            </div>
          </button>

          {/* Quick Note */}
          <button
            onClick={() => {
              setIsOpen(false);
              setActiveTab('catatan');
            }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1b1c24] border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-xl hover:scale-105 transition-all"
          >
            <span>Catatan Notion Baru</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
          </button>

          {/* Quick Mood Log */}
          <button
            onClick={() => {
              setIsOpen(false);
              setActiveTab('personal');
            }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1b1c24] border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-xl hover:scale-105 transition-all"
          >
            <span>Catat Mood & Keuangan</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Smile className="w-4 h-4 text-amber-400" />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
          isOpen
            ? 'bg-red-500 rotate-45 shadow-red-900/40'
            : 'bg-gradient-to-tr from-[#005072] to-[#0099dd] hover:scale-110 shadow-cyan-900/50 animate-glow'
        }`}
        title="Quick Add Entry"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
}
