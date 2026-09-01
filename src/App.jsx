import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Navigation/Sidebar';
import Header from './components/Navigation/Header';
import Beranda from './components/Dashboard/Beranda';
import AcademicCalendar from './components/Academic/AcademicCalendar';
import CourseDetailModal from './components/Presensi/CourseDetailModal';
import TaskBoard from './components/Tasks/TaskBoard';
import NotesWorkspace from './components/Notes/NotesWorkspace';
import PersonalHub from './components/Personal/PersonalHub';
import Personalisasi from './components/Settings/Personalisasi';
import GlobalSearchModal from './components/Common/GlobalSearchModal';
import QuickAddModal from './components/Common/QuickAddModal';
import FloatingQuickAdd from './components/Common/FloatingQuickAdd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React ErrorBoundary Caught Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111215] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Terjadi Kendala Tampilan</h2>
          <p className="text-xs text-[#878d9f] max-w-md">
            {this.state.error?.message || 'Halaman mengalami kesalahan saat memproses data.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return <Beranda />;
      case 'jadwal':
      case 'kalender':
        return <AcademicCalendar />;
      case 'tugas':
        return <TaskBoard />;
      case 'catatan':
        return <NotesWorkspace />;
      case 'personal':
        return <PersonalHub />;
      case 'personalisasi':
        return <Personalisasi />;
      default:
        return <Beranda />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111215] text-white overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>

      <CourseDetailModal />
      <GlobalSearchModal />
      <QuickAddModal />
      <FloatingQuickAdd />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
