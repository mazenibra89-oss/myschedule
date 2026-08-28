import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileEdit, Award, Calculator, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function FRSManager() {
  const { courses, user } = useApp();
  const [targetGrades, setTargetGrades] = useState({
    c1: 'A',
    c2: 'A',
    c3: 'AB',
    c4: 'A',
    c5: 'AB'
  });

  const gradeValues = {
    A: 4.0,
    AB: 3.5,
    B: 3.0,
    BC: 2.5,
    C: 2.0,
    D: 1.0,
    E: 0.0
  };

  const handleGradeChange = (courseId, newGrade) => {
    setTargetGrades((prev) => ({ ...prev, [courseId]: newGrade }));
  };

  // Compute total SKS and projected IPS
  const totalSKS = courses.reduce((acc, c) => acc + c.sks, 0);
  const totalPoints = courses.reduce((acc, c) => {
    const grade = targetGrades[c.id] || 'A';
    return acc + c.sks * gradeValues[grade];
  }, 0);

  const projectedIPS = totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : '0.00';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileEdit className="w-6 h-6 text-[#0099dd]" />
            Rencana Studi (FRS) & Simulator IPS
          </h1>
          <p className="text-xs text-[#8a90a2] mt-1">
            Pengelolaan rencana perkuliahan Semester 5 dan proyeksi target Indeks Prestasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#1b1d26] border border-[#2c2f3e] text-xs">
            <span className="text-[#878d9f]">Batas SKS Maksimal: </span>
            <span className="font-bold text-white">24 SKS</span>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-myits p-5 bg-[#1a1b22] border-[#292b37] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0099dd]/15 text-[#0099dd] flex items-center justify-center font-bold">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#82889a]">Total SKS Diambil</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{totalSKS} / 24 SKS</p>
          </div>
        </div>

        <div className="card-myits p-5 bg-[#1a1b22] border-[#292b37] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#82889a]">Estimasi IPS Semester Ini</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">{projectedIPS}</p>
          </div>
        </div>

        <div className="card-myits p-5 bg-[#1a1b22] border-[#292b37] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#82889a]">IPK Kumulatif Saat Ini</p>
            <p className="text-2xl font-extrabold text-purple-400 mt-0.5">{user.ipk}</p>
          </div>
        </div>
      </div>

      {/* Courses List Table with Target Grade Dropdown */}
      <div className="card-myits bg-[#1a1b22] border-[#292b37] overflow-hidden space-y-0">
        <div className="p-5 border-b border-[#282a36] bg-[#16171d] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Mata Kuliah Disetujui Dosen Wali</h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            ✓ Status FRS: Disetujui
          </span>
        </div>

        <div className="divide-y divide-[#262835]">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#20222b] transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#252733] text-[#8e94a5]">
                    {course.code}
                  </span>
                  <span className="text-xs text-[#0099dd] font-semibold">{course.sks} SKS</span>
                </div>
                <h4 className="text-sm font-bold text-white">{course.name}</h4>
                <p className="text-xs text-[#787e91]">Dosen: {course.lecturer}</p>
              </div>

              {/* Target Grade Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#82889a]">Target Nilai:</span>
                <select
                  value={targetGrades[course.id] || 'A'}
                  onChange={(e) => handleGradeChange(course.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#131419] border border-[#2c2f3f] text-white text-xs font-bold focus:outline-none focus:border-[#0099dd]"
                >
                  <option value="A">A (4.0)</option>
                  <option value="AB">AB (3.5)</option>
                  <option value="B">B (3.0)</option>
                  <option value="BC">BC (2.5)</option>
                  <option value="C">C (2.0)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
