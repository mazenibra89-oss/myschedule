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
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">{renderContent()}</main>
      </div>

      {/* Floating Action Button */}
      <FloatingQuickAdd />

      {/* Global Modals */}
      <CourseDetailModal />
      <GlobalSearchModal />
      <QuickAddModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
