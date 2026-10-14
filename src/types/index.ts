export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  department?: string;
  studentId?: string;
  assignedStudentIds?: string[];
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ScoreFactorBreakdown {
  factor: string;
  score: number; // 0-100 normalized
  weight: number; // percentage (e.g. 30 for 30%)
  contribution: number; // calculated points
  maxContribution: number;
  status: 'good' | 'warning' | 'critical';
  detail: string;
}

export interface HistoricalRecord {
  term: string; // e.g., 'Term 1', 'Mid-Term', 'Pre-Endsem', 'End-Term'
  attendance: number;
  internalMarks: number;
  lmsCompletion: number;
}

export interface SubjectGrade {
  code: string;
  subject: string;
  marks: number;
  attendance: number;
  status: 'good' | 'average' | 'critical';
}

export interface Student {
  studentId: string;
  name: string;
  email: string;
  department: string;
  year: number; // 1, 2, 3, 4
  semester: number;
  cgpa: number; // out of 10.0
  internalMarks: number; // 0-100
  backlogs: number;
  attendancePercentage: number; // 0-100
  lmsLoginFrequency: number; // logins per week
  assignmentCompletionPercentage: number; // 0-100
  engagementScore: number; // 0-100
  codingScore: number; // 0-100
  aptitudeScore: number; // 0-100
  technicalSkillsScore: number; // 0-100
  communicationScore: number; // 0-100
  mockInterviewsCompleted: number; // integer count
  feedbackScore: number; // 0-100
  mentorId: string;
  mentorName: string;
  avatar: string;
  historicalTrends: HistoricalRecord[];
  subjectPerformance: SubjectGrade[];

  // Computed & Explainable Engine Values
  studentSuccessScore: number;
  placementReadinessScore: number;
  riskLevel: RiskLevel;
  primaryRiskReasons: string[];
  scoreBreakdown: ScoreFactorBreakdown[];
  placementBreakdown: ScoreFactorBreakdown[];
  strengths: string[];
  improvementAreas: string[];
}

export type InterventionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed';
export type InterventionPriority = 'high' | 'medium' | 'low';
export type InterventionType = 
  | 'academic_remedial' 
  | 'attendance_counseling' 
  | 'placement_training' 
  | 'mock_interview' 
  | 'mentor_checkin';

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  studentDept: string;
  reason: string;
  action: string;
  mentorId: string;
  mentorName: string;
  priority: InterventionPriority;
  createdAt: string;
  dueDate: string;
  status: InterventionStatus;
  type: InterventionType;
  notes: string;
  outcome?: string;
  completedAt?: string;
}

export interface StudentActionItem {
  id: string;
  studentId: string;
  title: string;
  description: string;
  reason: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  isStudentSelfDirected: boolean;
  category: 'coding' | 'assignment' | 'attendance' | 'interview' | 'remedial';
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  percentage: number;
  primaryCharacteristics: string;
  suggestedStrategy: string;
  tag: string;
  colorScheme: 'amber' | 'red' | 'green' | 'pine';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'risk_flag' | 'intervention_due' | 'mentor_update' | 'task_completed';
  targetRoute?: string;
  studentId?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  finding?: string;
  metrics?: { label: string; value: string | number }[];
  affectedStudents?: Array<{ id: string; name: string; dept: string; score: number }>;
  recommendedAction?: string;
}

// ================= ADVANCED LEARNING & TUTOR TYPES =================

export type TutorMode = 'learn' | 'exam_prep' | 'revision' | 'career';
export type TutorLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  subject?: string;
  mode?: TutorMode;
  level?: TutorLevel;
  codeSnippet?: {
    language: string;
    code: string;
    explanation: string;
  };
  followUps?: string[];
  keyTakeaways?: string[];
  hasGeneratedQuiz?: boolean;
  quizPreview?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface TutorSession {
  id: string;
  title: string;
  subject: string;
  mode: TutorMode;
  level: TutorLevel;
  messages: TutorMessage[];
  updatedAt: string;
}

export interface StudyTask {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  topic: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  status: 'pending' | 'in_progress' | 'completed';
  source: 'ai_recommended' | 'quiz_remediation' | 'student_created' | 'faculty_milestone';
  completedAt?: string;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalQuestions: number;
  score: number;
  percentage: number;
  completedAt: string;
  answers: Record<number, number>; // question index -> chosen option
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  front: string;
  back: string;
  mastery: 'mastered' | 'learning' | 'needs_revision';
  lastReviewed?: string;
}

export interface TopicMastery {
  subject: string;
  topic: string;
  masteryPercentage: number;
  quizzesTaken: number;
  lastPracticed: string;
  status: 'mastered' | 'proficient' | 'needs_revision';
}

export interface StudentLearningAnalytics {
  studentId: string;
  weeklyStudyMinutes: number;
  weeklyGoalMinutes: number;
  tasksCompletedThisWeek: number;
  quizzesAttempted: number;
  averageQuizScore: number;
  flashcardsReviewed: number;
  masteredTopicsCount: number;
  revisionNeededCount: number;
  recentActivity: Array<{
    id: string;
    title: string;
    timestamp: string;
    type: 'quiz' | 'task' | 'tutor' | 'flashcard';
    score?: string;
  }>;
  topicMasteries: TopicMastery[];
}

export type TargetJobRole = 'sde_1' | 'data_engineer' | 'frontend_specialist' | 'cloud_devops' | 'system_engineer';

export interface ResumeReview {
  targetRole: string;
  overallScore: number;
  atsCompatibility: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  bulletPointFixes: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
}

export interface SkillGapItem {
  skill: string;
  category: 'core_cs' | 'coding' | 'system' | 'soft_skills';
  studentScore: number;
  targetBenchmark: number;
  gapStatus: 'mastered' | 'moderate_gap' | 'critical_gap';
  recommendation: string;
}

export interface MockInterviewExchange {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'system_architecture';
  studentAnswer?: string;
  feedback?: string;
  score?: number; // 1-10
  idealKeyPoints?: string[];
}

export interface MockInterviewSession {
  id: string;
  role: string;
  type: 'technical' | 'hr';
  exchanges: MockInterviewExchange[];
  currentQuestionIndex: number;
  status: 'in_progress' | 'completed';
  overallScore?: number;
  verdict?: string;
}

export interface AptitudeQuestion {
  id: string;
  category: 'quantitative' | 'logical' | 'verbal';
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  solution: string;
}
