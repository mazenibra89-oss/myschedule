import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Building2,
  User,
  GraduationCap,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function Beranda() {
  const {
    user,
    setActiveTab,
    tasks,
    courses,
    combinedSchedules,
    updateTaskStatus,
    setSelectedCourseDetail
  } = useApp();

  // Time-based greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Dynamic Today Date Computation (e.g., Jumat, 28 Agustus 2026)
  const daysMapFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthsMapFull = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const now = new Date();
  const currentDayName = daysMapFull[now.getDay()]; // e.g., 'Jumat'
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const formattedTodayDate = `${currentDayName}, ${now.getDate()} ${monthsMapFull[now.getMonth()]} ${now.getFullYear()}`;

  // Filter schedules that actually occur TODAY:
  const todayAgenda = combinedSchedules.filter((item) => {
    // Non-recurring events with a specific date must match today's date
    if (item.date && item.isRecurring === false) {
      return item.date === todayDateStr;
    }
    // Weekly recurring classes match today's day of the week
    return item.day === currentDayName;
  });

  // Calculations for stats
  const totalTasksCount = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status !== 'selesai');

  // Priority Color Helper for Deadline Tasks
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'tinggi':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'sedang':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="card-myits p-5 sm:p-8 bg-[#1c1d23] border-[#292a34] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#878d9f]">
              <span className="px-3 py-1 rounded-full bg-[#22242f] text-[#38bdf8] border border-[#2d303f] font-mono">
                {formattedTodayDate}
              </span>
              <span>•</span>
              <span className="text-[#a0a6b7]">Institut Teknologi Sepuluh Nopember / ITS</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {user.name}!
            </h1>
            <p className="text-xs text-[#8e94a5] max-w-2xl leading-relaxed">
              Second Brain siap mendukung hari kuliahmu. Ada {todayAgenda.length} agenda tersinkron hari ini dan {pendingTasks.length} tugas yang perlu perhatianmu.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Stats Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Tugas Belum Selesai (Mencakup Akademik & Non-Akademik) */}
        <div className="card-myits p-5 bg-[#1d1e24] border-[#292a33] space-y-3 flex flex-col justify-between hover:bg-[#23252d] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#878d9f]">Tugas Belum Selesai</span>
            <span className="px-2 py-0.5 rounded-md bg-[#0099dd]/20 text-[#38bdf8] text-xs font-mono font-bold">
              {pendingTasks.length} Tugas
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">{pendingTasks.length}</span>
              <span className="text-xs text-[#787e91]">/ {totalTasksCount} total tugas</span>
            </div>
            <p className="text-[11px] text-[#38bdf8] font-semibold mt-1">
              Mencakup akademik & non-akademik
            </p>
          </div>
        </div>

        {/* Card 2: Total Jadwal Hari Ini */}
        <div className="card-myits p-5 bg-[#1d1e24] border-[#292a33] space-y-3 flex flex-col justify-between hover:bg-[#23252d] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#878d9f]">Total Jadwal Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">{todayAgenda.length}</span>
              <span className="text-xs text-[#787e91]">jadwal tersinkron</span>
            </div>
            <p className="text-[11px] text-amber-400 font-semibold mt-1">Agenda kuliah & kegiatan</p>
          </div>
        </div>

        {/* Card 3: Total Mata Kuliah */}
        <div className="card-myits p-5 bg-[#1d1e24] border-[#292a33] space-y-3 flex flex-col justify-between hover:bg-[#23252d] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#878d9f]">Total Mata Kuliah</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">{courses.length}</span>
              <span className="text-xs text-[#787e91]">(15 SKS aktif)</span>
            </div>
            <p className="text-[11px] text-purple-400 font-semibold mt-1">Semester 5 Aktif</p>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Left (Jadwal Hari Ini), Right (Deadline Tugas Prioritas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2): Synchronized Today Schedules */}
        <div className="lg:col-span-2 card-myits p-6 bg-[#1d1e24] border-[#292a33] space-y-5">
          <div className="flex items-center justify-between border-b border-[#282a36] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0099dd]/15 text-[#38bdf8] flex items-center justify-center border border-[#0099dd]/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Jadwal & Agenda Hari Ini</h3>
                <p className="text-[11px] text-[#7d8396]">Disusun kronologis menurut jam pelaksanaan</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('jadwal')}
              className="text-xs text-[#0099dd] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Lihat Kalender Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayAgenda.length === 0 ? (
              <div className="p-8 text-center bg-[#171821] rounded-2xl border border-[#272a37] space-y-2">
                <p className="text-sm text-[#878d9f]">Tidak ada agenda tersimpan untuk hari ini.</p>
                <button
                  onClick={() => setActiveTab('jadwal')}
                  className="text-xs text-[#38bdf8] font-semibold hover:underline"
                >
                  Buka Kalender untuk Tambah Jadwal
                </button>
              </div>
            ) : (
              todayAgenda.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="relative flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#171821] hover:bg-[#1f212c] border border-[#272a37] hover:border-[#38bdf8]/40 transition-all rounded-2xl gap-4 group overflow-hidden"
                >
                  {/* Left Colored Accent Bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 transition-all"
                    style={{ backgroundColor: item.color || '#0099dd' }}
                  />

                  {/* Main Content Area */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 pl-2 min-w-0">
                    {/* Time Badge Pill */}
                    <div className="flex sm:flex-col items-center sm:items-start shrink-0 gap-1 bg-[#222432] px-3.5 py-2 rounded-xl border border-[#2d3042] min-w-[130px]">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#38bdf8]">
                        <Clock className="w-3.5 h-3.5 text-[#0099dd]" />
                        <span>{item.time || 'Fleksibel'}</span>
                      </div>
                      <span className="text-[10px] text-[#787e91] font-medium hidden sm:inline">
                        {item.day || currentDayName}
                      </span>
                    </div>

                    {/* Title, Badges & Room Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-white tracking-tight group-hover:text-[#38bdf8] transition-colors">
                          {item.title}
                        </h4>
                        {item.code && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#222430] text-[#a0a6b7] border border-[#2d3040]">
                            {item.code}
                          </span>
                        )}
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{
                            backgroundColor: `${item.color || '#0099dd'}15`,
                            borderColor: `${item.color || '#0099dd'}40`,
                            color: item.color || '#38bdf8'
                          }}
                        >
                          {item.category || 'Akademik'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#8e94a5]">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#0099dd]" />
                          <span className="font-medium text-[#c4c9d8]">{item.location}</span>
                        </div>
                        {item.lecturer && (
                          <div className="flex items-center gap-1.5 text-[#888e9f]">
                            <User className="w-3.5 h-3.5 text-[#73798c]" />
                            <span className="truncate max-w-[220px]">{item.lecturer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detail Action Button */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-2">
                    <button
                      onClick={() => {
                        if (item.originalCourse) {
                          setSelectedCourseDetail(item.originalCourse);
                        } else {
                          setSelectedCourseDetail(item);
                        }
                      }}
                      className="btn-myits-secondary text-xs px-4 py-2 font-semibold text-[#e1e4ef] hover:text-white flex items-center gap-1.5 hover:bg-[#282b3a]"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#0099dd]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (Span 1): Deadline Tugas Prioritas */}
        <div className="card-myits p-6 bg-[#1d1e24] border-[#292a33] space-y-5">
          <div className="flex items-center justify-between border-b border-[#282a36] pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#38bdf8]" />
              <h3 className="text-base font-bold text-white">Deadline Tugas</h3>
            </div>
            <button
              onClick={() => setActiveTab('tugas')}
              className="text-xs text-[#0099dd] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#787e91] bg-[#17181f] rounded-xl">
                Semua tugas telah diselesaikan 🎉
              </div>
            ) : (
              pendingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => updateTaskStatus(t.id, 'selesai')}
                  className="p-3.5 rounded-2xl bg-[#17181f] border border-[#272935] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#20222d] hover:border-[#38bdf8]/30 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full border border-[#3a3d4f] flex items-center justify-center shrink-0 group-hover:border-[#0099dd] group-hover:bg-[#0099dd]/20 transition-all"
                      title="Tandai Selesai"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-[#38bdf8] transition-colors">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#7d8396]">
                        <span
                          className={`px-1.5 py-0.2 rounded border font-semibold ${getPriorityBadgeClass(
                            t.priority
                          )}`}
                        >
                          {t.priority || 'Normal'}
                        </span>
                        <span>•</span>
                        <span className="truncate">{t.category || 'Akademik'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#222430] border border-[#2e3142] text-[10px] font-mono font-semibold text-[#38bdf8] shrink-0">
                    {t.dueDate}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
