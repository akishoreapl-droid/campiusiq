import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { 
  User, 
  Student, 
  Intervention, 
  StudentActionItem, 
  NotificationItem, 
  InterventionStatus,
  UserRole,
  StudyTask,
  TopicMastery,
  Flashcard,
  QuizAttempt,
  StudentLearningAnalytics,
  TutorSession,
  TutorMessage,
  TutorMode,
  TutorLevel
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_INTERVENTIONS, 
  INITIAL_STUDENT_ACTIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { INITIAL_STUDY_TASKS } from '../utils/plannerEngine';
import { INITIAL_FLASHCARDS, INITIAL_TOPIC_MASTERIES } from '../data/quizBank';
import { queryTutorEngine } from '../utils/tutorEngine';
import { 
  supabase,
  fetchStudentsFromDb,
  seedInitialStudentsIfEmpty,
  fetchInterventionsFromDb,
  saveInterventionToDb,
  updateInterventionInDb,
  fetchStudyTasksFromDb,
  saveStudyTaskToDb,
  updateStudyTaskInDb,
  deleteStudyTaskFromDb,
  fetchQuizAttemptsFromDb,
  saveQuizAttemptToDb,
  fetchTopicMasteriesFromDb,
  upsertTopicMasteryInDb,
  fetchFlashcardsFromDb,
  saveFlashcardToDb,
  updateFlashcardInDb,
  saveTutorInquiryToDb,
  mapSupabaseUserToAppUser,
  authSignIn,
  authSignUp,
  authSignOut
} from '../lib/supabase';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  authLoading: boolean;
  dbLoading: boolean;
  isDbConnected: boolean;
  currentRoute: string;
  navigate: (route: string) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: { email: string; password: string; name: string; role: UserRole; department?: string }) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  refreshDataFromDb: () => Promise<void>;
  
  // Data
  students: Student[];
  filteredStudents: Student[];
  interventions: Intervention[];
  studentActions: StudentActionItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Global filters
  academicTerm: string;
  setAcademicTerm: (term: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedYear: number | 'All';
  setSelectedYear: (year: number | 'All') => void;
  selectedRiskFilter: 'all' | 'high' | 'medium' | 'low';
  setSelectedRiskFilter: (risk: 'all' | 'high' | 'medium' | 'low') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Interventions actions
  addIntervention: (item: Omit<Intervention, 'id' | 'createdAt'>) => void;
  updateInterventionStatus: (id: string, status: InterventionStatus, notes?: string, outcome?: string) => void;
  
  // Student Actions
  toggleStudentAction: (actionId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Data import
  importStudents: (newStudents: Student[]) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Selected Student
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  // Learning & Study Assets
  studyTasks: StudyTask[];
  addStudyTask: (task: Omit<StudyTask, 'id'>) => void;
  toggleStudyTask: (taskId: string) => void;
  deleteStudyTask: (taskId: string) => void;

  topicMasteries: TopicMastery[];
  updateTopicMastery: (subject: string, topic: string, newScore: number) => void;

  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id'>) => void;
  updateFlashcardStatus: (cardId: string, status: 'mastered' | 'learning' | 'needs_revision') => void;

  quizAttempts: QuizAttempt[];
  recordQuizAttempt: (attempt: QuizAttempt) => void;

  learningAnalytics: StudentLearningAnalytics;

  // AI Study Tutor
  tutorSessions: TutorSession[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  startNewTutorSession: (subject: string, mode?: TutorMode, level?: TutorLevel) => void;
  sendTutorMessage: (text: string, subject?: string, mode?: TutorMode, level?: TutorLevel) => void;
  saveTutorRecommendationToPlanner: (title: string, subject: string, topic: string) => void;

  // Supabase Inquiry Form Modal Controls
  isInquiryModalOpen: boolean;
  inquiryDefaultType: 'admission' | 'academic_support' | 'placement_help' | 'system_feedback' | 'general';
  openInquiryModal: (type?: 'admission' | 'academic_support' | 'placement_help' | 'system_feedback' | 'general') => void;
  closeInquiryModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Navigation
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<string>('/login');

  // Core Data
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS);
  const [studentActions, setStudentActions] = useState<StudentActionItem[]>(INITIAL_STUDENT_ACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Filters
  const [academicTerm, setAcademicTerm] = useState<string>('Fall 2026 — Term II');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Supabase Inquiries Modal State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryDefaultType, setInquiryDefaultType] = useState<'admission' | 'academic_support' | 'placement_help' | 'system_feedback' | 'general'>('general');

  const openInquiryModal = (type: 'admission' | 'academic_support' | 'placement_help' | 'system_feedback' | 'general' = 'general') => {
    setInquiryDefaultType(type);
    setIsInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setIsInquiryModalOpen(false);
  };

  // Learning State
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [topicMasteries, setTopicMasteries] = useState<TopicMastery[]>(INITIAL_TOPIC_MASTERIES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Recent Activity Log
  const [recentActivities, setRecentActivities] = useState<StudentLearningAnalytics['recentActivity']>([
    { id: 'ACT-01', title: 'Reviewed B+ Tree Indexing in AI Study Tutor', timestamp: '1 hour ago', type: 'tutor' },
    { id: 'ACT-02', title: 'Scored 85% in Computer Networks TCP/IP Quiz', timestamp: 'Yesterday', type: 'quiz', score: '85%' },
    { id: 'ACT-03', title: 'Reviewed 5 Flashcards on Virtual Memory', timestamp: '2 days ago', type: 'flashcard' },
  ]);

  // Tutor Sessions State
  const initialSession: TutorSession = {
    id: 'SESSION-01',
    title: 'B+ Trees & Database Indexing',
    subject: 'DBMS',
    mode: 'learn',
    level: 'intermediate',
    updatedAt: 'Just now',
    messages: [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        timestamp: '10:00 AM',
        text: 'Hello Aarav! I am your CampusIQ AI Study Tutor. What academic concept or problem in DBMS, DSA, OS, Networks, or Math would you like to explore today?',
        followUps: [
          'Explain B+ Trees and database indexing',
          'How does 0/1 Knapsack work in Dynamic Programming?',
          'What is Belady\'s Anomaly in Virtual Memory?',
          'Explain the TCP 3-Way Handshake step-by-step'
        ]
      }
    ]
  };

  const [tutorSessions, setTutorSessions] = useState<TutorSession[]>([initialSession]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('SESSION-01');

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (route: string) => {
    if (!currentUser && route !== '/login') {
      setCurrentRoute('/login');
      return;
    }

    if (currentUser) {
      if (currentUser.role === 'student' && !route.startsWith('/student')) {
        addToast('Access Restricted: Student Portal Active', 'warning');
        setCurrentRoute('/student/overview');
        return;
      }
      if (currentUser.role === 'faculty' && route.startsWith('/admin')) {
        addToast('Access Restricted: Faculty permissions active', 'warning');
        setCurrentRoute('/faculty/overview');
        return;
      }
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refetch live records from Supabase
  const refreshDataFromDb = useCallback(async () => {
    try {
      setDbLoading(true);

      // Check seed status
      await seedInitialStudentsIfEmpty();

      // Fetch live data in parallel
      const [dbStudents, dbInterventions, dbTasks, dbAttempts, dbMasteries, dbCards] = await Promise.all([
        fetchStudentsFromDb(),
        fetchInterventionsFromDb(),
        fetchStudyTasksFromDb(currentUser?.id),
        fetchQuizAttemptsFromDb(currentUser?.id),
        fetchTopicMasteriesFromDb(currentUser?.id),
        fetchFlashcardsFromDb(currentUser?.id),
      ]);

      if (dbStudents.length > 0) {
        setStudents(dbStudents);
      }
      if (dbInterventions.length > 0) {
        setInterventions(dbInterventions);
      }
      if (dbTasks.length > 0) {
        setStudyTasks(dbTasks);
      }
      if (dbAttempts.length > 0) {
        setQuizAttempts(dbAttempts);
      }
      if (dbMasteries.length > 0) {
        setTopicMasteries(dbMasteries);
      }
      if (dbCards.length > 0) {
        setFlashcards(dbCards);
      }

      setIsDbConnected(true);
    } catch (err) {
      console.warn('Database refresh warning:', err);
      setIsDbConnected(false);
    } finally {
      setDbLoading(false);
    }
  }, [currentUser?.id]);

  // Initial load and auth check
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        const appUser = mapSupabaseUserToAppUser(session.user);
        setCurrentUser(appUser);
        if (currentRoute === '/login') {
          if (appUser.role === 'admin') setCurrentRoute('/admin/overview');
          else if (appUser.role === 'faculty') setCurrentRoute('/faculty/overview');
          else setCurrentRoute('/student/overview');
        }
      } else {
        setCurrentUser(null);
        setCurrentRoute('/login');
      }
      setAuthLoading(false);
    }).catch(() => {
      if (isMounted) {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const appUser = mapSupabaseUserToAppUser(session.user);
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
        setCurrentRoute('/login');
      }
      setAuthLoading(false);
    });

    // Populate data from DB
    refreshDataFromDb();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshDataFromDb]);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    if (result.success && result.user) {
      const appUser = mapSupabaseUserToAppUser(result.user);
      setCurrentUser(appUser);
      if (appUser.role === 'admin') setCurrentRoute('/admin/overview');
      else if (appUser.role === 'faculty') setCurrentRoute('/faculty/overview');
      else setCurrentRoute('/student/overview');
      addToast(`Welcome back, ${appUser.name}! (${appUser.role.toUpperCase()})`, 'success');
      refreshDataFromDb();
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const signUp = async (params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    department?: string;
  }) => {
    const result = await authSignUp(params);
    if (result.success) {
      if (result.session && result.user) {
        const appUser = mapSupabaseUserToAppUser(result.user);
        setCurrentUser(appUser);
        if (appUser.role === 'admin') setCurrentRoute('/admin/overview');
        else if (appUser.role === 'faculty') setCurrentRoute('/faculty/overview');
        else setCurrentRoute('/student/overview');
        addToast(`Account created successfully! Welcome to CampusIQ, ${appUser.name}`, 'success');
        refreshDataFromDb();
      } else if (result.requiresEmailConfirmation) {
        addToast('Account created! Please check your email to confirm registration.', 'info');
      }
      return { success: true, requiresEmailConfirmation: result.requiresEmailConfirmation };
    }
    return { success: false, error: result.error };
  };

  const login = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentRoute('/admin/overview');
    } else if (user.role === 'faculty') {
      setCurrentRoute('/faculty/overview');
    } else {
      setCurrentRoute('/student/overview');
    }
    addToast(`Authenticated as ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  const logout = async () => {
    await authSignOut();
    setCurrentUser(null);
    setCurrentRoute('/login');
    addToast('Signed out of CampusIQ session', 'info');
  };

  // Filter students based on current role and active filters
  const filteredStudents = useMemo(() => {
    let list = students;

    if (currentUser?.role === 'faculty') {
      const allowedIds = new Set(currentUser.assignedStudentIds || []);
      list = list.filter(s => allowedIds.has(s.studentId) || s.mentorId === currentUser.id);
    } else if (currentUser?.role === 'student') {
      list = list.filter(s => s.studentId === currentUser.studentId);
    }

    if (selectedDepartment !== 'All') {
      list = list.filter(s => s.department === selectedDepartment);
    }
    if (selectedYear !== 'All') {
      list = list.filter(s => s.year === selectedYear);
    }
    if (selectedRiskFilter !== 'all') {
      list = list.filter(s => s.riskLevel === selectedRiskFilter);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    return list;
  }, [students, currentUser, selectedDepartment, selectedYear, selectedRiskFilter, searchQuery]);

  const addIntervention = (item: Omit<Intervention, 'id' | 'createdAt'>) => {
    const newId = `INT-${new Date().getFullYear()}-${(interventions.length + 1).toString().padStart(3, '0')}`;
    const newIntervention: Intervention = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInterventions(prev => [newIntervention, ...prev]);

    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New Intervention Created: ${item.studentName}`,
      message: `Action assigned to ${item.mentorName}: ${item.action}`,
      timestamp: 'Just now',
      read: false,
      type: 'mentor_update',
      targetRoute: '/admin/interventions',
      studentId: item.studentId,
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(`Intervention ${newId} logged for ${item.studentName}`, 'success');

    saveInterventionToDb({
      student_id: item.studentId,
      student_name: item.studentName,
      department: item.studentDept,
      type: item.type,
      severity: item.priority,
      title: item.action,
      description: item.notes,
      trigger_metrics: item.reason,
      status: 'Pending',
      assigned_to: item.mentorName,
      due_date: item.dueDate,
    }).catch(err => console.warn('Supabase intervention sync error:', err));
  };

  const updateInterventionStatus = (id: string, status: InterventionStatus, notes?: string, outcome?: string) => {
    setInterventions(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status,
          notes: notes ? `${inv.notes}\n[Update]: ${notes}` : inv.notes,
          outcome: outcome || inv.outcome,
          completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : inv.completedAt,
        };
      }
      return inv;
    }));
    addToast(`Intervention status updated to ${status.replace('_', ' ').toUpperCase()}`, 'info');

    updateInterventionInDb(id, status, notes).catch(err => console.warn('Update error:', err));
  };

  const toggleStudentAction = (actionId: string) => {
    setStudentActions(prev => prev.map(act => {
      if (act.id === actionId) {
        if (!act.isStudentSelfDirected && currentUser?.role === 'student') {
          addToast('This milestone requires faculty sign-off and cannot be completed directly.', 'warning');
          return act;
        }
        const nextStatus = act.status === 'completed' ? 'in_progress' : 'completed';
        return { ...act, status: nextStatus };
      }
      return act;
    }));
    addToast('Action status updated', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const importStudents = (newStudents: Student[]) => {
    setStudents(prev => {
      const map = new Map<string, Student>();
      prev.forEach(s => map.set(s.studentId, s));
      newStudents.forEach(s => map.set(s.studentId, s));
      return Array.from(map.values());
    });
    addToast(`Successfully merged ${newStudents.length} student records into database`, 'success');
  };

  const addStudyTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `TASK-${Date.now().toString().slice(-4)}`
    };
    setStudyTasks(prev => [newTask, ...prev]);

    setRecentActivities(prev => [
      { id: `ACT-${Date.now()}`, title: `Added study task: ${task.title}`, timestamp: 'Just now', type: 'task' },
      ...prev.slice(0, 7)
    ]);
    addToast(`Study task added: "${task.title}"`, 'success');

    saveStudyTaskToDb({
      title: task.title,
      subject: task.subject,
      due_date: task.deadline,
      estimated_minutes: task.estimatedMinutes,
      priority: task.priority,
      difficulty: 'Intermediate',
      completed: false,
      user_id: currentUser?.id,
    }).catch(err => console.warn('Supabase study task sync error:', err));
  };

  const toggleStudyTask = (taskId: string) => {
    setStudyTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        const isCompleted = nextStatus === 'completed';
        if (isCompleted) {
          setRecentActivities(acts => [
            { id: `ACT-${Date.now()}`, title: `Completed study task: ${t.title}`, timestamp: 'Just now', type: 'task' },
            ...acts.slice(0, 7)
          ]);
          addToast(`Marked task completed! +${t.estimatedMinutes} study minutes recorded`, 'success');
        }
        updateStudyTaskInDb(taskId, isCompleted).catch(err => console.warn('Task update error:', err));
        return {
          ...t,
          status: nextStatus,
          completedAt: isCompleted ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
  };

  const deleteStudyTask = (taskId: string) => {
    setStudyTasks(prev => prev.filter(t => t.id !== taskId));
    deleteStudyTaskFromDb(taskId).catch(err => console.warn('Task delete error:', err));
    addToast('Task removed from planner', 'info');
  };

  const updateTopicMastery = (subject: string, topic: string, newScore: number) => {
    setTopicMasteries(prev => {
      const idx = prev.findIndex(m => m.subject === subject && m.topic.toLowerCase() === topic.toLowerCase());
      const newStatus = newScore >= 80 ? 'mastered' : newScore >= 60 ? 'proficient' : 'needs_revision';
      let updatedItem: TopicMastery;
      if (idx >= 0) {
        const updated = [...prev];
        updatedItem = {
          ...updated[idx],
          masteryPercentage: Math.round(newScore),
          quizzesTaken: updated[idx].quizzesTaken + 1,
          lastPracticed: 'Today',
          status: newStatus
        };
        updated[idx] = updatedItem;
        upsertTopicMasteryInDb(updatedItem, currentUser?.id).catch(err => console.warn('Mastery error:', err));
        return updated;
      } else {
        updatedItem = {
          subject,
          topic,
          masteryPercentage: Math.round(newScore),
          quizzesTaken: 1,
          lastPracticed: 'Today',
          status: newStatus
        };
        upsertTopicMasteryInDb(updatedItem, currentUser?.id).catch(err => console.warn('Mastery error:', err));
        return [...prev, updatedItem];
      }
    });
  };

  const addFlashcard = (card: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...card,
      id: `FC-${Date.now()}`
    };
    setFlashcards(prev => [newCard, ...prev]);
    saveFlashcardToDb(card, currentUser?.id).catch(err => console.warn('Flashcard error:', err));
    addToast(`Flashcard "${newCard.topic}" added to your study deck!`, 'success');
  };

  const updateFlashcardStatus = (cardId: string, status: 'mastered' | 'learning' | 'needs_revision') => {
    setFlashcards(prev => prev.map(c => c.id === cardId ? { ...c, mastery: status, lastReviewed: 'Just now' } : c));
    updateFlashcardInDb(cardId, status).catch(err => console.warn('Flashcard update error:', err));
    addToast(`Flashcard marked as ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts(prev => [attempt, ...prev]);
    updateTopicMastery(attempt.subject, attempt.topic, attempt.percentage);
    saveQuizAttemptToDb(attempt, currentUser?.id).catch(err => console.warn('Quiz save error:', err));

    setRecentActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        title: `Completed ${attempt.subject} Quiz (${attempt.topic})`,
        timestamp: 'Just now',
        type: 'quiz',
        score: `${attempt.percentage}%`
      },
      ...prev.slice(0, 7)
    ]);

    if (attempt.percentage < 60) {
      addStudyTask({
        studentId: currentUser?.studentId || 'STU-2024-042',
        title: `Remedial Review: ${attempt.topic}`,
        subject: attempt.subject,
        topic: attempt.topic,
        deadline: 'In 2 days',
        priority: 'high',
        estimatedMinutes: 35,
        status: 'pending',
        source: 'quiz_remediation',
        notes: `Automated remediation task triggered by quiz score of ${attempt.percentage}%.`
      });
      addToast(`Quiz recorded (${attempt.percentage}%). High-priority review task added to your planner.`, 'warning');
    } else {
      addToast(`Quiz submitted! Excellent score of ${attempt.percentage}% recorded.`, 'success');
    }
  };

  // AI Study Tutor Actions
  const startNewTutorSession = (subject: string, mode: TutorMode = 'learn', level: TutorLevel = 'intermediate') => {
    const newId = `SESSION-${Date.now()}`;
    const newSession: TutorSession = {
      id: newId,
      title: `${subject} Study Sprint`,
      subject,
      mode,
      level,
      updatedAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: `Welcome to your new session on **${subject}** in **${mode.toUpperCase()}** mode (${level.toUpperCase()} level). Ask any doubt, request code breakdowns, or ask for an exam preparation answer!`,
          followUps: [
            `Explain the fundamental architecture of ${subject}`,
            `Give me a high-yield exam question for ${subject}`,
            `Generate a 3-question diagnostic quiz`
          ]
        }
      ]
    };
    setTutorSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    addToast(`New study session created for ${subject}`, 'info');
  };

  const sendTutorMessage = (
    text: string, 
    subject: string = 'DBMS', 
    mode: TutorMode = 'learn', 
    level: TutorLevel = 'intermediate'
  ) => {
    const userMsg: TutorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text
    };

    setTutorSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          updatedAt: 'Just now',
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

    setTimeout(() => {
      const activeSession = tutorSessions.find(s => s.id === currentSessionId);
      const assistantMsg = queryTutorEngine(
        text,
        subject,
        mode,
        level,
        activeSession?.messages || []
      );

      setTutorSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            updatedAt: 'Just now',
            messages: [...s.messages, assistantMsg]
          };
        }
        return s;
      }));

      setRecentActivities(acts => [
        { id: `ACT-${Date.now()}`, title: `Consulted AI Tutor on ${subject}`, timestamp: 'Just now', type: 'tutor' },
        ...acts.slice(0, 7)
      ]);

      saveTutorInquiryToDb({
        student_name: currentUser?.name || 'Student',
        subject,
        query_mode: mode,
        question: text,
        response: assistantMsg?.text?.slice(0, 500) || '',
      }).catch(err => console.warn('Supabase tutor sync error:', err));
    }, 450);
  };

  const saveTutorRecommendationToPlanner = (title: string, subject: string, topic: string) => {
    addStudyTask({
      studentId: currentUser?.studentId || 'STU-2024-042',
      title,
      subject,
      topic,
      deadline: 'In 3 days',
      priority: 'medium',
      estimatedMinutes: 30,
      status: 'pending',
      source: 'ai_recommended',
      notes: 'Generated directly from AI Study Tutor doubt-solving dialogue.'
    });
  };

  const learningAnalytics: StudentLearningAnalytics = useMemo(() => {
    const completedTasks = studyTasks.filter(t => t.status === 'completed');
    const totalMinutes = completedTasks.reduce((sum, t) => sum + t.estimatedMinutes, 90);
    const avgScore = quizAttempts.length > 0 
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizAttempts.length)
      : 78;
    const masteredCount = topicMasteries.filter(m => m.status === 'mastered').length;
    const revisionCount = topicMasteries.filter(m => m.status === 'needs_revision').length;

    return {
      studentId: currentUser?.studentId || 'STU-2024-042',
      weeklyStudyMinutes: totalMinutes,
      weeklyGoalMinutes: 180,
      tasksCompletedThisWeek: completedTasks.length,
      quizzesAttempted: quizAttempts.length + 8,
      averageQuizScore: avgScore,
      flashcardsReviewed: flashcards.filter(f => f.mastery !== 'learning').length + 12,
      masteredTopicsCount: masteredCount,
      revisionNeededCount: revisionCount,
      recentActivity: recentActivities,
      topicMasteries
    };
  }, [studyTasks, quizAttempts, topicMasteries, flashcards, recentActivities, currentUser]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authLoading,
        dbLoading,
        isDbConnected,
        currentRoute,
        navigate,
        login,
        logout,
        signIn,
        signUp,
        refreshDataFromDb,
        students,
        filteredStudents,
        interventions,
        studentActions,
        notifications,
        unreadNotificationCount,
        academicTerm,
        setAcademicTerm,
        selectedDepartment,
        setSelectedDepartment,
        selectedYear,
        setSelectedYear,
        selectedRiskFilter,
        setSelectedRiskFilter,
        searchQuery,
        setSearchQuery,
        addIntervention,
        updateInterventionStatus,
        toggleStudentAction,
        markNotificationRead,
        markAllNotificationsRead,
        importStudents,
        toasts,
        addToast,
        removeToast,
        selectedStudentId,
        setSelectedStudentId,

        // Learning & Tutor
        studyTasks,
        addStudyTask,
        toggleStudyTask,
        deleteStudyTask,
        topicMasteries,
        updateTopicMastery,
        flashcards,
        addFlashcard,
        updateFlashcardStatus,
        quizAttempts,
        recordQuizAttempt,
        learningAnalytics,
        tutorSessions,
        currentSessionId,
        setCurrentSessionId,
        startNewTutorSession,
        sendTutorMessage,
        saveTutorRecommendationToPlanner,

        // Inquiries Modal
        isInquiryModalOpen,
        inquiryDefaultType,
        openInquiryModal,
        closeInquiryModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
