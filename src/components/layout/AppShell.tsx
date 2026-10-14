import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Briefcase, 
  Sparkles, 
  ClipboardList, 
  Database, 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  GraduationCap, 
  CheckSquare, 
  UserCircle, 
  ShieldCheck, 
  ChevronDown, 
  ArrowRight, 
  BookOpen, 
  LineChart, 
  Calendar, 
  FileQuestion,
  MessageSquare
} from 'lucide-react';
import { InquiryModal } from '../inquiry/InquiryModal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    currentUser,
    currentRoute,
    navigate,
    logout,
    login,
    academicTerm,
    setAcademicTerm,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    toasts,
    removeToast,
    searchQuery,
    setSearchQuery,
    isInquiryModalOpen,
    inquiryDefaultType,
    openInquiryModal,
    closeInquiryModal,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoRoleModal, setShowDemoRoleModal] = useState(false);

  // Define navigation items based on current role
  const getNavItems = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'admin') {
      return [
        { label: 'Institutional Overview', route: '/admin/overview', icon: LayoutDashboard },
        { label: 'Student Directory', route: '/admin/students', icon: Users },
        { label: 'Risk Segmentation', route: '/admin/segments', icon: Layers },
        { label: 'Placement Intelligence', route: '/admin/placement', icon: Briefcase },
        { label: 'AI Success Copilot', route: '/admin/insights', icon: Sparkles, badge: 'AI' },
        { label: 'Intervention Center', route: '/admin/interventions', icon: ClipboardList },
        { label: 'Data Management', route: '/admin/data', icon: Database },
      ];
    }

    if (currentUser.role === 'faculty') {
      return [
        { label: 'My Mentor Overview', route: '/faculty/overview', icon: LayoutDashboard },
        { label: 'Assigned Students', route: '/faculty/students', icon: Users },
        { label: 'Interventions & Plans', route: '/faculty/interventions', icon: ClipboardList },
        { label: 'Student 360° Profile', route: '/faculty/student-inspect', icon: UserCircle },
      ];
    }

    // Student Role
    return [
      { label: 'My Growth Overview', route: '/student/overview', icon: LayoutDashboard },
      { label: 'AI Study Tutor', route: '/student/tutor', icon: Sparkles, badge: 'AI' },
      { label: 'Learning Planner', route: '/student/planner', icon: Calendar, badge: 'Smart' },
      { label: 'Quizzes & Flashcards', route: '/student/practice', icon: FileQuestion },
      { label: 'Career & Placement Copilot', route: '/student/career', icon: Briefcase, badge: 'Pro' },
      { label: 'Academic Performance', route: '/student/academics', icon: BookOpen },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#F7F6F1] text-[#192A27] font-sans">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#0B2925] text-[#ECEAE1] border-r border-[#16856B]/20 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16856B] to-[#123D35] flex items-center justify-center text-white shadow-md border border-white/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-white tracking-tight">CampusIQ</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#16856B] text-white">PRO</span>
              </div>
              <p className="text-[11px] text-[#A9B5AC] truncate">Student Success Intelligence</p>
            </div>
          </div>
        </div>

        {/* Role & Academic Term Indicator */}
        <div className="px-5 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#A9B5AC] font-medium text-[11px] uppercase tracking-wider">Active Workspace</span>
            <button
              onClick={() => setShowDemoRoleModal(true)}
              className="text-[11px] font-semibold text-[#16856B] hover:text-emerald-300 underline decoration-dotted transition-colors"
              title="Switch demo persona"
            >
              Switch Role
            </button>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span className="capitalize flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16856B]" />
              {currentUser?.role === 'admin' ? 'Institutional Admin' : currentUser?.role === 'faculty' ? 'Faculty Mentor' : 'Enrolled Student'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-[#A9B5AC]/70 uppercase">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || currentRoute.startsWith(`${item.route}/`);
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#16856B] text-white font-semibold shadow-xs'
                    : 'text-[#D1D8D2] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A9B5AC]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-black/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover border border-[#16856B]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-[#A9B5AC] truncate">{currentUser?.title}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#A9B5AC] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-[#E2E6E1] px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & Global Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#6D7975] hover:text-[#192A27] rounded-lg hover:bg-[#F7F6F1]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student ID, name, department..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] placeholder-[#6D7975] focus:outline-none focus:bg-white focus:border-[#16856B] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6D7975] hover:text-[#192A27]"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Right: Academic Term selector, Notifications, Profile menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Term Selector */}
              <div className="hidden md:flex items-center gap-1.5 bg-[#F7F6F1] px-3 py-1.5 rounded-lg border border-[#E2E6E1] text-xs">
                <span className="text-[#6D7975] font-medium text-[11px]">Term:</span>
                <select
                  value={academicTerm}
                  onChange={(e) => setAcademicTerm(e.target.value)}
                  className="bg-transparent font-semibold text-[#192A27] focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Fall 2026 — Term II">Fall 2026 (Mid-Term)</option>
                  <option value="Fall 2026 — Term I">Fall 2026 (Term I)</option>
                  <option value="Spring 2026">Spring 2026</option>
                </select>
              </div>

              {/* Supabase Inquiries Form Trigger Button */}
              <button
                onClick={() => openInquiryModal()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Submit form inquiries and details directly to Supabase backend"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Inquiry Form</span>
              </button>

              {/* Demo Persona Switcher Button */}
              <button
                onClick={() => setShowDemoRoleModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#16856B]/30 bg-[#E8F5F1] text-[#123D35] hover:bg-[#d5eee5] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#16856B]" />
                <span>Demo Roles</span>
              </button>

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-[#6D7975] hover:text-[#192A27] hover:bg-[#F7F6F1] rounded-lg transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C44B4B] rounded-full ring-2 ring-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-[#E2E6E1] py-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-[#E2E6E1]">
                      <span className="text-xs font-bold text-[#192A27]">
                        Alerts & Notifications ({unreadNotificationCount} unread)
                      </span>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-[#16856B] hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E6E1]/60">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.targetRoute) navigate(n.targetRoute);
                            setShowNotifications(false);
                          }}
                          className={`p-3 text-xs hover:bg-[#F7F6F1] cursor-pointer transition-colors ${
                            !n.read ? 'bg-[#E8F5F1]/30' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-[#192A27]">{n.title}</span>
                            <span className="text-[10px] text-[#6D7975]">{n.timestamp}</span>
                          </div>
                          <p className="text-[#6D7975] text-[11px] line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-[#F7F6F1] text-xs transition-colors"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#E2E6E1]"
                  />
                  <span className="hidden sm:inline font-semibold text-[#192A27] truncate max-w-[100px]">
                    {currentUser?.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6D7975]" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E6E1] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E2E6E1]">
                      <p className="text-xs font-bold text-[#192A27] truncate">{currentUser?.name}</p>
                      <p className="text-[11px] text-[#6D7975] truncate">{currentUser?.email}</p>
                      <span className="mt-1 inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#E8F5F1] text-[#123D35]">
                        Role: {currentUser?.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowDemoRoleModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#192A27] hover:bg-[#F7F6F1] flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#16856B]" />
                      Switch Demo Persona
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#C44B4B] hover:bg-[#FDF0F0] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#0B2925]/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 bg-[#0B2925] text-white p-4 h-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#16856B] flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-base">CampusIQ</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-[#16856B] text-white' : 'text-[#D1D8D2] hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowDemoRoleModal(true);
                }}
                className="w-full mb-2 py-2 text-xs font-semibold text-center rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                Switch Demo Account
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2 text-xs font-medium text-center rounded-lg text-[#C44B4B] hover:bg-white/5"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DEMO ROLE SWITCHER MODAL ================= */}
      {showDemoRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2925]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E6E1] shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#192A27]">Select Demo Persona</h3>
                <p className="text-xs text-[#6D7975]">Evaluate role-specific intelligence flows</p>
              </div>
              <button
                onClick={() => setShowDemoRoleModal(false)}
                className="p-1 text-[#6D7975] hover:text-[#192A27] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    login(user);
                    setShowDemoRoleModal(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentUser?.id === user.id
                      ? 'border-[#123D35] bg-[#E8F5F1] ring-2 ring-[#123D35]/10'
                      : 'border-[#E2E6E1] hover:border-[#16856B] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#E2E6E1]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#192A27]">{user.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white text-[#123D35] border border-[#E2E6E1]">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6D7975]">{user.title}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#16856B]" />
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-[#6D7975] text-center bg-[#F7F6F1] p-2 rounded-lg">
              Note: This is synthetic demonstration auth for the byteXL hackathon evaluation.
            </p>
          </div>
        </div>
      )}

      {/* ================= INQUIRY MODAL ================= */}
      <InquiryModal 
        isOpen={isInquiryModalOpen} 
        onClose={closeInquiryModal} 
        defaultType={inquiryDefaultType} 
      />

      {/* ================= TOASTS CONTAINER ================= */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 cursor-pointer ${
              toast.type === 'success'
                ? 'bg-[#123D35] text-white border-[#16856B]'
                : toast.type === 'warning'
                ? 'bg-[#FBF4E8] text-[#C58A2A] border-[#F4DEC0]'
                : toast.type === 'error'
                ? 'bg-[#FDF0F0] text-[#C44B4B] border-[#F8D2D2]'
                : 'bg-white text-[#192A27] border-[#E2E6E1]'
            }`}
          >
            <span>{toast.message}</span>
            <X className="w-3.5 h-3.5 shrink-0 opacity-60 hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
};
