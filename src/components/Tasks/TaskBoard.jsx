import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Kanban,
  List,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  CheckSquare,
  GripVertical,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export default function TaskBoard() {
  const { tasks, updateTaskStatus, addTask, deleteTask, toggleSubtask, addSubtask, courses } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'priority'
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Drag & drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Akademik');
  const [newPriority, setNewPriority] = useState('Sedang');
  const [newDueDate, setNewDueDate] = useState('2026-09-01');
  const [newDueTime, setNewDueTime] = useState('23:59');
  const [newDesc, setNewDesc] = useState('');
  const [newCourseId, setNewCourseId] = useState('general');

  // Mini Calendar Popover State for Task Form
  const [showDatePickerCalendar, setShowDatePickerCalendar] = useState(false);
  const [pickerMonthIdx, setPickerMonthIdx] = useState(8); // September
  const [pickerYear, setPickerYear] = useState(2026);

  const monthsList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const timeOptions = [
    '23:59', '23:00', '22:00', '21:00', '20:00', '19:00', '18:00',
    '17:00', '16:00', '15:00', '14:00', '13:00', '12:00', '11:00',
    '10:00', '09:00', '08:00', '07:00', '06:00', '00:00'
  ];

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

  // Compute countdown days & color badge (Harmonious & Elegant Colors)
  const getRemainingDaysInfo = (dueDateStr, dueTimeStr, status) => {
    if (status === 'selesai') {
      return { text: 'Selesai ✓', colorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    }
    if (!dueDateStr) return { text: 'Tanpa Tenggat', colorClass: 'bg-[#222430] text-[#8e94a5]' };

    const timeLabel = dueTimeStr ? ` (${dueTimeStr})` : '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Terlewat ${Math.abs(diffDays)} hari${timeLabel}`, colorClass: 'bg-red-500/15 text-red-400 border-red-500/30 font-semibold' };
    } else if (diffDays === 0) {
      return { text: `Hari Ini${timeLabel}`, colorClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-semibold' };
    } else if (diffDays <= 2) {
      return { text: `Sisa ${diffDays} hari${timeLabel}`, colorClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    } else {
      return { text: `Sisa ${diffDays} hari${timeLabel}`, colorClass: 'bg-[#0099dd]/15 text-[#38bdf8] border-[#0099dd]/30' };
    }
  };

  // Filter & Sort Tasks
  let processedTasks = tasks.filter((t) => {
    if (categoryFilter === 'Semua') return true;
    return t.category === categoryFilter;
  });

  if (sortBy === 'deadline') {
    processedTasks.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
  } else if (sortBy === 'priority') {
    const pRank = { Tinggi: 1, Sedang: 2, Rendah: 3 };
    processedTasks.sort((a, b) => pRank[a.priority] - pRank[b.priority]);
  }

  // 2 Columns Only: Belum Selesai vs Sudah Selesai
  const columns = [
    { id: 'belum', title: 'Belum Selesai', color: 'border-[#282a36] bg-[#17181f]' },
    { id: 'selesai', title: 'Sudah Selesai', color: 'border-[#282a36] bg-[#17181f]' }
  ];

  // Drag and drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
      setDraggedTaskId(null);
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate || '2026-09-01',
      dueTime: newDueTime || '23:59',
      description: newDesc,
      courseId: newCourseId,
      status: 'belum',
      subtasks: []
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
    setShowDatePickerCalendar(false);
  };

  // Mini Calendar Popover Days Calculation
  const totalDaysInPickerMonth = new Date(pickerYear, pickerMonthIdx + 1, 0).getDate();
  const pickerFirstDayObj = new Date(pickerYear, pickerMonthIdx, 1);
  const pickerStartDayIdx = (pickerFirstDayObj.getDay() + 6) % 7;
  const pickerDaysList = Array.from({ length: totalDaysInPickerMonth }, (_, i) => i + 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Kanban className="w-5 h-5 text-[#0099dd]" />
            Manajemen Tugas
          </h1>
          <p className="text-xs text-[#8a90a2] mt-0.5">
            Kelola daftar tugas perkuliahan dan agenda pribadi dengan status Belum Selesai & Sudah Selesai.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter Tabs */}
          <div className="flex items-center bg-[#181921] border border-[#272936] rounded-xl p-1 text-xs">
            {['Semua', 'Akademik', 'Pribadi'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  categoryFilter === cat ? 'bg-[#0099dd] text-white font-bold' : 'text-[#7d8396] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#181921] border border-[#272936] rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-[#282a36] text-white font-bold' : 'text-[#7d8396]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-[#282a36] text-white font-bold' : 'text-[#7d8396]'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas</span>
          </button>
        </div>
      </div>

      {/* Add Task Form Modal (Centered Viewport Dialog) */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto my-auto">
          <div className="card-myits bg-[#1b1c23] border-[#2c2e3b] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl space-y-0 relative my-auto">
            <div className="p-4 sm:p-5 border-b border-[#282a36] flex items-center justify-between bg-[#17181f]">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0099dd]" /> Tambah Tugas Baru
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 rounded-lg bg-[#22242e] text-[#8e94a5] hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div>
                <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  placeholder="Contoh: Laporan Praktikum ERP Bab 3..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
                  required
                />
              </div>

              {/* Deadline Date AND Time Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Visual Calendar Date Picker */}
                <div className="relative">
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">
                    Tanggal Tenggat (Deadline) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDatePickerCalendar(!showDatePickerCalendar)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] hover:border-[#0099dd] text-white text-xs font-semibold flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#0099dd]" />
                      <span>{newDueDate || 'Pilih Tanggal...'}</span>
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
                          const isSelected = newDueDate === dateStr;

                          return (
                            <button
                              type="button"
                              key={dNum}
                              onClick={() => {
                                setNewDueDate(dateStr);
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

                {/* Time Picker Dropdown */}
                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">
                    Jam Tenggat (WIB) *
                  </label>
                  <select
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-semibold focus:outline-none focus:border-[#0099dd] cursor-pointer"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t} WIB {t === '23:59' ? '(Tenggat Malam)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-medium cursor-pointer"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Pribadi">Pribadi</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Prioritas</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-medium cursor-pointer"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Mata Kuliah Terkait</label>
                  <select
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-medium cursor-pointer"
                  >
                    <option value="general">Umum / Tanpa Matkul</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#878d9f] font-semibold block mb-1">Deskripsi Tugas</label>
                <textarea
                  placeholder="Catatan detail pengerjaan tugas..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#282a36]">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-myits-secondary text-xs px-5 py-2"
                >
                  Batal
                </button>
                <button type="submit" className="btn-myits-primary text-xs px-6 py-2">
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drag & Drop 2-Column Kanban Columns (Belum Selesai vs Sudah Selesai) */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {columns.map((col) => {
            const colTasks = processedTasks.filter((t) => {
              if (col.id === 'belum') return t.status !== 'selesai';
              return t.status === 'selesai';
            });

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="space-y-4"
              >
                {/* Column Header */}
                <div className="p-4 rounded-2xl border border-[#272935] bg-[#17181f] flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">{col.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#222430] text-[#8e94a5]">
                    {colTasks.length} Tugas
                  </span>
                </div>

                {/* Column Cards Drop Area */}
                <div className="space-y-3 min-h-[420px] p-2 rounded-2xl border border-dashed border-[#262835] bg-[#14151a]/40">
                  {colTasks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#82889a] pt-16">
                      Tidak ada tugas di kolom ini.
                    </div>
                  ) : (
                    colTasks.map((t) => {
                      const remainingInfo = getRemainingDaysInfo(t.dueDate, t.dueTime, t.status);
                      const subtaskCount = t.subtasks?.length || 0;
                      const completedSubtasks = t.subtasks?.filter((st) => st.completed).length || 0;

                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onClick={() => setSelectedTaskDetail(t)}
                          className="card-myits p-4 bg-[#1d1e24] hover:bg-[#23252d] border-[#292a34] space-y-3 group cursor-grab active:cursor-grabbing transition-all rounded-2xl shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-3.5 h-3.5 text-[#646a7c]" />
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  t.priority === 'Tinggi'
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                    : t.priority === 'Sedang'
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                    : 'bg-[#0099dd]/15 text-[#38bdf8] border border-[#0099dd]/30'
                                }`}
                              >
                                Prioritas {t.priority}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(t.id);
                              }}
                              className="text-[#646a7c] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white leading-snug">{t.title}</h4>
                            {t.description && (
                              <p className="text-[11px] text-[#878d9f] mt-1 line-clamp-2">{t.description}</p>
                            )}
                          </div>

                          {/* Subtasks Progress */}
                          {subtaskCount > 0 && (
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[10px] text-[#878d9f]">
                                <span className="flex items-center gap-1">
                                  <CheckSquare className="w-3 h-3 text-[#0099dd]" /> Sub-task
                                </span>
                                <span>
                                  {completedSubtasks}/{subtaskCount}
                                </span>
                              </div>
                              <div className="w-full bg-[#14151a] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#0099dd] h-full transition-all"
                                  style={{ width: `${(completedSubtasks / subtaskCount) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-[#262835] text-[10px]">
                            {/* Countdown Indicator Badge with Time */}
                            <span
                              className={`px-2 py-0.5 rounded border text-[10px] font-semibold flex items-center gap-1 ${remainingInfo.colorClass}`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{remainingInfo.text}</span>
                            </span>

                            {/* Toggle Task Status */}
                            <div className="flex items-center gap-1">
                              {t.status !== 'selesai' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(t.id, 'selesai');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold transition-all"
                                >
                                  Selesai ✓
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(t.id, 'belum');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#222430] text-[#9ea4b5] hover:bg-[#282b3a] text-[10px] font-semibold transition-all"
                                >
                                  Batal Selesai
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="card-myits bg-[#1d1e24] border-[#292a34] divide-y divide-[#262835] overflow-hidden rounded-2xl">
          {processedTasks.map((t) => {
            const remainingInfo = getRemainingDaysInfo(t.dueDate, t.dueTime, t.status);
            return (
              <div
                key={t.id}
                className="p-4 hover:bg-[#23252d] flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateTaskStatus(t.id, t.status === 'selesai' ? 'belum' : 'selesai')}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      t.status === 'selesai' ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[#383b4b]'
                    }`}
                  >
                    {t.status === 'selesai' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${t.status === 'selesai' ? 'line-through text-[#646a7c]' : 'text-white'}`}>
                      {t.title}
                    </h4>
                    {t.description && <p className="text-[11px] text-[#878d9f]">{t.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-semibold flex items-center gap-1 ${remainingInfo.colorClass}`}>
                    <Clock className="w-3 h-3" />
                    <span>{remainingInfo.text}</span>
                  </span>
                  <button onClick={() => deleteTask(t.id)} className="text-[#646a7c] hover:text-red-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Subtasks Detail Modal */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="card-myits bg-[#1b1c23] border-[#2c2e3b] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-[#282a36] pb-3">
              <div>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#0099dd]/20 text-[#38bdf8] font-bold">
                  {selectedTaskDetail.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedTaskDetail.title}</h3>
                <p className="text-[11px] text-[#878d9f] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0099dd]" />
                  <span>Tenggat Waktu: {selectedTaskDetail.dueDate || '-'} {selectedTaskDetail.dueTime ? `jam ${selectedTaskDetail.dueTime} WIB` : ''}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="p-1.5 rounded-lg bg-[#22242e] text-[#8e94a5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtask Manager */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white">Sub-task & Checklist Detail:</h4>

              <div className="space-y-2">
                {(selectedTaskDetail.subtasks || []).map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(selectedTaskDetail.id, st.id)}
                    className="p-2.5 rounded-xl bg-[#16171d] border border-[#272935] flex items-center gap-3 cursor-pointer hover:bg-[#20222d]"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        st.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[#3a3d4f]'
                      }`}
                    >
                      {st.completed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={`text-xs ${st.completed ? 'line-through text-[#646a7c]' : 'text-white'}`}>
                      {st.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add subtask input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addSubtask(selectedTaskDetail.id, newSubtaskInput);
                  setNewSubtaskInput('');
                }}
                className="flex items-center gap-2 pt-2"
              >
                <input
                  type="text"
                  placeholder="+ Tambah item checklist..."
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                />
                <button type="submit" className="btn-myits-primary text-xs px-4 py-2">
                  Tambah
                </button>
              </form>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="btn-myits-secondary text-xs px-5 py-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
