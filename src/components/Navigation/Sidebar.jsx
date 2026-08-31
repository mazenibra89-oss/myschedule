import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  FileText,
  Settings,
  Kanban,
  Calendar,
  PanelLeftClose,
  PanelLeft,
  X,
  User
} from 'lucide-react';

export default function Sidebar() {
  const {
    user,
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    tasks,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen
  } = useApp();

  const isTabActive = (tabName) => activeTab === tabName;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'selesai').length;

  const handleMobileNavClick = (tabName) => {
    setActiveTab(tabName);
    setIsMobileDrawerOpen(false);
  };

  const navContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-[#22242d] flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleMobileNavClick('beranda')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#005072] to-[#0099dd] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-900/30 shrink-0">
            S
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div>
              <div className="flex items-baseline font-bold text-white tracking-wide text-lg">
                My <span className="text-[#0099dd] ml-1">Schedule</span>
              </div>
              <div className="text-[11px] text-[#8e94a5] font-medium -mt-1 tracking-wider">Workspace & Tasks</div>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg bg-[#20222b] text-[#878d9f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg bg-[#20222b] hover:bg-[#2a2d3b] text-[#878d9f] hover:text-white transition-all shrink-0"
            title={isSidebarCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#646a7c] uppercase">
              Menu Utama
            </div>
          )}
          <nav className="space-y-1">
            {/* Beranda */}
            <button
              onClick={() => handleMobileNavClick('beranda')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isTabActive('beranda')
                  ? 'bg-[#00425a] text-[#38bdf8] font-semibold border-l-4 border-[#0099dd]'
                  : 'text-[#9da3b4] hover:bg-[#1f2027] hover:text-white'
              }`}
              title="Beranda"
            >
              <Home className="w-4 h-4 shrink-0" />
              {(!isSidebarCollapsed || isMobile) && <span>Beranda</span>}
            </button>

            {/* Jadwal */}
            <button
              onClick={() => handleMobileNavClick('jadwal')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isTabActive('jadwal') || isTabActive('kalender')
                  ? 'bg-[#00425a] text-[#38bdf8] font-semibold border-l-4 border-[#0099dd]'
                  : 'text-[#9da3b4] hover:bg-[#1f2027] hover:text-white'
              }`}
              title="Jadwal"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#0099dd] shrink-0" />
                {(!isSidebarCollapsed || isMobile) && <span>Jadwal & Agenda</span>}
              </div>
            </button>

            {/* Tugas & Kanban */}
            <button
              onClick={() => handleMobileNavClick('tugas')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isTabActive('tugas')
                  ? 'bg-[#00425a] text-[#38bdf8] font-semibold border-l-4 border-[#0099dd]'
                  : 'text-[#9da3b4] hover:bg-[#1f2027] hover:text-white'
              }`}
              title="Manajemen Tugas"
            >
              <div className="flex items-center gap-3">
                <Kanban className="w-4 h-4 text-purple-400 shrink-0" />
                {(!isSidebarCollapsed || isMobile) && <span>Manajemen Tugas</span>}
              </div>
              {(!isSidebarCollapsed || isMobile) && pendingTasksCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* Catatan */}
            <button
              onClick={() => handleMobileNavClick('catatan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isTabActive('catatan')
                  ? 'bg-[#00425a] text-[#38bdf8] font-semibold border-l-4 border-[#0099dd]'
                  : 'text-[#9da3b4] hover:bg-[#1f2027] hover:text-white'
              }`}
              title="Catatan"
            >
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              {(!isSidebarCollapsed || isMobile) && <span>Catatan Kuliah</span>}
            </button>
          </nav>
        </div>

        {/* Settings */}
        <div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#646a7c] uppercase">
              Pengaturan
            </div>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => handleMobileNavClick('personalisasi')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isTabActive('personalisasi')
                  ? 'bg-[#00425a] text-[#38bdf8] font-semibold border-l-4 border-[#0099dd]'
                  : 'text-[#9da3b4] hover:bg-[#1f2027] hover:text-white'
              }`}
              title="Personalisasi"
            >
              <Settings className="w-4 h-4 shrink-0" />
              {(!isSidebarCollapsed || isMobile) && <span>Personalisasi</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Profile Preview */}
      <div className="p-3 border-t border-[#22242d] bg-[#141518]">
        <div
          onClick={() => handleMobileNavClick('personalisasi')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1f2028] cursor-pointer transition-all"
        >
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-[#3b3e4d] shrink-0"
          />
          {(!isSidebarCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#787e91] truncate">{user.nrp}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <aside
        className={`hidden md:flex ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#16171b] border-r border-[#262831] flex-col h-screen sticky top-0 select-none z-20 transition-all duration-300 shrink-0`}
      >
        {navContent(false)}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer (Slide-Over from Left) */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* Dark Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Sidebar Box */}
          <div className="relative w-72 max-w-[85vw] bg-[#16171b] h-full shadow-2xl z-10 flex flex-col border-r border-[#262831]">
            {navContent(true)}
          </div>
        </div>
      )}

      {/* 3. Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16171d]/95 backdrop-blur-lg border-t border-[#262833] flex items-center justify-around py-2 px-1 shadow-2xl">
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isTabActive('beranda') ? 'text-[#38bdf8] font-bold' : 'text-[#787e91]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isTabActive('jadwal') || isTabActive('kalender') ? 'text-[#38bdf8] font-bold' : 'text-[#787e91]'
          }`}
        >
          <Calendar className="w-5 h-5 text-[#0099dd]" />
          <span className="text-[10px]">Jadwal</span>
        </button>

        <button
          onClick={() => setActiveTab('tugas')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
            isTabActive('tugas') ? 'text-[#38bdf8] font-bold' : 'text-[#787e91]'
          }`}
        >
          <Kanban className="w-5 h-5 text-purple-400" />
          <span className="text-[10px]">Tugas</span>
          {pendingTasksCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-purple-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('catatan')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isTabActive('catatan') ? 'text-[#38bdf8] font-bold' : 'text-[#787e91]'
          }`}
        >
          <FileText className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px]">Catatan</span>
        </button>

        <button
          onClick={() => setActiveTab('personalisasi')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isTabActive('personalisasi') ? 'text-[#38bdf8] font-bold' : 'text-[#787e91]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </button>
      </div>
    </>
  );
}
