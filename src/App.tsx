import React from 'react';
import { useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminOverview } from './pages/admin/AdminOverview';
import { StudentDirectory } from './pages/admin/StudentDirectory';
import { StudentProfile } from './pages/admin/StudentProfile';
import { PlacementIntelligence } from './pages/admin/PlacementIntelligence';
import { RiskSegmentation } from './pages/admin/RiskSegmentation';
import { AiInsights } from './pages/admin/AiInsights';
import { InterventionCenter } from './pages/admin/InterventionCenter';
import { DataManagement } from './pages/admin/DataManagement';
import { FacultyOverview } from './pages/faculty/FacultyOverview';
import { StudentPortal } from './pages/student/StudentPortal';
import { AiStudyTutor } from './pages/student/AiStudyTutor';
import { LearningPlanner } from './pages/student/LearningPlanner';
import { QuizPractice } from './pages/student/QuizPractice';
import { CareerCopilot } from './pages/student/CareerCopilot';

export const App: React.FC = () => {
  const { currentUser, currentRoute, authLoading } = useApp();

  // If initial auth session is still checking, show loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F6F1]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#123D35]/20 border-t-[#123D35] rounded-full animate-spin" />
          <span className="text-xs text-[#6D7975] font-medium font-sans">Connecting to CampusIQ...</span>
        </div>
      </div>
    );
  }

  // If no user is authenticated or explicitly on /login, show LoginPage
  if (!currentUser || currentRoute === '/login') {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    // Admin Routes
    if (currentRoute === '/admin/overview') return <AdminOverview />;
    if (currentRoute === '/admin/students') return <StudentDirectory />;
    if (currentRoute.startsWith('/admin/students/')) return <StudentProfile />;
    if (currentRoute === '/admin/placement') return <PlacementIntelligence />;
    if (currentRoute === '/admin/segments') return <RiskSegmentation />;
    if (currentRoute === '/admin/insights') return <AiInsights />;
    if (currentRoute === '/admin/interventions') return <InterventionCenter />;
    if (currentRoute === '/admin/data') return <DataManagement />;

    // Faculty Routes
    if (currentRoute === '/faculty/overview') return <FacultyOverview />;
    if (currentRoute === '/faculty/students') return <FacultyOverview />;
    if (currentRoute === '/faculty/interventions') return <InterventionCenter />;
    if (currentRoute === '/faculty/student-inspect') return <StudentProfile />;

    // Student Routes
    if (currentRoute === '/student/overview') return <StudentPortal />;
    if (currentRoute === '/student/tutor') return <AiStudyTutor />;
    if (currentRoute === '/student/planner') return <LearningPlanner />;
    if (currentRoute === '/student/practice') return <QuizPractice />;
    if (currentRoute === '/student/career') return <CareerCopilot />;
    if (currentRoute === '/student/academics') return <StudentPortal />;
    if (currentRoute === '/student/placement') return <CareerCopilot />;
    if (currentRoute === '/student/action-plan') return <LearningPlanner />;

    // Fallback to role overview
    if (currentUser.role === 'admin') return <AdminOverview />;
    if (currentUser.role === 'faculty') return <FacultyOverview />;
    return <StudentPortal />;
  };

  return (
    <AppShell>
      {renderCurrentPage()}
    </AppShell>
  );
};
