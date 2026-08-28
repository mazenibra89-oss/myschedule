import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, User, Mail, ShieldCheck, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Personalisasi() {
  const { user, updateUserProfile } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [nrp, setNrp] = useState(user.nrp);
  const [department, setDepartment] = useState(user.department);
  const [avatar, setAvatar] = useState(user.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ name, email, nrp, department, avatar });
    setSavedSuccess(true);
    confetti({ particleCount: 35, spread: 60 });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data ke pengaturan awal?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#0099dd]" />
          Personalisasi & Pengaturan Profil
        </h1>
        <p className="text-xs text-[#8a90a2] mt-1">
          Sesuaikan informasi profil mahasiswa, foto avatar, dan data workspace Anda.
        </p>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="card-myits p-7 bg-[#1a1b22] border-[#292b37] space-y-6"
      >
        <div className="flex items-center gap-5 border-b border-[#282a36] pb-6">
          <img
            src={avatar}
            alt="Avatar Preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#0099dd] p-0.5 shadow-lg shadow-cyan-900/30"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-xs text-[#878d9f]">{nrp} • {department}</p>
            <p className="text-[11px] text-[#0099dd] mt-1 font-semibold">Mahasiswa Aktif ITS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-[#878d9f] block mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c39] text-white text-xs focus:outline-none focus:border-[#0099dd]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#878d9f] block mb-1.5">NRP / ID Mahasiswa</label>
            <input
              type="text"
              value={nrp}
              onChange={(e) => setNrp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c39] text-white text-xs focus:outline-none focus:border-[#0099dd]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#878d9f] block mb-1.5">Email Akademik</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c39] text-white text-xs focus:outline-none focus:border-[#0099dd]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#878d9f] block mb-1.5">Departemen / Jurusan</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c39] text-white text-xs focus:outline-none focus:border-[#0099dd]"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#878d9f] block mb-1.5">URL Foto Profil Avatar</label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c39] text-white text-xs focus:outline-none focus:border-[#0099dd]"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#282a36]">
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs text-red-400 hover:underline flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Ulang Data Demo</span>
          </button>

          <button type="submit" className="btn-myits-primary text-xs flex items-center gap-2 px-6">
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profil berhasil diperbarui dan tersimpan di LocalStorage!</span>
          </div>
        )}
      </form>
    </div>
  );
}
