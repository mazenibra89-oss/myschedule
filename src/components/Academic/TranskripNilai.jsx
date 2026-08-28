import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Award, Download, CheckCircle2, TrendingUp } from 'lucide-react';

export default function TranskripNilai() {
  const { user } = useApp();

  const transcriptData = [
    { semester: 'Semester 1', ip: 3.80, sks: 18, courses: [
      { code: 'MK001', name: 'Konsep Teknologi Informasi', sks: 3, grade: 'A' },
      { code: 'MK002', name: 'Kalkulus I', sks: 3, grade: 'AB' },
      { code: 'MK003', name: 'Dasar Pemrograman', sks: 4, grade: 'A' },
      { code: 'MK004', name: 'Matematika Diskrit', sks: 3, grade: 'A' },
      { code: 'MK005', name: 'Bahasa Inggris Akademik', sks: 2, grade: 'A' },
      { code: 'MK006', name: 'Pancasila & Kewarganegaraan', sks: 3, grade: 'A' }
    ]},
    { semester: 'Semester 2', ip: 3.88, sks: 20, courses: [
      { code: 'MK010', name: 'Kalkulus II', sks: 3, grade: 'A' },
      { code: 'MK011', name: 'Pemrograman Berorientasi Objek', sks: 4, grade: 'A' },
      { code: 'MK012', name: 'Sistem Basis Data', sks: 4, grade: 'A' },
      { code: 'MK013', name: 'Matriks & Ruang Vektor', sks: 3, grade: 'AB' },
      { code: 'MK014', name: 'Organisasi & Arsitektur Komputer', sks: 3, grade: 'A' },
      { code: 'MK015', name: 'Statistika & Probabilitas', sks: 3, grade: 'AB' }
    ]},
    { semester: 'Semester 3', ip: 3.82, sks: 22, courses: [
      { code: 'MK020', name: 'Analisis & Perancangan Sistem', sks: 4, grade: 'A' },
      { code: 'MK021', name: 'Jaringan Komputer & Komunikasi Data', sks: 4, grade: 'AB' },
      { code: 'MK022', name: 'Desain Pengalaman Pengguna (UX)', sks: 3, grade: 'A' },
      { code: 'MK023', name: 'Keamanan Informasi & Privasi', sks: 3, grade: 'A' },
      { code: 'MK024', name: 'Interaksi Manusia & Komputer', sks: 4, grade: 'A' },
      { code: 'MK025', name: 'Manajemen Proses Bisnis', sks: 4, grade: 'AB' }
    ]},
    { semester: 'Semester 4', ip: 3.86, sks: 24, courses: [
      { code: 'MK030', name: 'Rekayasa Perangkat Lunak', sks: 4, grade: 'A' },
      { code: 'MK031', name: 'Kecerdasan Buatan (AI)', sks: 4, grade: 'A' },
      { code: 'MK032', name: 'Sistem Terdistribusi', sks: 4, grade: 'A' },
      { code: 'MK033', name: 'Tata Kelola Teknologi Informasi', sks: 4, grade: 'AB' },
      { code: 'MK034', name: 'Komputasi Awan (Cloud Computing)', sks: 4, grade: 'A' },
      { code: 'MK035', name: 'Etika Profesi & Hukum Siber', sks: 4, grade: 'A' }
    ]}
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#0099dd]" />
            Transkrip Mata Kuliah & Penilaian
          </h1>
          <p className="text-xs text-[#8a90a2] mt-1">
            Rekapitulasi riwayat nilai kumulatif dan pencapaian akademik mahasiswa.
          </p>
        </div>

        <button className="btn-myits-secondary text-xs flex items-center gap-2">
          <Download className="w-4 h-4 text-[#0099dd]" />
          <span>Cetak PDF Transkrip</span>
        </button>
      </div>

      {/* IPK Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-myits p-5 bg-[#1a1b22] border-[#292b37]">
          <p className="text-xs text-[#82889a]">Indeks Prestasi Kumulatif (IPK)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold text-white">{user.ipk}</p>
            <span className="text-xs text-emerald-400 font-bold">/ 4.00</span>
          </div>
        </div>

        <div className="card-myits p-5 bg-[#1a1b22] border-[#292b37]">
          <p className="text-xs text-[#82889a]">Total SKS Lulus</p>
          <p className="text-3xl font-extrabold text-white mt-1">{user.sksTaken} SKS</p>
        </div>

        <div className="card-myits p-5 bg-[#1a1b22] border-[#292b37]">
          <p className="text-xs text-[#82889a]">Predikat Akademik</p>
          <p className="text-xl font-extrabold text-amber-400 mt-1.5">Dengan Pujian (Cum Laude)</p>
        </div>
      </div>

      {/* Transcript Accordions by Semester */}
      <div className="space-y-6">
        {transcriptData.map((sem, idx) => (
          <div key={idx} className="card-myits bg-[#1a1b22] border-[#292b37] overflow-hidden">
            <div className="p-5 border-b border-[#282a36] bg-[#16171d] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{sem.semester}</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#82889a]">{sem.sks} SKS</span>
                <span className="px-3 py-1 rounded-full font-bold bg-[#0099dd]/15 text-[#0099dd]">
                  IPS: {sem.ip}
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#262835]">
              {sem.courses.map((c, cIdx) => (
                <div key={cIdx} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#8e94a5] font-bold">{c.code}</span>
                    <span className="text-white font-medium">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[#787e91]">{c.sks} SKS</span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded ${
                        c.grade === 'A'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {c.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
