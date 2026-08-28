import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const INITIAL_USER = {
  name: 'Muhammad Mazen Ibrahim',
  email: 'mazen.ibrahim@student.its.ac.id',
  nrp: '5026211001',
  department: 'Sistem Informasi',
  semester: 5,
  ipk: 3.84,
  sksTaken: 84,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
};

const INITIAL_COURSES = [
  {
    id: 'c1',
    name: 'Sistem Enterprise (A)',
    code: 'ES234312',
    day: 'Senin',
    time: '07:00 - 09:30',
    room: 'SI 4202',
    color: '#0099dd',
    sks: 3,
    lecturer: 'Dr. Ir. Suprapedi, M.Kom',
    extraSchedulesCount: 3,
    extraSchedules: [
      'Rabu, 07:00 - 08:40 (Ruang SI 4202)',
      'Jumat, 13:00 - 14:40 (Lab Enterprise SI)',
      'Asistensi: Sabtu 10:00 - 12:00 (Zoom)'
    ],
    attendanceHistory: [
      { date: '2026-08-24', status: 'Hadir', topic: 'Pengenalan Arsitektur ERP & SAP Core' }
    ]
  },
  {
    id: 'c2',
    name: 'Algoritma dan Struktur Data (A)',
    code: 'ES234317',
    day: 'Selasa',
    time: '07:00 - 09:30',
    room: 'SI 2208',
    color: '#ec4899',
    sks: 4,
    lecturer: 'Dra. Endang Siti A., M.Sc',
    extraSchedulesCount: 3,
    extraSchedules: [
      'Kamis, 07:00 - 08:40 (Ruang SI 2208)',
      'Praktikum: Rabu 13:00 - 15:00'
    ],
    attendanceHistory: [
      { date: '2026-08-25', status: 'Hadir', topic: 'Pohon Biner & Algoritma Balanced BST (AVL)' }
    ]
  },
  {
    id: 'c3',
    name: 'Analitika Data dan Diagnostik (A)',
    code: 'ES234315',
    day: 'Selasa',
    time: '12:30 - 15:00',
    room: 'SI 4102',
    color: '#10b981',
    sks: 3,
    lecturer: 'Budi Nurani, S.Kom, M.T.',
    extraSchedulesCount: 1,
    extraSchedules: ['Jumat, 09:00 - 10:40 (Ruang SI 4102)'],
    attendanceHistory: [
      { date: '2026-08-25', status: 'Hadir', topic: 'Analisa Regresi Multi-Variat' }
    ]
  },
  {
    id: 'c4',
    name: 'Pemrograman Web (B)',
    code: 'ES234320',
    day: 'Rabu',
    time: '10:00 - 12:30',
    room: 'SI 3101',
    color: '#8b5cf6',
    sks: 3,
    lecturer: 'Rizal Fathoni, M.Kom',
    extraSchedulesCount: 2,
    extraSchedules: ['Jumat, 13:00 - 14:40 (Lab SI 1)'],
    attendanceHistory: [
      { date: '2026-08-26', status: 'Hadir', topic: 'React Context Architecture' }
    ]
  },
  {
    id: 'c5',
    name: 'Manajemen Proyek TI (A)',
    code: 'ES234325',
    day: 'Kamis',
    time: '09:30 - 12:00',
    room: 'SI 4201',
    color: '#f59e0b',
    sks: 3,
    lecturer: 'Dr. Anita Rahmawati, M.T.',
    extraSchedulesCount: 1,
    extraSchedules: ['Selasa, 15:30 - 17:10 (Ruang SI 4201)'],
    attendanceHistory: []
  }
];

const INITIAL_EVENTS = [
  {
    id: 'e1',
    title: 'Kuliah Sistem Enterprise (ERP)',
    courseId: 'c1',
    date: '2026-08-31',
    time: '07:00 - 09:30',
    location: 'Ruang SI 4202',
    color: '#0099dd',
    type: 'kelas'
  },
  {
    id: 'e2',
    title: 'Praktikum Algoritma & BST',
    courseId: 'c2',
    date: '2026-09-01',
    time: '07:00 - 09:30',
    location: 'Lab Pemrograman SI',
    color: '#ec4899',
    type: 'kelas'
  },
  {
    id: 'e3',
    title: 'Kuis Tengah Semester Analitika Data',
    courseId: 'c3',
    date: '2026-09-02',
    time: '12:30 - 14:00',
    location: 'Ruang SI 4102',
    color: '#ef4444',
    type: 'ujian'
  },
  {
    id: 'e4',
    title: 'Workshop Web Development ITS',
    courseId: 'general',
    date: '2026-09-05',
    time: '09:00 - 12:00',
    location: 'Auditorium Tower ITS',
    color: '#10b981',
    type: 'kegiatan'
  }
];

const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Laporan Praktikum Algoritma & Struktur Data - AVL Trees',
    courseId: 'c2',
    category: 'Akademik',
    priority: 'Tinggi',
    status: 'belum',
    dueDate: '2026-08-29',
    description: 'Implementasi rotasi Left-Right dan Right-Left pada pohon AVL dalam bahasa C++.',
    subtasks: [
      { id: 'st1', text: 'Koding struktur node AVL', completed: true },
      { id: 'st2', text: 'Uji coba rotasi ganda', completed: true },
      { id: 'st3', text: 'Format laporan PDF & Grafik', completed: false }
    ]
  },
  {
    id: 't2',
    title: 'Design System Notion Academic UI',
    courseId: 'c4',
    category: 'Pribadi',
    priority: 'Tinggi',
    status: 'belum',
    dueDate: '2026-08-30',
    description: 'Membuat komponen ui dark mode berukuran rounded 16px.',
    subtasks: [
      { id: 'st4', text: 'Setup warna dark theme', completed: true },
      { id: 'st5', text: 'Integrasi localstorage', completed: false }
    ]
  },
  {
    id: 't3',
    title: 'Analisis Studi Kasus SAP ERP Enterprise',
    courseId: 'c1',
    category: 'Akademik',
    priority: 'Sedang',
    status: 'belum',
    dueDate: '2026-09-02',
    description: 'Ringkasan modul Sales & Distribution dan Material Management.',
    subtasks: [
      { id: 'st6', text: 'Baca modul SAP bab 3', completed: false },
      { id: 'st7', text: 'Buat diagram alur proses bisnis', completed: false }
    ]
  },
  {
    id: 't4',
    title: 'Persiapan FRS & Verifikasi Berkas',
    courseId: 'general',
    category: 'Pribadi',
    priority: 'Rendah',
    status: 'selesai',
    dueDate: '2026-08-26',
    description: 'Upload transkrip ke portal akademik.',
    subtasks: [
      { id: 'st8', text: 'Cetak transkrip nilai', completed: true }
    ]
  }
];

const INITIAL_NOTES = [
  // Akademik - Otomatis menambahkan setiap Matkul di catatan
  {
    id: 'note_c1',
    title: 'Sistem Enterprise (A)',
    category: 'Akademik',
    updatedAt: '2026-08-28',
    iconType: 'book',
    parentId: null,
    courseId: 'c1',
    blocks: [
      { id: 'b1', type: 'h2', content: 'Pengenalan Arsitektur SAP ERP & S/4HANA' },
      { id: 'b2', type: 'text', content: 'Sistem Enterprise mengintegrasikan seluruh modul bisnis dari SD, MM, FI, hingga HR.' },
      { id: 'b3', type: 'callout', content: 'Catatan Dosen: Pahami alur pemrosesan pesanan penjualan (Sales Order Processing) untuk kuis.' }
    ]
  },
  {
    id: 'note_c1_sub1',
    title: 'Rangkuman Konsep ACID & SAP HANA Core',
    category: 'Akademik',
    updatedAt: '2026-08-28',
    iconType: 'file',
    parentId: 'note_c1',
    courseId: 'c1',
    blocks: [
      { id: 'b_sub1', type: 'h2', content: 'Prinsip Atomicity & Durability' },
      { id: 'b_sub2', type: 'text', content: 'Setiap transaksi bisnis ERP bersifat atomic — berhasil seluruhnya atau dibatalkan.' }
    ]
  },
  {
    id: 'note_c2',
    title: 'Algoritma dan Struktur Data (A)',
    category: 'Akademik',
    updatedAt: '2026-08-27',
    iconType: 'book',
    parentId: null,
    courseId: 'c2',
    blocks: [
      { id: 'b4', type: 'h2', content: 'Pohon Biner Seimbang (AVL Trees & Red-Black Tree)' },
      { id: 'b5', type: 'text', content: 'Rotasi tunggal (Left/Right) dan rotasi ganda (Left-Right / Right-Left) untuk menjaga balance factor.' }
    ]
  },
  {
    id: 'note_c2_sub1',
    title: 'Cheatsheet Rotasi Node AVL Tree (C++)',
    category: 'Akademik',
    updatedAt: '2026-08-27',
    iconType: 'file',
    parentId: 'note_c2',
    courseId: 'c2',
    blocks: [
      { id: 'b_sub3', type: 'h2', content: 'Fungsi Rotasi Kanan (Right Rotation)' },
      { id: 'b_sub4', type: 'text', content: 'Node* rightRotate(Node* y) { Node* x = y->left; Node* T2 = x->right; ... }' }
    ]
  },
  {
    id: 'note_c3',
    title: 'Analitika Data dan Diagnostik (A)',
    category: 'Akademik',
    updatedAt: '2026-08-26',
    iconType: 'book',
    parentId: null,
    courseId: 'c3',
    blocks: [
      { id: 'b6', type: 'h2', content: 'Regresi Multi-Variat & Outlier Detection' },
      { id: 'b7', type: 'text', content: 'Pembersihan data dengan R-squared score dan pemodelan statistik.' }
    ]
  },
  {
    id: 'note_c4',
    title: 'Pemrograman Web (B)',
    category: 'Akademik',
    updatedAt: '2026-08-25',
    iconType: 'book',
    parentId: null,
    courseId: 'c4',
    blocks: [
      { id: 'b8', type: 'h2', content: 'Arsitektur React Hooks & State Management' },
      { id: 'b9', type: 'text', content: 'Penggunaan useContext, useReducer, dan pembuatan custom hooks.' }
    ]
  },
  {
    id: 'note_c5',
    title: 'Manajemen Proyek TI (A)',
    category: 'Akademik',
    updatedAt: '2026-08-24',
    iconType: 'book',
    parentId: null,
    courseId: 'c5',
    blocks: [
      { id: 'b10', type: 'h2', content: 'Agile Scrum Framework & Critical Path Method' },
      { id: 'b11', type: 'text', content: 'Perhitungan perkiraan durasi proyek dengan CPM dan diagram GANTT.' }
    ]
  },

  // Non-Akademik
  {
    id: 'n_non1',
    title: 'Panduan Sukses Semester 5 & Target IPK 3.85+',
    category: 'Non-Akademik',
    updatedAt: '2026-08-28',
    iconType: 'target',
    parentId: null,
    blocks: [
      { id: 'b12', type: 'h2', content: 'Rutin Belajar & Time Blocking' },
      { id: 'b13', type: 'todo', content: 'Review kilat materi kuliah tiap pagi (06:30 - 07:30)', checked: true },
      { id: 'b14', type: 'todo', content: 'Deep work koding & tugas malam (19:30 - 21:30)', checked: false }
    ]
  },
  {
    id: 'n_non2',
    title: 'Design Principles & 10 Usability Heuristics',
    category: 'Non-Akademik',
    updatedAt: '2026-08-27',
    iconType: 'lightbulb',
    parentId: null,
    blocks: [
      { id: 'b15', type: 'h2', content: 'Visibility of System Status' },
      { id: 'b16', type: 'text', content: 'Sistem harus selalu memberi tahu pengguna tentang apa yang sedang terjadi melalui umpan balik yang tepat waktu.' }
    ]
  }
];

const INITIAL_DATABASES = [
  {
    id: 'db1',
    title: 'Daftar Buku Bacaan & Refrensi',
    iconType: 'library',
    columns: ['Judul Buku', 'Penulis', 'Kategori', 'Status'],
    rows: [
      { id: 'r1', 'Judul Buku': 'Clean Code', 'Penulis': 'Robert C. Martin', 'Kategori': 'Software Engineering', 'Status': 'Sedang Dibaca' },
      { id: 'r2', 'Judul Buku': 'Designing Data-Intensive Applications', 'Penulis': 'Martin Kleppmann', 'Kategori': 'System Design', 'Status': 'Rencana' },
      { id: 'r3', 'Judul Buku': 'The Pragmatic Programmer', 'Penulis': 'Andrew Hunt', 'Kategori': 'Developer Mindset', 'Status': 'Selesai' }
    ]
  },
  {
    id: 'db2',
    title: 'Ide Project Sampingan',
    iconType: 'lightbulb',
    columns: ['Nama Project', 'Tech Stack', 'Target Launch', 'Status'],
    rows: [
      { id: 'r10', 'Nama Project': 'Academic Notion Web', 'Tech Stack': 'React + Tailwind', 'Target Launch': 'Agustus 2026', 'Status': 'In Progress' },
      { id: 'r11', 'Nama Project': 'AI Schedule Assistant', 'Tech Stack': 'Python + OpenAI API', 'Target Launch': 'Oktober 2026', 'Status': 'Ide' }
    ]
  }
];

const INITIAL_HABITS = [
  { id: 'h1', name: 'Review Materi Kuliah 30 Menit', iconType: 'book', streak: 5, completedToday: true },
  { id: 'h2', name: 'Minum Air Putih 2 Liter', iconType: 'droplet', streak: 12, completedToday: true },
  { id: 'h3', name: 'Koding Project Sampingan', iconType: 'code', streak: 4, completedToday: false },
  { id: 'h4', name: 'Olahraga / Stretching 15 Menit', iconType: 'activity', streak: 2, completedToday: false }
];

const INITIAL_MOODS = [
  { id: 'm1', date: '2026-08-27', moodKey: 'rocket', mood: 'Produktif', note: 'Membuat web notion akademik dengan UI dark mode impian!' },
  { id: 'm2', date: '2026-08-26', moodKey: 'smile', mood: 'Senang', note: 'Presentasi tugas kelompok berjalan lancar.' }
];

const INITIAL_FINANCE = [
  { id: 'f1', title: 'Uang Saku Bulanan', amount: 2500000, type: 'income', date: '2026-08-01' },
  { id: 'f2', title: 'Buku Kuliah & Print Laporan', amount: 180000, type: 'expense', date: '2026-08-15' },
  { id: 'f3', title: 'Langganan Notion & Software', amount: 150000, type: 'expense', date: '2026-08-20' }
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('myits_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState('beranda');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('myits_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [scheduleEvents, setScheduleEvents] = useState(() => {
    const saved = localStorage.getItem('myits_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('myits_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('myits_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [databases, setDatabases] = useState(() => {
    const saved = localStorage.getItem('myits_databases');
    return saved ? JSON.parse(saved) : INITIAL_DATABASES;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('myits_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [moodLogs, setMoodLogs] = useState(() => {
    const saved = localStorage.getItem('myits_moods');
    return saved ? JSON.parse(saved) : INITIAL_MOODS;
  });

  const [financeLogs, setFinanceLogs] = useState(() => {
    const saved = localStorage.getItem('myits_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCE;
  });

  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => localStorage.setItem('myits_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('myits_courses', JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem('myits_events', JSON.stringify(scheduleEvents)), [scheduleEvents]);
  useEffect(() => localStorage.setItem('myits_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('myits_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('myits_databases', JSON.stringify(databases)), [databases]);
  useEffect(() => localStorage.setItem('myits_habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('myits_moods', JSON.stringify(moodLogs)), [moodLogs]);
  useEffect(() => localStorage.setItem('myits_finance', JSON.stringify(financeLogs)), [financeLogs]);

  // Initial Sync from PostgreSQL API on Mount
  useEffect(() => {
    // 1. Fetch Notes from PostgreSQL API
    fetch('/api/notes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          setNotes(data.notes);
          localStorage.setItem('myits_notes', JSON.stringify(data.notes));
        }
      })
      .catch((err) => console.warn('[Notes API Sync Notice]:', err.message));

    // 2. Fetch Tasks from PostgreSQL API
    fetch('/api/tasks')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.tasks) && data.tasks.length > 0) {
          setTasks(data.tasks);
          localStorage.setItem('myits_tasks', JSON.stringify(data.tasks));
        }
      })
      .catch((err) => console.warn('[Tasks API Sync Notice]:', err.message));

    // 3. Fetch Schedule Events from PostgreSQL API
    fetch('/api/schedules')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.events) && data.events.length > 0) {
          setScheduleEvents(data.events);
          localStorage.setItem('myits_events', JSON.stringify(data.events));
        }
      })
      .catch((err) => console.warn('[Schedules API Sync Notice]:', err.message));
  }, []);

  // Global Keyboard Shortcut Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action Helpers with PostgreSQL Sync
  const updateTaskStatus = async (taskId, newStatus) => {
    const existingTask = tasks.find((t) => t.id === taskId);
    const updatedTaskObj = existingTask
      ? { ...existingTask, status: newStatus }
      : { id: taskId, status: newStatus };

    if (newStatus === 'selesai' && existingTask?.status !== 'selesai') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch('/api/tasks/' + taskId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTaskObj),
      });
    } catch (err) {
      console.warn('[updateTaskStatus API Notice]:', err.message);
    }
  };

  const addTask = async (newTask) => {
    const taskObj = {
      id: 't_' + Date.now(),
      status: 'belum',
      subtasks: newTask.subtasks || [],
      ...newTask
    };
    setTasks((prev) => [taskObj, ...prev]);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskObj),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.task) {
          setTasks((prev) => prev.map((t) => (t.id === taskObj.id ? { ...t, ...data.task } : t)));
        }
      }
    } catch (err) {
      console.warn('[addTask API Notice]:', err.message);
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    fetch('/api/tasks/' + taskId, { method: 'DELETE' }).catch((err) =>
      console.warn('[deleteTask API Notice]:', err.message)
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    let updatedTaskObj = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = (t.subtasks || []).map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          updatedTaskObj = { ...t, subtasks: updatedSubtasks };
          return updatedTaskObj;
        }
        return t;
      })
    );

    if (updatedTaskObj) {
      fetch('/api/tasks/' + taskId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTaskObj),
      }).catch((err) => console.warn('[toggleSubtask API Notice]:', err.message));
    }
  };

  const addSubtask = (taskId, subtaskText) => {
    if (!subtaskText.trim()) return;
    let updatedTaskObj = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubtask = { id: 'st_' + Date.now(), text: subtaskText, completed: false };
          updatedTaskObj = { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
          return updatedTaskObj;
        }
        return t;
      })
    );

    if (updatedTaskObj) {
      fetch('/api/tasks/' + taskId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTaskObj),
      }).catch((err) => console.warn('[addSubtask API Notice]:', err.message));
    }
  };

  const addScheduleEvent = async (newEvent) => {
    const eventObj = {
      id: 'e_' + Date.now(),
      color: newEvent.color || '#0099dd',
      ...newEvent
    };
    setScheduleEvents((prev) => [eventObj, ...prev]);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventObj),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.event) {
          setScheduleEvents((prev) => prev.map((e) => (e.id === eventObj.id ? { ...e, ...data.event } : e)));
        }
      }
    } catch (err) {
      console.warn('[addScheduleEvent API Notice]:', err.message);
    }
  };

  const deleteScheduleEvent = (eventId) => {
    if (!eventId) return;
    const cleanId = String(eventId).replace(/^event_/, '');

    setScheduleEvents((prev) =>
      prev.filter((e) => e.id !== cleanId && e.id !== eventId && ('event_' + e.id) !== eventId)
    );

    fetch('/api/schedules/' + cleanId, { method: 'DELETE' }).catch((err) =>
      console.warn('[deleteScheduleEvent API Notice]:', err.message)
    );
  };

  const deleteScheduleItem = (item) => {
    if (!item) return;

    if (item.itemType === 'event' || String(item.id).startsWith('event_') || !item.originalCourse) {
      const targetId = item.rawId || String(item.id).replace(/^event_/, '');
      deleteScheduleEvent(targetId);
      deleteScheduleEvent(item.id);
    } else if (item.itemType === 'course_extra' || String(item.id).startsWith('course_extra_')) {
      const courseId = item.rawId || item.originalCourse?.id;
      const extraIdx = item.extraIdx;
      if (courseId !== undefined && extraIdx !== undefined) {
        setCourses((prev) =>
          prev.map((c) => {
            if (c.id === courseId) {
              const newExtras = [...(c.extraSchedules || [])];
              newExtras.splice(extraIdx, 1);
              return { ...c, extraSchedules: newExtras };
            }
            return c;
          })
        );
      }
    } else if (item.itemType === 'course' || String(item.id).startsWith('course_')) {
      const courseId = item.rawId || item.originalCourse?.id;
      if (courseId) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      }
    }
  };

  const addNote = async (newNote) => {
    const noteObj = {
      id: 'n_' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0],
      iconType: newNote.iconType || 'book',
      parentId: newNote.parentId || null,
      blocks: newNote.blocks || [
        { id: 'b_' + Date.now(), type: 'text', content: 'Mulai mengetik catatan...' }
      ],
      ...newNote
    };
    setNotes((prev) => [noteObj, ...prev]);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteObj),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.note) {
          setNotes((prev) => prev.map((n) => (n.id === noteObj.id ? { ...n, ...data.note } : n)));
        }
      }
    } catch (err) {
      console.warn('[addNote API Notice]:', err.message);
    }
  };

  const updateNote = (updatedNote) => {
    const updatedNoteWithTime = {
      ...updatedNote,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? { ...n, ...updatedNoteWithTime } : n))
    );

    fetch('/api/notes/' + updatedNote.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedNoteWithTime),
    }).catch((err) => console.warn('[updateNote API Notice]:', err.message));
  };

  const deleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId && n.parentId !== noteId));
    fetch('/api/notes/' + noteId, { method: 'DELETE' }).catch((err) =>
      console.warn('[deleteNote API Notice]:', err.message)
    );
  };

  const addDatabaseRow = (databaseId, newRowObj) => {
    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === databaseId) {
          const rowObj = { id: 'r_' + Date.now(), ...newRowObj };
          return { ...db, rows: [...db.rows, rowObj] };
        }
        return db;
      })
    );
  };

  const deleteDatabaseRow = (databaseId, rowId) => {
    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === databaseId) {
          return { ...db, rows: db.rows.filter((r) => r.id !== rowId) };
        }
        return db;
      })
    );
  };

  const toggleHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const updatedState = !h.completedToday;
          if (updatedState) {
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
          }
          return {
            ...h,
            completedToday: updatedState,
            streak: updatedState ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      })
    );
  };

  const addMoodLog = (newMood) => {
    const moodObj = {
      id: 'm_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newMood
    };
    setMoodLogs((prev) => [moodObj, ...prev]);
    confetti({ particleCount: 25, spread: 40 });
  };

  const addFinanceLog = (newFinance) => {
    const finObj = {
      id: 'f_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newFinance
    };
    setFinanceLogs((prev) => [finObj, ...prev]);
  };

  const deleteFinanceLog = (finId) => {
    setFinanceLogs((prev) => prev.filter((f) => f.id !== finId));
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const markAttendance = (courseId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const exists = c.attendanceHistory.some((h) => h.date === todayStr);
          if (!exists) {
            confetti({ particleCount: 40, spread: 70 });
            return {
              ...c,
              attendanceHistory: [
                { date: todayStr, status: 'Hadir', topic: 'Kehadiran Mandiri Dicatat' },
                ...c.attendanceHistory
              ]
            };
          }
        }
        return c;
      })
    );
  };

  const combinedSchedules = getCombinedSchedules(courses, scheduleEvents);

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        courses,
        scheduleEvents,
        combinedSchedules,
        tasks,
        notes,
        databases,
        habits,
        moodLogs,
        financeLogs,
        selectedCourseDetail,
        setSelectedCourseDetail,
        isSearchOpen,
        setIsSearchOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        updateTaskStatus,
        addTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        addScheduleEvent,
        deleteScheduleEvent,
        deleteScheduleItem,
        addNote,
        updateNote,
        deleteNote,
        addDatabaseRow,
        deleteDatabaseRow,
        toggleHabit,
        addMoodLog,
        addFinanceLog,
        deleteFinanceLog,
        updateUserProfile,
        markAttendance
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const getCombinedSchedules = (courses = [], scheduleEvents = []) => {
  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const combined = [];

  // 1. Process Main Course Schedules
  courses.forEach((c) => {
    combined.push({
      id: 'course_' + c.id,
      rawId: c.id,
      itemType: 'course',
      title: c.name,
      code: c.code || '',
      day: c.day,
      time: c.time,
      location: c.room || 'Daring',
      room: c.room || 'Daring',
      lecturer: c.lecturer || '',
      sks: c.sks || 3,
      category: 'Akademik',
      color: c.color || '#0099dd',
      isRecurring: true,
      originalCourse: c
    });

    // 2. Process Extra Schedules (Praktikum / Responsi)
    if (c.extraSchedules && Array.isArray(c.extraSchedules)) {
      c.extraSchedules.forEach((extraStr, idx) => {
        const parts = extraStr.split(',');
        let extraDay = 'Jumat';
        let rest = extraStr;
        if (parts.length >= 2) {
          extraDay = parts[0].trim();
          rest = parts.slice(1).join(',').trim();
        } else {
          for (const dName of daysMap) {
            if (extraStr.includes(dName)) {
              extraDay = dName;
              break;
            }
          }
        }
        const timeMatch = rest.match(/(\d{2}:\d{2}\s*-\s*\d{2}:\d{2})/);
        const timeVal = timeMatch ? timeMatch[1] : '13:00 - 14:40';
        const roomMatch = rest.match(/\(([^)]+)\)/);
        const roomVal = roomMatch ? roomMatch[1] : c.room;

        combined.push({
          id: `course_extra_${c.id}_${idx}`,
          rawId: c.id,
          extraIdx: idx,
          itemType: 'course_extra',
          title: `${c.name} (Praktikum/Tambahan)`,
          code: c.code || '',
          day: extraDay,
          time: timeVal,
          location: roomVal,
          room: roomVal,
          lecturer: c.lecturer || '',
          sks: c.sks || 1,
          category: 'Praktikum',
          color: c.color || '#ec4899',
          isRecurring: true,
          originalCourse: c
        });
      });
    }
  });

  // 3. Process Custom Events
  scheduleEvents.forEach((e) => {
    let computedDay = e.day;
    if (!computedDay && e.date) {
      const d = new Date(e.date);
      if (!isNaN(d.getTime())) {
        computedDay = daysMap[d.getDay()];
      }
    }
    if (!computedDay) computedDay = 'Jumat';

    combined.push({
      id: 'event_' + e.id,
      rawId: e.id,
      itemType: 'event',
      title: e.title,
      code: '',
      day: computedDay,
      date: e.date,
      time: e.time || 'Fleksibel',
      location: e.location || e.room || 'Daring',
      room: e.location || e.room || 'Daring',
      lecturer: e.lecturer || '',
      category: e.category || (e.type === 'kegiatan' ? 'Kegiatan' : 'Akademik'),
      color: e.color || '#10b981',
      isRecurring: e.isRecurring !== undefined ? e.isRecurring : false,
      originalCourse: null
    });
  });

  // Sort chronologically by start time
  const getMinutes = (timeStr) => {
    if (!timeStr || timeStr === 'Fleksibel') return 23 * 60 + 59;
    const match = timeStr.match(/(\d{2}):(\d{2})/);
    if (match) return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    return 23 * 60 + 59;
  };

  return combined.sort((a, b) => getMinutes(a.time) - getMinutes(b.time));
};

export function useApp() {
  return useContext(AppContext);
}
