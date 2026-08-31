import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Bell, Calendar, Menu } from 'lucide-react';

export default function Header() {
  const { activeTab, user, setIsSearchOpen, setIsQuickAddOpen, setActiveTab, setIsMobileDrawerOpen } = useApp();

  const getTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return 'Beranda';
      case 'jadwal':
      case 'kalender':
        return 'Jadwal & Kegiatan';
      case 'tugas':
        return 'Manajemen Tugas';
      case 'catatan':
        return 'Catatan';
      case 'personal':
        return 'Kebutuhan Pribadi';
      case 'personalisasi':
        return 'Personalisasi & Pengaturan';
      default:
        return 'My Schedule Workspace';
    }
  };

  const getTodayFormatted = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('id-ID', options);
  };

  return (
    <header className="h-16 border-b border-[#23252f] bg-[#141518]/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Left Title & Mobile Hamburger Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="md:hidden p-2 rounded-xl bg-[#1d1f27] text-[#9da3b4] hover:text-white border border-[#2c2f3d]"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-xl font-bold text-white tracking-tight truncate max-w-[160px] sm:max-w-none">
          {getTitle()}
        </h1>

        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2029] border border-[#2b2e3a] text-xs text-[#9da3b4]">
          <Calendar className="w-3.5 h-3.5 text-[#0099dd]" />
          <span>{getTodayFormatted()}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#1d1f27] hover:bg-[#252833] border border-[#2c2f3d] text-xs text-[#8e94a6] transition-all"
        >
          <Search className="w-4 h-4 text-[#9da3b4]" />
          <span className="hidden md:inline">Cari tugas, matkul, atau catatan...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#282a36] text-[#b0b6c6] rounded border border-[#393c4d]">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah</span>
        </button>

        {/* Notification indicator */}
        <button className="p-2 rounded-xl bg-[#1d1f27] hover:bg-[#252833] border border-[#2c2f3d] text-[#9da3b4] hover:text-white transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setActiveTab('personalisasi')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] p-0.5 cursor-pointer shadow-md shadow-blue-900/30 hover:scale-105 transition-all shrink-0"
          title={user.name}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover border border-[#1e2029]"
          />
        </div>
      </div>
    </header>
  );
}
