import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Kanban, BookOpen, Plus } from 'lucide-react';

export default function QuickAddModal() {
  const { isQuickAddOpen, setIsQuickAddOpen, addTask, addNote, setActiveTab } = useApp();
  const [addType, setAddType] = useState('task'); // 'task' | 'note'

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Akademik');
  const [priority, setPriority] = useState('Sedang');
  const [dueDate, setDueDate] = useState('');
  const [desc, setDesc] = useState('');

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (addType === 'task') {
      addTask({
        title,
        category,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        description: desc,
        courseId: 'general'
      });
      setActiveTab('tugas');
    } else {
      addNote({
        title,
        category: category || 'Kuliah',
        iconType: 'book',
        blocks: [
          { id: 'b1', type: 'h2', content: 'Ringkasan Catatan' },
          { id: 'b2', type: 'text', content: desc || 'Konten catatan baru...' }
        ]
      });
      setActiveTab('catatan');
    }

    setTitle('');
    setDesc('');
    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto my-auto">
      <div className="card-myits bg-[#1b1c24] border-[#2d2f3e] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl space-y-0 relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#282a36] bg-[#16171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#0099dd]" />
            <h3 className="text-base font-bold text-white">Quick Add Entry</h3>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1.5 rounded-xl bg-[#22242e] text-[#8e94a5] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Toggle Tabs */}
        <div className="p-3 sm:p-4 bg-[#14151a] border-b border-[#272935] flex gap-3">
          <button
            onClick={() => setAddType('task')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              addType === 'task'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-[#1e2029] text-[#82889a] border-[#292c3a]'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Tugas / Project</span>
          </button>

          <button
            onClick={() => setAddType('note')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              addType === 'note'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#1e2029] text-[#82889a] border-[#292c3a]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Catatan Notion</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-[#82889a] block mb-1">
              Judul {addType === 'task' ? 'Tugas' : 'Catatan'}
            </label>
            <input
              type="text"
              placeholder={addType === 'task' ? 'Contoh: Quiz Matkul ASD' : 'Contoh: Ringkasan Bab 4 ERP'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
              required
            />
          </div>

          {addType === 'task' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#82889a] block mb-1">Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                >
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#82889a] block mb-1">Tanggal Tenggat</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#82889a] block mb-1">Deskripsi / Catatan Singkat</label>
            <textarea
              placeholder="Tambahkan detail rincian di sini..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="btn-myits-secondary text-xs px-4"
            >
              Batal
            </button>
            <button type="submit" className="btn-myits-primary text-xs px-5">
              Simpan & Buka
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
