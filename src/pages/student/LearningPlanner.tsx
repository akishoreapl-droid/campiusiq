import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getWhatShouldIStudyNext } from '../../utils/plannerEngine';
import { StudyTask } from '../../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Trash2, 
  BookOpen, 
  Flame, 
  CheckSquare, 
  Square,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';

export const LearningPlanner: React.FC = () => {
  const { 
    studyTasks, 
    addStudyTask, 
    toggleStudyTask, 
    deleteStudyTask, 
    topicMasteries,
    learningAnalytics,
    navigate,
    addToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [aiPlanModalOpen, setAiPlanModalOpen] = useState(false);
  const [planGoal, setPlanGoal] = useState('exam');
  const [planHours, setPlanHours] = useState('2.5');

  // New Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('DSA');
  const [taskTopic, setTaskTopic] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('Tomorrow, 6:00 PM');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskMinutes, setTaskMinutes] = useState(30);

  const pendingTasks = studyTasks.filter(t => t.status !== 'completed');
  const nextStudyRecommendation = useMemo(() => {
    return getWhatShouldIStudyNext(topicMasteries, pendingTasks);
  }, [topicMasteries, pendingTasks]);

  const filteredTasks = useMemo(() => {
    return studyTasks.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (subjectFilter !== 'All' && t.subject !== subjectFilter) return false;
      return true;
    });
  }, [studyTasks, statusFilter, subjectFilter]);

  const completedCount = studyTasks.filter(t => t.status === 'completed').length;
  const progressPct = studyTasks.length > 0 ? Math.round((completedCount / studyTasks.length) * 100) : 0;
  const weeklyHoursProgress = Math.min(100, Math.round((learningAnalytics.weeklyStudyMinutes / learningAnalytics.weeklyGoalMinutes) * 100));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addStudyTask({
      studentId: 'STU-2024-042',
      title: taskTitle,
      subject: taskSubject,
      topic: taskTopic || taskSubject,
      deadline: taskDeadline,
      priority: taskPriority,
      estimatedMinutes: taskMinutes,
      status: 'pending',
      source: 'student_created'
    });

    setModalOpen(false);
    setTaskTitle('');
    setTaskTopic('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Personalized Learning Planner
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Adaptive Schedule
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Dynamic study roadmap prioritizing upcoming examinations, weak quiz topics, and faculty milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setAiPlanModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#123D35] bg-[#E8F5F1] hover:bg-[#d0ece3] rounded-xl border border-[#CCE8DA] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#16856B]" />
            <span>Generate AI Study Plan</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#123D35] hover:bg-[#0B2925] rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {/* ================= "WHAT SHOULD I STUDY NEXT?" HERO RECOMMENDATION ================= */}
      <div className="bg-gradient-to-r from-[#123D35] to-[#0B2925] text-white rounded-2xl p-6 shadow-sm border border-[#16856B]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                Recommended Focus Sprint
              </span>
              <span className="text-xs text-[#A9B5AC] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Est: {nextStudyRecommendation.estimatedDuration}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              {nextStudyRecommendation.recommendationTitle}
            </h2>

            <p className="text-xs text-[#D1D8D2] leading-relaxed">
              {nextStudyRecommendation.reason}
            </p>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-[#ECEAE1]">
              <strong className="text-emerald-300">Action Step: </strong>
              {nextStudyRecommendation.actionableStep}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/student/tutor')}
              className="px-4 py-2.5 bg-[#16856B] hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch AI Study Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/student/practice')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors text-center"
            >
              Take Practice Quiz
            </button>
          </div>
        </div>
      </div>

      {/* ================= METRIC SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <span className="text-xs font-semibold text-[#6D7975] uppercase text-[10px] block">Weekly Study Time</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-display text-[#123D35] tabular-nums">
              {Math.floor(learningAnalytics.weeklyStudyMinutes / 60)}h {learningAnalytics.weeklyStudyMinutes % 60}m
            </span>
            <span className="text-xs text-[#6D7975]">/ 3h goal</span>
          </div>
          <div className="w-full bg-[#F0EFEA] rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-[#16856B] h-full rounded-full" style={{ width: `${weeklyHoursProgress}%` }} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <span className="text-xs font-semibold text-[#6D7975] uppercase text-[10px] block">Study Task Progress</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-display text-[#192A27] tabular-nums">
              {completedCount} <span className="text-xs text-[#6D7975] font-normal">/ {studyTasks.length}</span>
            </span>
          </div>
          <p className="text-[11px] text-[#27845B] mt-1 font-medium">{progressPct}% completed</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <span className="text-xs font-semibold text-[#6D7975] uppercase text-[10px] block">Mastered Topics</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-display text-[#27845B] tabular-nums">
              {learningAnalytics.masteredTopicsCount}
            </span>
            <span className="text-xs text-[#6D7975]">concepts</span>
          </div>
          <p className="text-[11px] text-[#6D7975] mt-1">Score ≥ 80% on quizzes</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1] shadow-xs">
          <span className="text-xs font-semibold text-[#6D7975] uppercase text-[10px] block">Needs Revision</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-display text-[#C44B4B] tabular-nums">
              {learningAnalytics.revisionNeededCount}
            </span>
            <span className="text-xs text-[#6D7975]">concepts</span>
          </div>
          <p className="text-[11px] text-[#C44B4B] mt-1 font-medium">Automatic review queue</p>
        </div>
      </div>

      {/* ================= STUDY TASKS LIST & CONTROLS ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-5 space-y-4 shadow-xs">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E6E1]">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-xs font-bold text-[#6D7975] uppercase text-[10px] mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'pending', label: 'Pending' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === tab.id 
                    ? 'bg-[#123D35] text-white' 
                    : 'bg-[#F7F6F1] text-[#192A27] hover:bg-[#E8F5F1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg border border-[#E2E6E1] bg-[#F7F6F1] text-[#192A27]"
            >
              <option value="All">All Subjects</option>
              <option value="DSA">DSA</option>
              <option value="DBMS">DBMS</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
            </select>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6D7975]">
              No study tasks match current filter criteria.
            </div>
          ) : (
            filteredTasks.map(task => {
              const isCompleted = task.status === 'completed';
              const priorityBadge = {
                high: 'bg-[#FDF0F0] text-[#C44B4B] border-[#F8D2D2]',
                medium: 'bg-[#FBF4E8] text-[#C58A2A] border-[#F4DEC0]',
                low: 'bg-[#EBF7F1] text-[#27845B] border-[#CCE8DA]'
              }[task.priority];

              const sourceBadge = {
                ai_recommended: 'bg-[#E8F5F1] text-[#16856B]',
                quiz_remediation: 'bg-[#FDF0F0] text-[#C44B4B]',
                student_created: 'bg-[#F7F6F1] text-[#6D7975]',
                faculty_milestone: 'bg-[#123D35] text-white'
              }[task.source];

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isCompleted 
                      ? 'bg-[#F7F6F1]/50 border-[#E2E6E1]' 
                      : 'bg-white border-[#E2E6E1] hover:border-[#16856B] shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStudyTask(task.id)}
                      className="mt-0.5 text-[#16856B] hover:text-[#123D35]"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-[#27845B]" />
                      ) : (
                        <Square className="w-5 h-5 text-[#6D7975]" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-bold ${isCompleted ? 'line-through text-[#6D7975]' : 'text-[#192A27]'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${priorityBadge}`}>
                          {task.priority} Priority
                        </span>
                        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${sourceBadge}`}>
                          {task.source.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6D7975]">
                        <span>Subject: <strong className="text-[#192A27]">{task.subject}</strong> ({task.topic})</span>
                        <span>•</span>
                        <span>Est: <strong className="text-[#192A27]">{task.estimatedMinutes}m</strong></span>
                        <span>•</span>
                        <span>Deadline: <strong className="text-[#192A27]">{task.deadline}</strong></span>
                      </div>

                      {task.notes && (
                        <p className="text-xs text-[#6D7975] pt-0.5 leading-snug">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleStudyTask(task.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        isCompleted
                          ? 'bg-white text-[#27845B] border-[#CCE8DA]'
                          : 'bg-[#123D35] text-white hover:bg-[#0B2925] border-transparent'
                      }`}
                    >
                      {isCompleted ? 'Done' : 'Mark Completed'}
                    </button>
                    <button
                      onClick={() => deleteStudyTask(task.id)}
                      className="p-1 text-[#6D7975] hover:text-[#C44B4B] rounded"
                      title="Remove Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= CREATE STUDY TASK MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2925]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1] mb-4">
              <h3 className="text-base font-bold text-[#192A27]">Schedule New Study Task</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6D7975] hover:text-[#192A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 5 Graph Traversal problems on LeetCode"
                  className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16856B]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                    Subject
                  </label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg"
                  >
                    <option value="DSA">DSA</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                    Specific Topic
                  </label>
                  <input
                    type="text"
                    value={taskTopic}
                    onChange={(e) => setTaskTopic(e.target.value)}
                    placeholder="e.g. Dynamic Programming"
                    className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                    Estimated Minutes
                  </label>
                  <input
                    type="number"
                    min={10}
                    step={5}
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                  Target Due Date
                </label>
                <input
                  type="text"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  placeholder="e.g. Friday, 8:00 PM"
                  className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E6E1]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#6D7975] hover:text-[#192A27]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold text-xs rounded-lg"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= AI STUDY PLAN GENERATOR MODAL ================= */}
      {aiPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2925]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E6E1] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#E8F5F1] text-[#16856B]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#192A27]">AI Weekly Study Plan Generator</h3>
                  <p className="text-[11px] text-[#6D7975]">Synthesized from your diagnostic quiz weaknesses and upcoming milestones</p>
                </div>
              </div>
              <button onClick={() => setAiPlanModalOpen(false)} className="text-[#6D7975] hover:text-[#192A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                  Primary Learning Objective
                </label>
                <select
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg bg-[#F7F6F1] font-medium text-[#192A27]"
                >
                  <option value="exam">Upcoming Mid-Term Examination (Next 7 Days)</option>
                  <option value="placement">Placement Coding & Technical Core Sprint</option>
                  <option value="remediation">Remediate Weak Diagnostic Quiz Topics</option>
                  <option value="comprehensive">Balanced End-Semester Mastery Review</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                    Daily Study Allocation
                  </label>
                  <select
                    value={planHours}
                    onChange={(e) => setPlanHours(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg bg-[#F7F6F1]"
                  >
                    <option value="1.5">1.5 hours / day (Moderate)</option>
                    <option value="2.5">2.5 hours / day (Targeted Sprint)</option>
                    <option value="4.0">4.0 hours / day (Intensive Prep)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6D7975] uppercase mb-1">
                    Target Sprint Duration
                  </label>
                  <div className="w-full px-3 py-2 border border-[#E2E6E1] rounded-lg bg-[#F7F6F1] text-[#192A27] font-semibold">
                    7 Days (Adaptive Sprint)
                  </div>
                </div>
              </div>

              {/* Generated Plan Preview */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase text-[#16856B] block mb-2">
                  Generated Action Plan (4 Tailored Modules):
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {[
                    {
                      day: 'Day 1-2',
                      title: 'Review B+ Tree Indexing & Range Query Mechanics',
                      subject: 'DBMS',
                      time: '45 mins',
                      priority: 'high',
                      reason: 'Topic mastery is currently 58% in diagnostic bank'
                    },
                    {
                      day: 'Day 3',
                      title: '0/1 Knapsack DP Tabulation & 1D Array Optimization',
                      subject: 'DSA',
                      time: '60 mins',
                      priority: 'high',
                      reason: 'Essential tier-1 technical assessment pattern'
                    },
                    {
                      day: 'Day 4-5',
                      title: 'TCP 3-Way Handshake & Fast Retransmit Drills',
                      subject: 'Computer Networks',
                      time: '40 mins',
                      priority: 'medium',
                      reason: 'High-frequency university end-term blueprint topic'
                    },
                    {
                      day: 'Day 6-7',
                      title: 'Virtual Memory Page Replacement Algorithms (LRU vs FIFO)',
                      subject: 'Operating Systems',
                      time: '45 mins',
                      priority: 'medium',
                      reason: 'Targeting numerical question accuracy'
                    }
                  ].map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-[#E2E6E1] bg-[#F7F6F1] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#123D35] bg-white px-2 py-0.5 rounded border border-[#E2E6E1]">
                          {p.day}
                        </span>
                        <span className="text-[10px] font-semibold text-[#6D7975]">{p.time} • {p.subject}</span>
                      </div>
                      <p className="font-semibold text-xs text-[#192A27]">{p.title}</p>
                      <p className="text-[10px] text-[#6D7975]">{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E6E1]">
                <button
                  type="button"
                  onClick={() => setAiPlanModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#6D7975] hover:text-[#192A27]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Import all 4 tasks
                    const generatedTasks = [
                      {
                        title: 'Review B+ Tree Indexing & Range Query Mechanics',
                        subject: 'DBMS',
                        topic: 'Indexing & B+ Trees',
                        priority: 'high' as const,
                        estimatedMinutes: 45,
                        deadline: 'Tomorrow, 7:00 PM',
                        notes: 'Focus on leaf node pointers & fan-out calculation'
                      },
                      {
                        title: '0/1 Knapsack DP Tabulation & 1D Array Optimization',
                        subject: 'DSA',
                        topic: 'Dynamic Programming',
                        priority: 'high' as const,
                        estimatedMinutes: 60,
                        deadline: 'Wednesday, 6:00 PM',
                        notes: 'Subproblem recurrence and 1D sliding array memory optimization'
                      },
                      {
                        title: 'TCP 3-Way Handshake & Fast Retransmit Drills',
                        subject: 'Computer Networks',
                        topic: 'TCP & Congestion Control',
                        priority: 'medium' as const,
                        estimatedMinutes: 40,
                        deadline: 'Thursday, 5:00 PM',
                        notes: 'Sequence number negotiation and 3 duplicate ACKs'
                      },
                      {
                        title: 'Virtual Memory Page Replacement Algorithms (LRU vs FIFO)',
                        subject: 'Operating Systems',
                        topic: 'Virtual Memory & Paging',
                        priority: 'medium' as const,
                        estimatedMinutes: 45,
                        deadline: 'Friday, 8:00 PM',
                        notes: 'Numerical practice on reference strings'
                      }
                    ];

                    generatedTasks.forEach(gt => {
                      addStudyTask({
                        studentId: 'STU-2024-042',
                        title: gt.title,
                        subject: gt.subject,
                        topic: gt.topic,
                        deadline: gt.deadline,
                        priority: gt.priority,
                        estimatedMinutes: gt.estimatedMinutes,
                        status: 'pending',
                        source: 'ai_recommended',
                        notes: gt.notes
                      });
                    });

                    setAiPlanModalOpen(false);
                    addToast('Successfully imported 4 AI-recommended study tasks to your schedule!', 'success');
                  }}
                  className="px-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Apply 4 Tasks to My Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
