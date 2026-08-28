import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Building2,
  User,
  FileText,
  Trash2,
  Repeat
} from 'lucide-react';

export default function CourseDetailModal() {
  const { selectedCourseDetail, setSelectedCourseDetail, deleteScheduleEvent } = useApp();

  if (!selectedCourseDetail) return null;

  const item = selectedCourseDetail;

  const handleClose = () => setSelectedCourseDetail(null);

  const handleDelete = () => {
    if (item.id) {
      const targetId = item.eventId || String(item.id).replace(/^event_/, '');
      deleteScheduleEvent(targetId);
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card-myits bg-[#1b1c23] border-[#2c2e3b] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-0">
        {/* Header Bar */}
        <div className="p-6 border-b border-[#282a36] flex items-start justify-between bg-[#17181f]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#222430] text-[#a0a6b7]">
                {item.category || 'Akademik'}
              </span>
              {item.isRecurring !== false && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Repeat className="w-3 h-3" /> Rutin Setiap {item.day || 'Minggu'}
                </span>
              )}
              {item.category !== 'Kegiatan' && item.sks && (
                <span className="text-xs text-[#828899] font-medium">{item.sks} SKS</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">{item.title || item.name}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-[#22242e] hover:bg-[#2c2f3d] text-[#8e94a5] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#16171d] border border-[#272935] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#82889a]">
                <Calendar className="w-4 h-4 text-[#0099dd]" />
                <span>Hari Pelaksanaan</span>
              </div>
              <p className="text-sm font-semibold text-white">{item.day || 'Senin'}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#16171d] border border-[#272935] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#82889a]">
                <Clock className="w-4 h-4 text-[#0099dd]" />
                <span>Waktu / Jam</span>
              </div>
              <p className="text-sm font-semibold text-white">{item.time || 'Fleksibel / Tanpa Jam'}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#16171d] border border-[#272935] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#82889a]">
                <Building2 className="w-4 h-4 text-[#0099dd]" />
                <span>Lokasi / Tempat</span>
              </div>
              <p className="text-sm font-semibold text-white">{item.location || item.room || '-'}</p>
            </div>

            {item.category !== 'Kegiatan' && item.lecturer && (
              <div className="p-4 rounded-xl bg-[#16171d] border border-[#272935] space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#82889a]">
                  <User className="w-4 h-4 text-[#0099dd]" />
                  <span>Dosen Pengampu</span>
                </div>
                <p className="text-sm font-semibold text-white">{item.lecturer}</p>
              </div>
            )}
          </div>

          {/* Description & Notes Box */}
          {(item.note || item.description) && (
            <div className="p-4 rounded-xl bg-[#16171d] border border-[#272935] space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#82889a] font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#0099dd]" />
                <span>Catatan & Deskripsi:</span>
              </div>
              <p className="text-xs text-[#d6dae6] leading-relaxed pl-6">
                {item.note || item.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#282a36] bg-[#17181f] flex items-center justify-between">
          {item.id ? (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Hapus Jadwal
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleClose}
            className="btn-myits-secondary text-xs px-6 py-2"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
