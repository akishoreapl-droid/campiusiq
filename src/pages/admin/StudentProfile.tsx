import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { ScoreBreakdown } from '../../components/ui/ScoreBreakdown';
import { InterventionModal } from '../../components/interventions/InterventionModal';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Award, 
  Briefcase, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  UserCheck, 
  FileText,
  Mail,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';

interface StudentProfileProps {
  studentIdParam?: string;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ studentIdParam }) => {
  const { students, currentRoute, navigate, interventions, learningAnalytics } = useApp();

  const [interventionModalOpen, setInterventionModalOpen] = useState(false);

  // Extract ID from route (e.g. /admin/students/STU-2024-042 or param)
  const routeParts = currentRoute.split('/');
  const routeStudentId = routeParts[routeParts.length - 1];
  const targetId = studentIdParam || (routeStudentId.startsWith('STU-') ? routeStudentId : 'STU-2024-042');

  const student = students.find(s => s.studentId === targetId) || students[0];

  // Interventions for this student
  const studentInterventions = interventions.filter(i => i.studentId === student.studentId);

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/students')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16856B] hover:text-[#123D35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Directory</span>
        </button>

        <span className="text-[11px] text-[#6D7975]">
          Student Intelligence Report · 100% Deterministic Fact Audit
        </span>
      </div>

      {/* ================= HEADER HERO CARD ================= */}
      <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E2E6E1]">
          <div className="flex items-start gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#16856B]/20 shadow-xs"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-[#192A27]">
                  {student.name}
                </h1>
                <span className="text-xs font-mono font-bold bg-[#F7F6F1] text-[#123D35] px-2 py-0.5 rounded border border-[#E2E6E1]">
                  {student.studentId}
                </span>
                <RiskBadge level={student.riskLevel} size="md" />
              </div>

              <p className="text-xs text-[#6D7975] flex flex-wrap items-center gap-2">
                <span>{student.department}</span>
                <span>•</span>
                <span>Year {student.year} (Semester {student.semester})</span>
                <span>•</span>
                <span>Advisor: <strong>{student.mentorName}</strong></span>
              </p>
            </div>
          </div>

          {/* Action to deploy intervention */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={() => setInterventionModalOpen(true)}
              className="px-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Deploy Intervention</span>
            </button>
          </div>
        </div>

        {/* Core KPI Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[11px] font-semibold uppercase text-[#6D7975] block">Student Success Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-display text-[#123D35] tabular-nums">
                {student.studentSuccessScore}
              </span>
              <span className="text-xs text-[#6D7975]">/100</span>
            </div>
            <span className="text-[10px] text-[#16856B] font-medium">Weighted composite index</span>
          </div>

          <div className="p-3.5 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[11px] font-semibold uppercase text-[#6D7975] block">Placement Readiness</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-bold font-display tabular-nums ${
                student.placementReadinessScore < 55 ? 'text-[#C58A2A]' : 'text-[#123D35]'
              }`}>
                {student.placementReadinessScore}
              </span>
              <span className="text-xs text-[#6D7975]">/100</span>
            </div>
            <span className="text-[10px] text-[#6D7975]">
              Coding: {student.codingScore} · Interviews: {student.mockInterviewsCompleted}
            </span>
          </div>

          <div className="p-3.5 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[11px] font-semibold uppercase text-[#6D7975] block">Classroom Attendance</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-bold font-display tabular-nums ${
                student.attendancePercentage < 65 ? 'text-[#C44B4B]' : student.attendancePercentage < 75 ? 'text-[#C58A2A]' : 'text-[#27845B]'
              }`}>
                {student.attendancePercentage}%
              </span>
            </div>
            <span className="text-[10px] text-[#6D7975]">
              {student.attendancePercentage < 65 ? '⚠ Condonation Risk' : 'Verified biometric registry'}
            </span>
          </div>

          <div className="p-3.5 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[11px] font-semibold uppercase text-[#6D7975] block">Academic CGPA</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-display text-[#192A27] tabular-nums">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-[#6D7975]">/10.0</span>
            </div>
            <span className="text-[10px] text-[#6D7975]">
              {student.backlogs > 0 ? `${student.backlogs} unresolved backlog(s)` : 'Clear examination record'}
            </span>
          </div>
        </div>
      </div>

      {/* ================= RISK EXPLANATION & RECOMMENDED INTERVENTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Explanation (Evidence-Based) */}
        <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E6E1] mb-3">
            <ShieldAlert className="w-4 h-4 text-[#C44B4B]" />
            <h2 className="text-sm font-bold text-[#192A27]">Factual Risk Drivers</h2>
          </div>
          <p className="text-xs text-[#6D7975] mb-3">
            Primary causes algorithmically derived from unified academic, attendance, and placement signals:
          </p>

          <div className="space-y-2.5">
            {student.primaryRiskReasons.map((reason, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg bg-[#FDF0F0] border border-[#F8D2D2] flex items-start gap-2.5 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-[#C44B4B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#192A27]">{reason}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Improvement Areas */}
          <div className="mt-4 pt-3 border-t border-[#E2E6E1] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#27845B] block mb-1.5 uppercase">Demonstrated Strengths</span>
              <ul className="space-y-1">
                {student.strengths.map((str, i) => (
                  <li key={i} className="text-[#192A27] flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-[#27845B] shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#C58A2A] block mb-1.5 uppercase">Improvement Areas</span>
              <ul className="space-y-1">
                {student.improvementAreas.map((imp, i) => (
                  <li key={i} className="text-[#192A27] flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-[#C58A2A] shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Intervention Roadmap */}
        <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#16856B]" />
                <h2 className="text-sm font-bold text-[#192A27]">Recommended Intervention Action</h2>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#E8F5F1] text-[#123D35]">
                Target Objective
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F6F1] border border-[#E2E6E1] space-y-2 mb-4">
              <span className="text-[11px] font-bold text-[#123D35] uppercase tracking-wider block">
                Prescribed Course of Action
              </span>
              <h4 className="text-sm font-bold text-[#192A27]">
                {student.placementReadinessScore < 55 && student.cgpa >= 7.5
                  ? 'Mandatory DSA Coding Bootcamp & 2 Faculty Mock Interviews'
                  : student.attendancePercentage < 65
                  ? 'Guardian Attendance Condonation Contract & Weekly Tutorial Hours'
                  : 'Core Technical Concept Remedial & Backlog Support Track'}
              </h4>
              <p className="text-xs text-[#6D7975] leading-relaxed">
                Objective: Address the {student.primaryRiskReasons[0]?.toLowerCase()} before the end-semester exam qualification freeze.
              </p>
            </div>

            {/* Existing Active Interventions for this student */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#192A27] block">
                Active Intervention History ({studentInterventions.length}):
              </span>
              {studentInterventions.length === 0 ? (
                <p className="text-xs text-[#6D7975] italic">No prior interventions logged for this student.</p>
              ) : (
                studentInterventions.map(inv => (
                  <div key={inv.id} className="p-2.5 rounded-lg border border-[#E2E6E1] bg-white text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#192A27]">{inv.action}</span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#E8F5F1] text-[#16856B]">
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6D7975] mt-1">{inv.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setInterventionModalOpen(true)}
            className="w-full mt-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Create / Update Intervention Record</span>
          </button>
        </div>
      </div>

      {/* ================= EXPLAINABLE SCORE BREAKDOWN ENGINE ================= */}
      <ScoreBreakdown
        factors={student.scoreBreakdown}
        title={`Explainable Success Score Breakdown (${student.studentSuccessScore}/100)`}
        subtitle="Transparent indicator contributions computed deterministically without black-box estimation"
      />

      {/* ================= ACADEMIC PERFORMANCE & SUBJECTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject-Level Performance Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E6E1] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Subject-Level Performance & Attendance</h2>
              <p className="text-xs text-[#6D7975]">Internal marks and verified classroom participation</p>
            </div>
            <BookOpen className="w-4 h-4 text-[#6D7975]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E6E1] text-[#6D7975] uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Marks</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6E1]/60">
                {student.subjectPerformance.map((subj, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F6F1]/60">
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-[#192A27] block">{subj.subject}</span>
                      <span className="text-[10px] text-[#6D7975] font-mono">{subj.code}</span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-bold text-[#192A27]">
                      {subj.marks}/100
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">
                      <span className={`${subj.attendance < 65 ? 'text-[#C44B4B] font-bold' : 'text-[#192A27]'}`}>
                        {subj.attendance}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        subj.status === 'critical'
                          ? 'bg-[#FDF0F0] text-[#C44B4B]'
                          : subj.status === 'average'
                          ? 'bg-[#FBF4E8] text-[#C58A2A]'
                          : 'bg-[#EBF7F1] text-[#27845B]'
                      }`}>
                        {subj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historical Assessment Trends */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E6E1] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-2">
            <div>
              <h2 className="text-sm font-bold text-[#192A27]">Historical Progress Trajectory</h2>
              <p className="text-xs text-[#6D7975]">Exam marks vs attendance over terms</p>
            </div>
            <TrendingUp className="w-4 h-4 text-[#6D7975]" />
          </div>

          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={student.historicalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E1" vertical={false} />
                <XAxis dataKey="term" stroke="#6D7975" fontSize={11} tickLine={false} />
                <YAxis domain={[30, 100]} stroke="#6D7975" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B2925', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#123D35" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="internalMarks" name="Marks" stroke="#16856B" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="lmsCompletion" name="LMS %" stroke="#C58A2A" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F6F1] text-[11px] text-[#6D7975]">
            <span className="font-semibold text-[#192A27]">Trend Insight: </span>
            {student.historicalTrends[student.historicalTrends.length - 1].attendance < student.historicalTrends[0].attendance
              ? 'Attendance has experienced a downward trend across the last 2 assessment windows.'
              : 'Attendance and assessment performance remain stable and consistent.'}
          </div>
        </div>
      </div>

      {/* ================= DIAGNOSTIC PRACTICE & AI LEARNING ACTIVITY ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E6E1] mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#192A27]">AI Study Tutor & Diagnostic Practice Analytics</h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#E8F5F1] text-[#16856B]">
                Formative Learning Insights
              </span>
            </div>
            <p className="text-xs text-[#6D7975] mt-0.5">
              Self-directed learning indicators derived from practice quizzes, AI doubt-solving sessions, and flashcard mastery.
            </p>
          </div>
          <span className="text-[11px] text-[#6D7975] bg-[#F7F6F1] px-2.5 py-1 rounded-md border border-[#E2E6E1]">
            Does not modify official transcript marks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[10px] font-bold uppercase text-[#6D7975] block">Self-Directed Study Volume</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-display text-[#123D35]">
                {Math.floor(learningAnalytics.weeklyStudyMinutes / 60)}h {learningAnalytics.weeklyStudyMinutes % 60}m
              </span>
              <span className="text-xs text-[#6D7975]">this week</span>
            </div>
            <span className="text-[10px] text-[#27845B]">
              Active across {learningAnalytics.tasksCompletedThisWeek} completed study tasks
            </span>
          </div>

          <div className="p-3 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[10px] font-bold uppercase text-[#6D7975] block">Diagnostic Quiz Average</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-display text-[#192A27]">
                {learningAnalytics.averageQuizScore}%
              </span>
              <span className="text-xs text-[#6D7975]">benchmark</span>
            </div>
            <span className="text-[10px] text-[#6D7975]">
              Derived from {learningAnalytics.quizzesAttempted} practice quizzes
            </span>
          </div>

          <div className="p-3 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1]">
            <span className="text-[10px] font-bold uppercase text-[#6D7975] block">Mastery Distribution</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-display text-[#27845B]">
                {learningAnalytics.masteredTopicsCount} Mastered
              </span>
              <span className="text-xs text-[#C44B4B] font-semibold">· {learningAnalytics.revisionNeededCount} Needs Focus</span>
            </div>
            <span className="text-[10px] text-[#6D7975]">
              Formative feedback for mentor reviews
            </span>
          </div>
        </div>
      </div>

      {/* ================= PLACEMENT INTELLIGENCE BREAKDOWN ================= */}
      <ScoreBreakdown
        factors={student.placementBreakdown}
        title={`Placement Readiness Breakdown (${student.placementReadinessScore}/100)`}
        subtitle="Evaluation across coding proficiency, core technicals, aptitude, and mock interviews"
      />

      {/* Modal */}
      <InterventionModal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        preselectedStudent={student}
      />
    </div>
  );
};
