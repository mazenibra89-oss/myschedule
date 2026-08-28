import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Heart,
  Smile,
  Rocket,
  Lightbulb,
  Moon,
  TrendingUp,
  TrendingDown,
  Wallet,
  BookOpen,
  Droplets,
  Code,
  Activity,
  Award
} from 'lucide-react';

export default function PersonalHub() {
  const {
    habits,
    toggleHabit,
    moodLogs,
    addMoodLog,
    financeLogs,
    addFinanceLog,
    deleteFinanceLog
  } = useApp();

  // Mood Tracker State
  const [selectedMoodKey, setSelectedMoodKey] = useState('rocket');
  const [moodName, setMoodName] = useState('Produktif');
  const [moodNote, setMoodNote] = useState('');

  // Finance Form State
  const [finTitle, setFinTitle] = useState('');
  const [finAmount, setFinAmount] = useState('');
  const [finType, setFinType] = useState('expense');

  // Personal Non-Academic Todo List
  const [personalTodos, setPersonalTodos] = useState([
    { id: 'pt1', text: 'Beli galon air & perlengkapan mandi', done: true },
    { id: 'pt2', text: 'Jogging sore 3km di lapangan ITS', done: false },
    { id: 'pt3', text: 'Servis rutin motor harian', done: false }
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  const moodOptions = [
    { key: 'rocket', name: 'Produktif', icon: Rocket, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
    { key: 'smile', name: 'Senang', icon: Smile, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    { key: 'target', name: 'Fokus', icon: Target, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    { key: 'lightbulb', name: 'Inspirasi', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    { key: 'moon', name: 'Lelah', icon: Moon, color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' }
  ];

  const getHabitIcon = (iconType) => {
    switch (iconType) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'droplet':
        return <Droplets className="w-4 h-4 text-[#0099dd]" />;
      case 'code':
        return <Code className="w-4 h-4 text-purple-400" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-amber-400" />;
      default:
        return <Award className="w-4 h-4 text-[#0099dd]" />;
    }
  };

  const getMoodIcon = (key) => {
    switch (key) {
      case 'rocket':
        return <Rocket className="w-4 h-4 text-purple-400" />;
      case 'smile':
        return <Smile className="w-4 h-4 text-emerald-400" />;
      case 'target':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'lightbulb':
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'moon':
        return <Moon className="w-4 h-4 text-slate-400" />;
      default:
        return <Smile className="w-4 h-4 text-[#0099dd]" />;
    }
  };

  const handleAddMood = (e) => {
    e.preventDefault();
    addMoodLog({ moodKey: selectedMoodKey, mood: moodName, note: moodNote });
    setMoodNote('');
  };

  const handleAddFinance = (e) => {
    e.preventDefault();
    if (!finTitle || !finAmount) return;
    addFinanceLog({ title: finTitle, amount: parseInt(finAmount, 10), type: finType });
    setFinTitle('');
    setFinAmount('');
  };

  const togglePersonalTodo = (id) => {
    setPersonalTodos(
      personalTodos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleAddPersonalTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setPersonalTodos([
      ...personalTodos,
      { id: 'pt_' + Date.now(), text: newTodoText, done: false }
    ]);
    setNewTodoText('');
  };

  // Finance Calculations
  const totalIncome = financeLogs
    .filter((f) => f.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = financeLogs
    .filter((f) => f.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Target className="w-6 h-6 text-amber-400" />
          Kebutuhan Pribadi & Mood Journal
        </h1>
        <p className="text-xs text-[#8a90a2] mt-1">
          Pengelola to-do harian non-akademik, habit tracker, mood tracker harian, dan keuangan sederhana.
        </p>
      </div>

      {/* Grid Row 1: Daily Mood Tracker & Non-Academic Todo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Tracker & Journal */}
        <div className="card-myits p-6 bg-[#1a1b22] border-[#292b37] space-y-5">
          <div className="flex items-center justify-between border-b border-[#282a36] pb-3">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Daily Mood Tracker & Jurnal</h3>
            </div>
            <span className="text-xs text-amber-400 font-bold">Log Perasaan Hari Ini</span>
          </div>

          {/* Icon Badge Picker */}
          <form onSubmit={handleAddMood} className="space-y-4">
            <div className="grid grid-cols-5 gap-2 bg-[#14151a] p-2 rounded-xl border border-[#272935]">
              {moodOptions.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedMoodKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedMoodKey(item.key);
                      setMoodName(item.name);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      isSelected
                        ? item.color + ' font-bold shadow-lg scale-105'
                        : 'border-transparent text-[#7d8396] hover:bg-[#1f212b] hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Jurnal ringkas mood hari ini..."
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
            />

            <button type="submit" className="btn-myits-primary text-xs w-full py-2 bg-amber-600 hover:bg-amber-500">
              + Simpan Log Mood Hari Ini
            </button>
          </form>

          {/* Mood History */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-[#73798c] uppercase tracking-wider block">
              Riwayat Mood Terbaru
            </span>
            {moodLogs.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-[#16171d] border border-[#272935] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#21232e] flex items-center justify-center border border-[#2e3141]">
                    {getMoodIcon(m.moodKey)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{m.mood}</p>
                    <p className="text-[10px] text-[#7d8396]">{m.note}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#73798c] font-mono">{m.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* To-Do List Non-Akademik */}
        <div className="card-myits p-6 bg-[#1a1b22] border-[#292b37] space-y-5">
          <div className="flex items-center justify-between border-b border-[#282a36] pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">To-Do List Harian Non-Akademik</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Personal Checklist</span>
          </div>

          <form onSubmit={handleAddPersonalTodo} className="flex gap-2">
            <input
              type="text"
              placeholder="Tambah agenda non-akademik (belanja/olahraga)..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
            />
            <button type="submit" className="btn-myits-primary text-xs px-4">
              +
            </button>
          </form>

          <div className="space-y-2">
            {personalTodos.map((t) => (
              <div
                key={t.id}
                onClick={() => togglePersonalTodo(t.id)}
                className="p-3 rounded-xl bg-[#16171d] border border-[#272935] flex items-center justify-between cursor-pointer hover:bg-[#20222d]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      t.done ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[#3a3d4f]'
                    }`}
                  >
                    {t.done && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <span className={`text-xs ${t.done ? 'line-through text-[#646a7c]' : 'text-white font-medium'}`}>
                    {t.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Habit Tracker & Keuangan Sederhana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit Tracker */}
        <div className="card-myits p-6 bg-[#1a1b22] border-[#292b37] space-y-4">
          <div className="flex items-center justify-between border-b border-[#282a36] pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Habit Tracker & Visual Streak</h3>
            </div>
          </div>

          <div className="space-y-3">
            {habits.map((h) => (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className="p-3.5 rounded-xl bg-[#16171d] border border-[#272935] flex items-center justify-between cursor-pointer hover:border-[#383b4e]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#21232e] flex items-center justify-center border border-[#2e3141]">
                    {getHabitIcon(h.iconType)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{h.name}</p>
                    <p className="text-[10px] text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Streak: {h.streak} hari berturut-turut
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    h.completedToday ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[#3a3d4f]'
                  }`}
                >
                  {h.completedToday && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keuangan Sederhana */}
        <div className="card-myits p-6 bg-[#1a1b22] border-[#292b37] space-y-4">
          <div className="flex items-center justify-between border-b border-[#282a36] pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Pencatat Keuangan Sederhana</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              Saldo: Rp {balance.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Finance Add Form */}
          <form onSubmit={handleAddFinance} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Transaksi (Buku/Print)..."
              value={finTitle}
              onChange={(e) => setFinTitle(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
            />
            <input
              type="number"
              placeholder="Jumlah (Rp)"
              value={finAmount}
              onChange={(e) => setFinAmount(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
            />
            <div className="flex gap-2">
              <select
                value={finType}
                onChange={(e) => setFinType(e.target.value)}
                className="px-2 py-1.5 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs flex-1"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
              <button type="submit" className="btn-myits-primary text-xs px-3">
                +
              </button>
            </div>
          </form>

          {/* Finance History Logs */}
          <div className="space-y-2 pt-1 max-h-[180px] overflow-y-auto">
            {financeLogs.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-xl bg-[#16171d] border border-[#272935] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  {f.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <p className="font-bold text-white">{f.title}</p>
                    <p className="text-[10px] text-[#73798c]">{f.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold ${
                      f.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {f.type === 'income' ? '+' : '-'} Rp {f.amount.toLocaleString('id-ID')}
                  </span>
                  <button onClick={() => deleteFinanceLog(f.id)} className="text-[#646a7c] hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
