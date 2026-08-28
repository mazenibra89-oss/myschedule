import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  UserCheck
} from 'lucide-react';

export default function Presensi() {
  const { courses, setSelectedCourseDetail, markAttendance } = useApp();
  const [expandedSchedules, setExpandedSchedules] = useState({});

  const toggleExpand = (courseId, e) => {
    e.stopPropagation();
    setExpandedSchedules((prev) => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const getTodayFullDate = () => {
    return 'Kamis, 27 Agustus 2026';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner Card (Exact match of Image 1) */}
      <div className="card-myits p-7 bg-[#1c1d23] border-[#292a34] space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">{getTodayFullDate()}</h2>
        <p className="text-sm text-[#878d9f] font-medium">Di luar masa perkuliahan</p>
      </div>

      {/* Section Header: Daftar Kuliah */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Daftar Kuliah</h2>

        {/* List of Course Cards */}
        <div className="space-y-5">
          {courses.map((course) => {
            const isExpanded = expandedSchedules[course.id];

            return (
              <div
                key={course.id}
                className="card-myits p-6 bg-[#1d1e24] hover:bg-[#23252d] border-[#2a2b36] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Side: Course Info */}
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {course.name}
                    </h3>
                    <p className="text-xs text-[#878d9f] font-mono tracking-wider">
                      {course.code}
                    </p>

                    {/* Schedule Icons Row (Exact match of Image 1) */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#9ea4b5] pt-2">
                      {/* Day */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#818798]" />
                        <span>{course.day}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#818798]" />
                        <span>{course.time}</span>
                      </div>

                      {/* Room */}
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#818798]" />
                        <span>{course.room}</span>
                      </div>

                      {/* Dropdown Expand Toggle */}
                      {course.extraSchedulesCount > 0 && (
                        <button
                          onClick={(e) => toggleExpand(course.id, e)}
                          className="flex items-center gap-1 text-[#0099dd] hover:text-[#38bdf8] font-medium transition-colors ml-1"
                        >
                          <span>{course.extraSchedulesCount} jadwal lainnya</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex items-center gap-3 self-start md:self-center">
                    <button
                      onClick={() => markAttendance(course.id)}
                      className="px-3 py-2 rounded-xl bg-[#0099dd]/15 hover:bg-[#0099dd]/25 text-[#0099dd] border border-[#0099dd]/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Tandai presensi hadir hari ini"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Presensi</span>
                    </button>

                    <button
                      onClick={() => setSelectedCourseDetail(course)}
                      className="btn-myits-secondary text-xs px-5 py-2.5 font-semibold text-[#e1e4ef] shadow-sm hover:text-white"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>

                {/* Expanded Extra Schedules Panel */}
                {isExpanded && course.extraSchedules && (
                  <div className="mt-4 pt-4 border-t border-[#292b37] space-y-2 animate-fade-in">
                    <p className="text-xs font-semibold text-[#7f8596] uppercase tracking-wider">
                      Jadwal Tambahan & Responsi:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.extraSchedules.map((sched, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-[#16171d] border border-[#272935] text-xs text-[#a0a6b7] flex items-center gap-2"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#0099dd]" />
                          <span>{sched}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
