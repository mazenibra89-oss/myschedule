import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  User,
  Plus,
  X,
  Repeat,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AcademicCalendar() {
  const { scheduleEvents, addScheduleEvent, courses, combinedSchedules, setSelectedCourseDetail } = useApp();
  const [activeFilter, setActiveFilter] = useState('semua'); // 'semua' | 'akademik' | 'kegiatan'
  const [viewMode, setViewMode] = useState('mingguan'); // 'hari-ini' | 'mingguan' | 'bulanan'
  
  // Dynamic Month & Year Navigation State (Default: Current Month & Year)
  const nowObj = new Date();
  const [currentMonthIdx, setCurrentMonthIdx] = useState(nowObj.getMonth());
  const [currentYear, setCurrentYear] = useState(nowObj.getFullYear());

  // Dynamic Week Offset State for Mingguan View (0 = Current Week, -1 = Prev Week, +1 = Next Week)
  const [weekOffset, setWeekOffset] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding New Schedule
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Kegiatan'); // Default KEGIATAN
  const [newDate, setNewDate] = useState('2026-08-28'); // Selected Date
  const [showDatePickerCalendar, setShowDatePickerCalendar] = useState(false); // Mini Calendar Popover Toggle
  const [pickerMonthIdx, setPickerMonthIdx] = useState(nowObj.getMonth());
  const [pickerYear, setPickerYear] = useState(nowObj.getFullYear());

  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newLocation, setNewLocation] = useState(''); // Default EMPTY
  const [newLecturer, setNewLecturer] = useState('');
  const [newSks, setNewSks] = useState('3');
  const [newColor, setNewColor] = useState('#0099dd');
  const [newNote, setNewNote] = useState('');
  const [isRecurring, setIsRecurring] = useState(false); // Default FALSE

  const monthsList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysMap = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Helper: compute Day Name from Date String
  const computeDayName = (dateStr) => {
    if (!dateStr) return 'Senin';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Senin';
    return daysMap[(d.getDay() + 6) % 7];
  };

  const timeOptions = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00'
  ];

  // Helper: Calculate Mon-Sun Date Range for Week Navigation
  const getWeekRange = (offset = 0) => {
    const today = new Date();
    const dayIdx = (today.getDay() + 6) % 7; // Monday = 0
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayIdx + offset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    return { monday, sunday, weekDates };
  };

  // Month navigation handlers for Main Monthly View
  const handlePrevMonth = () => {
    if (currentMonthIdx === 0) {
      setCurrentMonthIdx(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIdx(currentMonthIdx - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIdx === 11) {
      setCurrentMonthIdx(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIdx(currentMonthIdx + 1);
    }
  };

  // Month navigation handlers for Mini Date Picker Popover
  const handlePrevPickerMonth = () => {
    if (pickerMonthIdx === 0) {
      setPickerMonthIdx(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonthIdx(pickerMonthIdx - 1);
    }
  };

  const handleNextPickerMonth = () => {
    if (pickerMonthIdx === 11) {
      setPickerMonthIdx(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonthIdx(pickerMonthIdx + 1);
    }
  };

  // Handle Submitting New Schedule Item
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let formattedTime = 'Fleksibel / Tanpa Jam';
    if (newStartTime && newEndTime) {
      formattedTime = `${newStartTime} - ${newEndTime}`;
    } else if (newStartTime) {
      formattedTime = `${newStartTime}`;
    }

    const calculatedDay = computeDayName(newDate);

    addScheduleEvent({
      title: newTitle,
      category: newCategory,
      date: newDate,
      day: calculatedDay,
      time: formattedTime,
      location: newLocation.trim() || 'Fleksibel / Daring',
      room: newLocation.trim() || 'Fleksibel / Daring',
      lecturer: newCategory === 'Akademik' ? newLecturer : '',
      sks: newCategory === 'Akademik' ? newSks : '',
      color: newColor,
      note: newNote,
      isRecurring: isRecurring
    });

    // Reset Form
    setNewTitle('');
    setNewCategory('Kegiatan');
    setNewDate('2026-08-28');
    setNewStartTime('');
    setNewEndTime('');
    setNewLocation('');
    setNewLecturer('');
    setNewNote('');
    setIsRecurring(false);
    setShowAddModal(false);
    setShowDatePickerCalendar(false);
  };

  const filteredSchedules = combinedSchedules.filter((item) => {
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'akademik') {
      const cat = (item.category || '').toLowerCase();
      return cat.includes('akademik') || cat.includes('kuliah') || cat.includes('praktikum');
    }
    if (activeFilter === 'kegiatan') {
      const cat = (item.category || '').toLowerCase();
      return cat.includes('kegiatan') || cat.includes('ujian') || cat.includes('workshop');
    }
    return true;
  });

  const now = new Date();
  const currentDayName = daysMap[(now.getDay() + 6) % 7];
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Today's schedules matching today's dynamic day & date
  const todaySchedules = filteredSchedules.filter((item) => {
    if (item.date && item.isRecurring === false) {
      return item.date === todayDateStr;
    }
    return item.day === currentDayName;
  });

  // Dynamic Calendar Date Calculation for Selected Month & Year (Main View)
  const totalDaysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const firstDayObj = new Date(currentYear, currentMonthIdx, 1);
  const startDayIdx = (firstDayObj.getDay() + 6) % 7; // Monday = 0, ..., Sunday = 6
  const calendarDaysList = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Mini Calendar Popover Days Calculation
  const totalDaysInPickerMonth = new Date(pickerYear, pickerMonthIdx + 1, 0).getDate();
  const pickerFirstDayObj = new Date(pickerYear, pickerMonthIdx, 1);
  const pickerStartDayIdx = (pickerFirstDayObj.getDay() + 6) % 7;
  const pickerDaysList = Array.from({ length: totalDaysInPickerMonth }, (_, i) => i + 1);

  // Weekly Navigation Range Details
  const { monday: weekMonday, sunday: weekSunday, weekDates } = getWeekRange(weekOffset);
  const formatShortDate = (d) => `${d.getDate()} ${monthsList[d.getMonth()].slice(0, 3)}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-[#0099dd]" />
            Jadwal Perkuliahan & Kegiatan
          </h1>
          <p className="text-xs text-[#8a90a2] mt-0.5">
            Kelola jadwal akademik dan kegiatan kampus dalam mode Hari Ini, Mingguan, atau Bulanan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Button Open Add Schedule Modal */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jadwal</span>
          </button>

          {/* View Mode Filter Tabs (Hari Ini, Mingguan, Bulanan) */}
          <div className="flex items-center bg-[#181921] border border-[#272936] rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('hari-ini')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'hari-ini' ? 'bg-[#0099dd] text-white font-bold' : 'text-[#7d8396] hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setViewMode('mingguan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'mingguan' ? 'bg-[#0099dd] text-white font-bold' : 'text-[#7d8396] hover:text-white'
              }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setViewMode('bulanan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'bulanan' ? 'bg-[#0099dd] text-white font-bold' : 'text-[#7d8396] hover:text-white'
              }`}
            >
              Bulanan (Kalender)
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-[#181921] border border-[#272936] rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveFilter('semua')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeFilter === 'semua' ? 'bg-[#282a36] text-white font-bold' : 'text-[#7d8396]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFilter('akademik')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeFilter === 'akademik' ? 'bg-purple-600/30 text-purple-300 font-bold' : 'text-[#7d8396]'
              }`}
            >
              Akademik
            </button>
            <button
              onClick={() => setActiveFilter('kegiatan')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeFilter === 'kegiatan' ? 'bg-emerald-600/30 text-emerald-300 font-bold' : 'text-[#7d8396]'
              }`}
            >
              Kegiatan
            </button>
          </div>
        </div>
      </div>

      {/* Add Schedule Modal Dialog (Fixed Viewport Center Overlay) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in my-auto">
          <div className="card-myits bg-[#1b1c23] border-[#2c2e3b] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-0 relative">
            <div className="p-5 border-b border-[#282a36] flex items-center justify-between bg-[#17181f]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0099dd]" /> Tambah Jadwal Kuliah / Kegiatan Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-[#22242e] text-[#8e94a5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div>
                <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">
                  Judul Jadwal / Mata Kuliah *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Perancangan Basis Data (A)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-medium cursor-pointer"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Akademik">Akademik</option>
                  </select>
                </div>

                {/* Custom Interactive Visual Calendar Picker Input */}
                <div className="relative">
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">
                    Pilih Tanggal Pelaksanaan *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDatePickerCalendar(!showDatePickerCalendar)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] hover:border-[#0099dd] text-white text-xs font-semibold flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#0099dd]" />
                      <span>
                        {computeDayName(newDate)}, {newDate}
                      </span>
                    </span>
                    <span className="text-[10px] text-[#0099dd] underline font-semibold">Pilih Tanggal</span>
                  </button>

                  {/* Visual Mini Calendar Popover Grid */}
                  {showDatePickerCalendar && (
                    <div className="absolute right-0 top-16 z-50 w-72 p-4 rounded-2xl bg-[#181922] border border-[#2c2e3d] shadow-2xl space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-[#272938] pb-2">
                        <button
                          type="button"
                          onClick={handlePrevPickerMonth}
                          className="p-1 rounded-lg bg-[#20222e] text-[#9ea4b5] hover:text-white"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white">
                          {monthsList[pickerMonthIdx]} {pickerYear}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextPickerMonth}
                          className="p-1 rounded-lg bg-[#20222e] text-[#9ea4b5] hover:text-white"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#878d9f]">
                        <div>Sen</div>
                        <div>Sel</div>
                        <div>Rab</div>
                        <div>Kam</div>
                        <div>Jum</div>
                        <div className="text-purple-400">Sab</div>
                        <div className="text-red-400">Min</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: pickerStartDayIdx }).map((_, idx) => (
                          <div key={'blank_' + idx} className="h-7 rounded-lg bg-transparent"></div>
                        ))}

                        {pickerDaysList.map((dNum) => {
                          const dateStr = `${pickerYear}-${String(pickerMonthIdx + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
                          const isSelected = newDate === dateStr;

                          return (
                            <button
                              type="button"
                              key={dNum}
                              onClick={() => {
                                setNewDate(dateStr);
                                setShowDatePickerCalendar(false);
                              }}
                              className={`h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#0099dd] text-white shadow-md'
                                  : 'bg-[#1e202b] text-[#d6dae6] hover:bg-[#0099dd]/30 hover:text-white'
                              }`}
                            >
                              {dNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Dropdown Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">
                    Jam Mulai <span className="text-[#646a7c] font-normal">(Pilih Jam)</span>
                  </label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-semibold focus:outline-none focus:border-[#0099dd] cursor-pointer"
                  >
                    <option value="">-- Pilih Jam Mulai --</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t} WIB
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">
                    Jam Selesai <span className="text-[#646a7c] font-normal">(Pilih Jam)</span>
                  </label>
                  <select
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-semibold focus:outline-none focus:border-[#0099dd] cursor-pointer"
                  >
                    <option value="">-- Pilih Jam Selesai --</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t} WIB
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Row: Show Dosen & SKS ONLY if Category is Akademik */}
              {newCategory === 'Akademik' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Ruang / Lokasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: SI 4202"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Dosen Pengampu</label>
                    <input
                      type="text"
                      placeholder="Dr. Ir. Suprapedi, M.Kom"
                      value={newLecturer}
                      onChange={(e) => setNewLecturer(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Jumlah SKS</label>
                    <input
                      type="text"
                      placeholder="3"
                      value={newSks}
                      onChange={(e) => setNewSks(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Ruang / Tempat / Lokasi Kegiatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Auditorium Tower ITS / Co-Working Space"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                  />
                </div>
              )}

              {/* Recurring Weekly Schedule Toggle (DEFAULT FALSE) */}
              <div
                onClick={() => setIsRecurring(!isRecurring)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#14151a] border border-[#272936] cursor-pointer hover:bg-[#1a1c24] transition-all"
              >
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 rounded border-[#3a3d4e] accent-[#0099dd] cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-[#0099dd]" /> Jadwal Rutin Setiap Minggu
                  </p>
                  <p className="text-[10px] text-[#878d9f] mt-0.5">
                    Otomatis terencana untuk minggu-minggu berikutnya (Setiap hari {computeDayName(newDate)})
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Catatan Tambahan / Deskripsi</label>
                <textarea
                  placeholder="Instruksi tambahan, materi, atau perlengkapan yang wajib dibawa..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                />
              </div>

              {/* Color Tag Selector */}
              <div>
                <label className="text-[11px] text-[#878d9f] font-semibold block mb-1.5">Pilih Warna Label Accent</label>
                <div className="flex items-center gap-3">
                  {['#0099dd', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${
                        newColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#282a36]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-myits-secondary text-xs px-5 py-2"
                >
                  Batal
                </button>
                <button type="submit" className="btn-myits-primary text-xs px-6 py-2">
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mode 1: HARI INI */}
      {viewMode === 'hari-ini' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide pt-2">
            {currentDayName}, {now.getDate()} {monthsList[now.getMonth()]} {now.getFullYear()}
          </h3>

          {todaySchedules.length === 0 ? (
            <div className="card-myits p-8 bg-[#1d1e24] border-[#292a34] text-center text-xs text-[#82889a]">
              Tidak ada agenda perkuliahan atau kegiatan untuk hari ini.
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((item, idx) => (
                <div
                  key={idx}
                  className="card-myits p-4 py-3.5 bg-[#1d1e24] hover:bg-[#23252d] border-[#292a34] transition-all rounded-2xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#9ea4b5] pt-1.5">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#818798]" />
                          <span>{item.day || currentDayName}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#818798]" />
                          <span>{item.time || 'Fleksibel'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#818798]" />
                          <span>{item.location}</span>
                        </div>

                        {item.lecturer && (
                          <div className="flex items-center gap-1.5 text-[#82889a]">
                            <User className="w-3.5 h-3.5 text-[#818798]" />
                            <span className="truncate">{item.lecturer}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedCourseDetail(item)}
                        className="btn-myits-secondary text-xs px-4 py-2 font-semibold text-[#e1e4ef] shadow-sm hover:text-white"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: MINGGUAN (Dynamic Active Week Filter & Navigation) */}
      {viewMode === 'mingguan' && (
        <div className="space-y-5">
          {/* Week Navigation Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1d1e24] p-4 rounded-2xl border border-[#292a34]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="px-3 py-1.5 rounded-xl bg-[#16171d] hover:bg-[#232530] text-[#9ea4b5] hover:text-white border border-[#282a36] text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Pekan Lalu
              </button>
              {weekOffset !== 0 && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="px-3 py-1.5 rounded-xl bg-[#0099dd]/20 text-[#38bdf8] border border-[#0099dd]/40 text-xs font-bold transition-all"
                >
                  Pekan Ini
                </button>
              )}
            </div>

            <span className="text-xs font-bold text-white tracking-wide">
              {weekOffset === 0
                ? `Pekan Ini (${formatShortDate(weekMonday)} - ${formatShortDate(weekSunday)} ${weekSunday.getFullYear()})`
                : `Pekan ${formatShortDate(weekMonday)} - ${formatShortDate(weekSunday)} ${weekSunday.getFullYear()}`}
            </span>

            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="px-3 py-1.5 rounded-xl bg-[#16171d] hover:bg-[#232530] text-[#9ea4b5] hover:text-white border border-[#282a36] text-xs font-semibold flex items-center gap-1 transition-all"
            >
              Pekan Depan <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grouped Schedules for Active Week */}
          <div className="space-y-6">
            {weekDates.map((dObj, dIdx) => {
              const dayName = daysMap[dIdx];
              const dateStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;

              // Filter schedule items for this specific day of the active week
              const dayItems = filteredSchedules.filter((item) => {
                if (item.day !== dayName) return false;
                if (item.date && item.isRecurring === false) {
                  return item.date === dateStr;
                }
                return true; // Recurring items appear every week
              });

              if (dayItems.length === 0) return null;

              return (
                <div key={dayName} className="space-y-3">
                  {/* Day Header with Exact Date */}
                  <h3 className="text-base font-bold text-white tracking-wide pt-2 flex items-center gap-2">
                    <span>{dayName}</span>
                    <span className="text-xs text-[#7d8396] font-normal">
                      ({formatShortDate(dObj)})
                    </span>
                  </h3>

                  {/* Compact Course Cards */}
                  <div className="space-y-3">
                    {dayItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="card-myits p-4 py-3.5 bg-[#1d1e24] hover:bg-[#23252d] border-[#292a34] transition-all rounded-2xl"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-white tracking-wide">
                              {item.title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9ea4b5] pt-1.5">
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#818798]" />
                                <span>{item.day || 'Senin'}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#818798]" />
                                <span>{item.time || 'Fleksibel'}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#818798]" />
                                <span>{item.location}</span>
                              </div>

                              {item.lecturer && (
                                <div className="flex items-center gap-1.5 text-[#82889a]">
                                  <User className="w-3.5 h-3.5 text-[#818798]" />
                                  <span className="truncate">{item.lecturer}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                            <button
                              onClick={() => setSelectedCourseDetail(item)}
                              className="btn-myits-secondary text-xs px-4 py-2 font-semibold text-[#e1e4ef] shadow-sm hover:text-white"
                            >
                              Lihat Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: BULANAN (Kalender Bulanan Grid Full Dynamic & Tersinkron) */}
      {viewMode === 'bulanan' && (
        <div className="card-myits p-6 bg-[#1d1e24] border-[#292a33] space-y-5">
          {/* Header Month & Year Selector Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282a36] pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0099dd]" />
                Kalender Bulanan - {monthsList[currentMonthIdx]} {currentYear}
              </h3>
              <p className="text-[11px] text-[#878d9f] mt-0.5">
                Jadwal otomatis tersinkron berdasarkan tanggal & hari pelaksanaan perkuliahan / kegiatan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-[#16171d] hover:bg-[#232530] text-[#9ea4b5] hover:text-white border border-[#282a36] transition-all"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Month Dropdown Selector */}
              <select
                value={currentMonthIdx}
                onChange={(e) => setCurrentMonthIdx(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-[#16171d] border border-[#282a36] text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {monthsList.map((mName, mIdx) => (
                  <option key={mIdx} value={mIdx}>
                    {mName}
                  </option>
                ))}
              </select>

              {/* Year Dropdown Selector */}
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-[#16171d] border border-[#282a36] text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-[#16171d] hover:bg-[#232530] text-[#9ea4b5] hover:text-white border border-[#282a36] transition-all"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header Row */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#878d9f]">
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div className="text-purple-400">Sab</div>
            <div className="text-red-400">Min</div>
          </div>

          {/* Dynamic Calendar Dates Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading days for starting day alignment */}
            {Array.from({ length: startDayIdx }).map((_, idx) => (
              <div key={'blank_' + idx} className="h-28 rounded-xl bg-[#14151b]/40 border border-[#222430]"></div>
            ))}

            {/* Date Cells */}
            {calendarDaysList.map((dNum) => {
              const todayObj = new Date();
              const isToday =
                dNum === todayObj.getDate() &&
                currentMonthIdx === todayObj.getMonth() &&
                currentYear === todayObj.getFullYear();

              // Construct Date String YYYY-MM-DD
              const cellDateStr = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;

              // Find exact day name for this date cell
              const dateObj = new Date(currentYear, currentMonthIdx, dNum);
              const cellDayName = daysMap[(dateObj.getDay() + 6) % 7];

              // Filter schedules matching this date or recurring day
              const dateSchedules = filteredSchedules.filter((s) => {
                if (s.date && s.date === cellDateStr) return true;
                if (s.isRecurring !== false && s.day === cellDayName) return true;
                return false;
              });

              return (
                <div
                  key={dNum}
                  className={`h-28 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-[#0099dd]/15 border-[#0099dd]'
                      : 'bg-[#16171e] border-[#272935] hover:bg-[#20222d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isToday ? 'text-[#38bdf8] font-extrabold' : 'text-white'
                      }`}
                    >
                      {dNum}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0099dd] text-white">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Synchronized Schedule Item Pills */}
                  <div className="space-y-1 overflow-y-auto max-h-[72px] pr-0.5 pt-1">
                    {dateSchedules.map((sItem, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => setSelectedCourseDetail(sItem)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-semibold truncate cursor-pointer transition-all hover:opacity-90 shadow-sm flex items-center justify-between"
                        style={{
                          backgroundColor: `${sItem.color || '#0099dd'}25`,
                          color: sItem.color || '#38bdf8',
                          border: `1px solid ${sItem.color || '#0099dd'}50`
                        }}
                        title={`${sItem.title} (${sItem.time || 'Fleksibel'})`}
                      >
                        <span className="truncate">{sItem.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
