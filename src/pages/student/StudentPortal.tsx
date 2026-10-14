import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Code, 
  Calendar, 
  CheckSquare, 
  Square, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  FileText,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export const StudentPortal: React.FC = () => {
  const { 
    currentUser, 
    students, 
    studentActions, 
    toggleStudentAction,
    learningAnalytics,
    topicMasteries,
    navigate,
    addToast
  } = useApp();

  // Find this student's profile
  const student = students.find(s => s.studentId === currentUser?.studentId) || students[0];

  // Actions for this student
  const myActions = studentActions.filter(a => a.studentId === student.studentId);
  const completedCount = myActions.filter(a => a.status === 'completed').length;
  const progressPct = myActions.length > 0 ? Math.round((completedCount / myActions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ================= A. WELCOME BANNER & STUDENT OVERVIEW ================= */}
      <div className="bg-gradient-to-r from-[#123D35] to-[#0B2925] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scholar Growth & AI Learning Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Welcome back, {student.name.split(' ')[0]}!
          </h1>

          <p className="text-sm text-[#D1D8D2] leading-relaxed">
            Here is your verified academic progress, skill benchmarks, and active milestones. Focus on your action plan items below to unlock higher campus recruitment tiers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#A9B5AC]">
            <span>ID: <strong className="text-white font-mono">{student.studentId}</strong></span>
            <span>•</span>
            <span>{student.department} · Year {student.year}</span>
            <span>•</span>
            <span>Faculty Mentor: <strong className="text-white">{student.mentorName}</strong></span>
          </div>
        </div>

        {/* Decorative backdrop motif */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Award className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* ================= NEW AI LEARNING SUITE QUICK-LAUNCH CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/student/tutor')}
          className="p-4 rounded-xl bg-white border border-[#E2E6E1] hover:border-[#16856B] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-[#E8F5F1] text-[#123D35] group-hover:bg-[#123D35] group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#E8F5F1] text-[#16856B]">
                AI Doubt Tutor
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#192A27] group-hover:text-[#123D35] mb-1">
              AI Study Tutor
            </h3>
            <p className="text-[11px] text-[#6D7975] line-clamp-2">
              Step-by-step doubt resolution in DBMS, DSA, OS, Networks & Math.
            </p>
          </div>
          <span className="text-[10px] text-[#16856B] font-semibold mt-3 flex items-center gap-1">
            Launch Chat Session <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/student/planner')}
          className="p-4 rounded-xl bg-white border border-[#E2E6E1] hover:border-[#16856B] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-[#E8F5F1] text-[#123D35] group-hover:bg-[#123D35] group-hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#FBF4E8] text-[#C58A2A]">
                Smart Planner
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#192A27] group-hover:text-[#123D35] mb-1">
              Learning Planner
            </h3>
            <p className="text-[11px] text-[#6D7975] line-clamp-2">
              "What should I study next?" schedule aligned with upcoming exams.
            </p>
          </div>
          <span className="text-[10px] text-[#16856B] font-semibold mt-3 flex items-center gap-1">
            Open Study Schedule <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/student/practice')}
          className="p-4 rounded-xl bg-white border border-[#E2E6E1] hover:border-[#16856B] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-[#E8F5F1] text-[#123D35] group-hover:bg-[#123D35] group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#EBF7F1] text-[#27845B]">
                Practice Lab
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#192A27] group-hover:text-[#123D35] mb-1">
              Quizzes & Flashcards
            </h3>
            <p className="text-[11px] text-[#6D7975] line-clamp-2">
              Diagnostic multi-choice quizzes and 3D flashcards for mastery.
            </p>
          </div>
          <span className="text-[10px] text-[#16856B] font-semibold mt-3 flex items-center gap-1">
            Practice Questions <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/student/career')}
          className="p-4 rounded-xl bg-white border border-[#E2E6E1] hover:border-[#16856B] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-[#E8F5F1] text-[#123D35] group-hover:bg-[#123D35] group-hover:text-white transition-colors">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#E8F5F1] text-[#123D35]">
                Placement Pro
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#192A27] group-hover:text-[#123D35] mb-1">
              Career & Placement Copilot
            </h3>
            <p className="text-[11px] text-[#6D7975] line-clamp-2">
              ATS resume score, role skill-gap analysis, and mock interviews.
            </p>
          </div>
          <span className="text-[10px] text-[#16856B] font-semibold mt-3 flex items-center gap-1">
            Explore Placement Tools <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* Metric Overview Cards (Student-Friendly, Non-Stigmatizing) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7975] mb-2 font-semibold">
            <span>Overall Success Index</span>
            <Sparkles className="w-4 h-4 text-[#16856B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-[#123D35] tabular-nums">
            {student.studentSuccessScore} <span className="text-xs text-[#6D7975] font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-[#27845B] mt-1 font-medium">
            Solid standing across academic indicators
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7975] mb-2 font-semibold">
            <span>Placement Readiness</span>
            <Code className="w-4 h-4 text-[#C58A2A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-[#192A27] tabular-nums">
            {student.placementReadinessScore} <span className="text-xs text-[#6D7975] font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-[#C58A2A] mt-1 font-medium">
            Priority: Practice coding challenges
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7975] mb-2 font-semibold">
            <span>Classroom Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-[#27845B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-[#192A27] tabular-nums">
            {student.attendancePercentage}%
          </div>
          <p className="text-[11px] text-[#27845B] mt-1 font-medium">
            Satisfies the 75% institutional threshold
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6D7975] mb-2 font-semibold">
            <span>Cumulative CGPA</span>
            <BookOpen className="w-4 h-4 text-[#123D35]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-[#192A27] tabular-nums">
            {student.cgpa.toFixed(2)} <span className="text-xs text-[#6D7975] font-normal">/ 10.0</span>
          </div>
          <p className="text-[11px] text-[#6D7975] mt-1">
            0 examination backlogs
          </p>
        </div>
      </div>

      {/* ================= B. STRENGTHS & OPPORTUNITIES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E6E1]">
            <CheckCircle2 className="w-5 h-5 text-[#27845B]" />
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Your Standout Strengths</h2>
              <p className="text-xs text-[#6D7975]">Validated areas where your performance is high</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {student.strengths.map((str, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#EBF7F1] border border-[#CCE8DA] text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#27845B] shrink-0" />
                <span className="font-semibold text-[#123D35]">{str}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#6D7975] italic pt-1">
            Maintaining this consistency protects your eligibility for campus placements.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E6E1]">
            <TrendingUp className="w-5 h-5 text-[#C58A2A]" />
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Key Growth Opportunities</h2>
              <p className="text-xs text-[#6D7975]">Targeted actions to elevate your placement readiness</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {student.improvementAreas.map((imp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#FBF4E8] border border-[#F4DEC0] text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#C58A2A] shrink-0" />
                <span className="font-semibold text-[#192A27]">{imp}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F6F1] text-[11px] text-[#6D7975]">
            💡 <strong>Advisor Note:</strong> "Raising your competitive coding score from 42 to 70 will immediately move you into the top Tier-1 recruitment bracket."
          </div>
        </div>
      </div>

      {/* ================= C. PERSONAL PROGRESS TRENDS ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E6E1] mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#192A27]">Your Academic & Attendance Trajectory</h2>
            <p className="text-xs text-[#6D7975]">Performance evolution across recent college milestones</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6D7975]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#123D35]" /> Attendance %</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16856B]" /> Internal Marks</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C58A2A]" /> LMS Completion</span>
          </div>
        </div>

        <div className="h-56 my-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={student.historicalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E1" vertical={false} />
              <XAxis dataKey="term" stroke="#6D7975" fontSize={11} tickLine={false} />
              <YAxis domain={[40, 100]} stroke="#6D7975" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0B2925', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#123D35" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="internalMarks" name="Exam Marks %" stroke="#16856B" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="lmsCompletion" name="LMS Submissions %" stroke="#C58A2A" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= D. PERSONALIZED ACTION PLAN ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E6E1]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#192A27]">Personalized Growth & Action Plan</h2>
              <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2 py-0.5 rounded-full">
                {completedCount} of {myActions.length} Completed ({progressPct}%)
              </span>
            </div>
            <p className="text-xs text-[#6D7975] mt-0.5">
              Self-directed practice challenges and faculty-supervised academic milestones.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-48 bg-[#F0EFEA] rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#16856B] h-full transition-all duration-300 rounded-full" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Action Items List */}
        <div className="space-y-3">
          {myActions.map((action) => {
            const isCompleted = action.status === 'completed';

            return (
              <div
                key={action.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#EBF7F1]/30 border-[#CCE8DA]'
                    : 'bg-white border-[#E2E6E1] hover:border-[#16856B]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStudentAction(action.id)}
                    className="mt-0.5 text-[#16856B] hover:text-[#123D35] shrink-0"
                    title={action.isStudentSelfDirected ? "Click to toggle completion" : "Faculty sign-off required"}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-[#27845B]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#6D7975]" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${isCompleted ? 'line-through text-[#6D7975]' : 'text-[#192A27]'}`}>
                        {action.title}
                      </h4>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                        action.isStudentSelfDirected 
                          ? 'bg-[#F7F6F1] text-[#123D35] border border-[#E2E6E1]' 
                          : 'bg-[#E8F5F1] text-[#16856B] border border-[#CCE8DA]'
                      }`}>
                        {action.isStudentSelfDirected ? 'Self-Directed' : 'Faculty Supervised'}
                      </span>
                    </div>

                    <p className="text-xs text-[#6D7975] leading-relaxed">
                      {action.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6D7975] pt-1">
                      <span>Reason: <strong className="text-[#192A27]">{action.reason}</strong></span>
                      <span>•</span>
                      <span>Due: <strong className="text-[#192A27]">{action.dueDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {action.isStudentSelfDirected ? (
                    <button
                      onClick={() => toggleStudentAction(action.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        isCompleted
                          ? 'bg-white text-[#27845B] border-[#CCE8DA]'
                          : 'bg-[#123D35] text-white hover:bg-[#0B2925] border-transparent'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#6D7975] italic">
                      Faculty sign-off
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
