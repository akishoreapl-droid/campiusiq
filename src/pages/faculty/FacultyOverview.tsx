import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { InterventionModal } from '../../components/interventions/InterventionModal';
import { Student, InterventionStatus } from '../../types';
import { 
  Users, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  ExternalLink, 
  Search, 
  Calendar, 
  PlusCircle,
  FileText,
  Award,
  Sparkles
} from 'lucide-react';

export const FacultyOverview: React.FC = () => {
  const { 
    currentUser, 
    filteredStudents, 
    interventions, 
    updateInterventionStatus, 
    learningAnalytics,
    topicMasteries,
    navigate,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Authorized students assigned to this faculty mentor
  const myStudents = useMemo(() => {
    if (!currentUser) return [];
    const allowed = new Set(currentUser.assignedStudentIds || []);
    return filteredStudents.filter(s => allowed.has(s.studentId) || s.mentorId === currentUser.id);
  }, [filteredStudents, currentUser]);

  // Interventions for my students
  const myInterventions = useMemo(() => {
    if (!currentUser) return [];
    return interventions.filter(i => i.mentorId === currentUser.id || myStudents.some(s => s.studentId === i.studentId));
  }, [interventions, currentUser, myStudents]);

  const needingFollowUp = myStudents.filter(s => s.riskLevel === 'high' || s.attendancePercentage < 65);
  const pendingInterventions = myInterventions.filter(i => i.status === 'pending' || i.status === 'assigned');
  const completedInterventions = myInterventions.filter(i => i.status === 'completed');

  const searchedStudents = useMemo(() => {
    if (!search.trim()) return myStudents;
    const q = search.toLowerCase();
    return myStudents.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.studentId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  }, [myStudents, search]);

  return (
    <div className="space-y-6">
      {/* Faculty Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Mentor Academic Operations
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA]">
              Faculty Portal
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Welcome back, <strong>{currentUser?.name}</strong>. Managing assigned scholar cohorts and targeted milestones.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedStudentForModal(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Mentor Intervention</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Assigned Scholars"
          value={myStudents.length}
          context="Authorised mentee portfolio"
          icon={Users}
        />

        <MetricCard
          label="Needing Immediate Follow-up"
          value={needingFollowUp.length}
          context="Priority risk or <65% attendance"
          icon={ShieldAlert}
          badge={{ text: 'Action required', variant: 'critical' }}
        />

        <MetricCard
          label="Active Remedial Plans"
          value={pendingInterventions.length}
          context="Pending or in-progress workflows"
          icon={Clock}
          badge={{ text: 'In workflow', variant: 'warning' }}
        />

        <MetricCard
          label="Completed Interventions"
          value={completedInterventions.length}
          context="Successfully resolved milestones"
          icon={CheckCircle2}
          badge={{ text: 'Resolved', variant: 'positive' }}
        />
      </div>

      {/* ================= ASSIGNED STUDENTS TABLE ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E6E1]">
          <div>
            <h2 className="text-sm font-bold text-[#192A27]">My Assigned Mentee Roster ({myStudents.length})</h2>
            <p className="text-xs text-[#6D7975]">Authorized access restricted to designated faculty scholars only.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6D7975]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter mentees by name/ID..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-[#F7F6F1] border border-transparent rounded-lg text-[#192A27] placeholder-[#6D7975] focus:outline-none focus:bg-white focus:border-[#16856B]"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E6E1] text-[#6D7975] uppercase text-[10px] font-semibold">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Year / Dept</th>
                <th className="py-2.5 px-3">Success Score</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Risk Tier</th>
                <th className="py-2.5 px-3">Primary Risk Cause</th>
                <th className="py-2.5 px-3">Active Intervention</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E1]/60">
              {searchedStudents.map((student) => {
                const activeInv = myInterventions.find(i => i.studentId === student.studentId && i.status !== 'completed');

                return (
                  <tr key={student.studentId} className="hover:bg-[#F7F6F1]/60">
                    <td className="py-3 px-3">
                      <div 
                        onClick={() => navigate(`/admin/students/${student.studentId}`)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#E2E6E1]" 
                        />
                        <div>
                          <span className="font-bold text-[#192A27] group-hover:text-[#16856B] block">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-[#6D7975] font-mono">{student.studentId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-[#192A27] block">{student.department}</span>
                      <span className="text-[10px] text-[#6D7975]">Year {student.year} · Sem {student.semester}</span>
                    </td>

                    <td className="py-3 px-3 tabular-nums font-bold text-[#123D35]">
                      {student.studentSuccessScore}/100
                    </td>

                    <td className="py-3 px-3 tabular-nums">
                      <span className={`font-semibold ${
                        student.attendancePercentage < 65 ? 'text-[#C44B4B]' : 'text-[#192A27]'
                      }`}>
                        {student.attendancePercentage}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <RiskBadge level={student.riskLevel} size="sm" />
                    </td>

                    <td className="py-3 px-3 max-w-xs truncate text-[#6D7975]">
                      {student.primaryRiskReasons[0]}
                    </td>

                    <td className="py-3 px-3">
                      {activeInv ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-[#192A27] block truncate max-w-[150px]">
                            {activeInv.action}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#16856B]">
                            {activeInv.status} · Due {activeInv.dueDate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#6D7975] italic">No active task</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedStudentForModal(student);
                            setModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#123D35] hover:bg-[#0B2925] text-white transition-colors"
                        >
                          Intervene
                        </button>
                        <button
                          onClick={() => navigate(`/admin/students/${student.studentId}`)}
                          className="p-1 text-[#6D7975] hover:text-[#192A27]"
                          title="Inspect Student 360"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MENTEE LEARNING & DIAGNOSTIC ACTIVITY ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E6E1] mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#192A27]">Mentee Learning Analytics & Quiz Diagnostics</h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#E8F5F1] text-[#16856B]">
                AI Tutor & Practice Feed
              </span>
            </div>
            <p className="text-xs text-[#6D7975] mt-0.5">
              Live visibility into mentees' self-directed study hours, task completions, and identified topic-level learning deficits.
            </p>
          </div>
          <span className="text-xs text-[#6D7975] font-semibold">
            {learningAnalytics.tasksCompletedThisWeek} Tasks Completed This Week
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Study Progress Box */}
          <div className="p-4 rounded-xl bg-[#F7F6F1] border border-[#E2E6E1] space-y-2">
            <span className="text-xs font-bold text-[#192A27] uppercase text-[10px] block">Weekly Learning Volume</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display text-[#123D35]">
                {Math.floor(learningAnalytics.weeklyStudyMinutes / 60)}h {learningAnalytics.weeklyStudyMinutes % 60}m
              </span>
              <span className="text-xs text-[#6D7975]">logged</span>
            </div>
            <p className="text-[11px] text-[#27845B]">
              Active self-directed study engagement across DSA and DBMS.
            </p>
          </div>

          {/* Diagnostic Quiz Performance */}
          <div className="p-4 rounded-xl bg-[#F7F6F1] border border-[#E2E6E1] space-y-2">
            <span className="text-xs font-bold text-[#192A27] uppercase text-[10px] block">Average Practice Quiz Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display text-[#192A27]">
                {learningAnalytics.averageQuizScore}%
              </span>
              <span className="text-xs text-[#6D7975]">across {learningAnalytics.quizzesAttempted} quizzes</span>
            </div>
            <p className="text-[11px] text-[#6D7975]">
              Diagnostic scores update learning mastery without impacting official marks.
            </p>
          </div>

          {/* Flagged Topics for Mentoring */}
          <div className="p-4 rounded-xl bg-[#FDF0F0] border border-[#F8D2D2] space-y-2">
            <span className="text-xs font-bold text-[#C44B4B] uppercase text-[10px] block">
              Flagged Remedial Topics ({learningAnalytics.revisionNeededCount})
            </span>
            <div className="space-y-1">
              {topicMasteries.filter(m => m.status === 'needs_revision').slice(0, 2).map((m, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#192A27]">{m.topic} ({m.subject})</span>
                  <span className="font-bold text-[#C44B4B]">{m.masteryPercentage}%</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const s = myStudents.find(st => st.studentId === 'STU-2024-042') || myStudents[0];
                if (s) {
                  setSelectedStudentForModal(s);
                  setModalOpen(true);
                }
              }}
              className="text-[11px] font-bold text-[#C44B4B] hover:underline block pt-1"
            >
              + Prescribe Remedial Session for Deficit Topics
            </button>
          </div>
        </div>
      </div>

      {/* ================= ACTIVE INTERVENTION WORKFLOW LOGS ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#192A27]">Faculty Mentorship Action Log</h2>
            <p className="text-xs text-[#6D7975]">Track and update assigned student milestones</p>
          </div>
          <span className="text-xs font-semibold text-[#16856B]">
            {myInterventions.length} Logged Actions
          </span>
        </div>

        <div className="space-y-3">
          {myInterventions.map((inv) => (
            <div 
              key={inv.id}
              className="p-3.5 rounded-lg border border-[#E2E6E1] bg-[#F7F6F1]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#192A27]">{inv.studentName} ({inv.studentId})</span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-white border border-[#E2E6E1]">
                    {inv.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[#6D7975] font-medium">{inv.action}</p>
                <p className="text-[11px] text-[#6D7975]">Due Date: {inv.dueDate} · Notes: {inv.notes}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={inv.status}
                  onChange={(e) => updateInterventionStatus(inv.id, e.target.value as InterventionStatus)}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-[#E2E6E1] bg-white text-[#192A27]"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => updateInterventionStatus(inv.id, 'completed', undefined, 'Resolved in faculty review.')}
                  disabled={inv.status === 'completed'}
                  className="px-3 py-1 bg-[#27845B] hover:bg-[#1f6b49] disabled:opacity-40 text-white rounded font-medium text-xs"
                >
                  {inv.status === 'completed' ? 'Resolved' : 'Sign Off'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <InterventionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedStudent={selectedStudentForModal}
      />
    </div>
  );
};
