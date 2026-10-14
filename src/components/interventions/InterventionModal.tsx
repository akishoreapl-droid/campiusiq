import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, InterventionPriority, InterventionType } from '../../types';
import { MENTORS } from '../../data/mockData';
import { X, Calendar, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudent?: Student | null;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  preselectedStudent,
}) => {
  const { students, addIntervention, currentUser } = useApp();

  const [studentId, setStudentId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [mentorId, setMentorId] = useState<string>(currentUser?.role === 'faculty' ? currentUser.id : MENTORS[0].id);
  const [priority, setPriority] = useState<InterventionPriority>('high');
  const [type, setType] = useState<InterventionType>('academic_remedial');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (preselectedStudent) {
      setStudentId(preselectedStudent.studentId);
      // Auto-populate factual reason based on student's actual metrics
      setReason(preselectedStudent.primaryRiskReasons[0] || 'Academic support & guidance required');
      if (preselectedStudent.placementReadinessScore < 60) {
        setAction('DSA Problem Solving Accelerator & 2 Technical Mock Interviews');
        setType('placement_training');
      } else if (preselectedStudent.attendancePercentage < 65) {
        setAction('Guardian counseling and attendance condonation recovery agreement');
        setType('attendance_counseling');
      } else {
        setAction('Structured subject remedial tutorial and backlog clearance sessions');
        setType('academic_remedial');
      }
      setPriority(preselectedStudent.riskLevel === 'high' ? 'high' : 'medium');
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].studentId);
      setReason(students[0].primaryRiskReasons[0] || 'Standard milestone follow-up');
    }

    // Default due date to 2 weeks from now
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setDueDate(d.toISOString().split('T')[0]);
  }, [preselectedStudent, isOpen]);

  if (!isOpen) return null;

  const currentSelectedStudent = students.find(s => s.studentId === studentId);
  const selectedMentor = MENTORS.find(m => m.id === mentorId) || MENTORS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedStudent) return;

    addIntervention({
      studentId: currentSelectedStudent.studentId,
      studentName: currentSelectedStudent.name,
      studentDept: currentSelectedStudent.department,
      reason,
      action,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      priority,
      type,
      dueDate,
      status: 'assigned',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2925]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-[#E2E6E1] shadow-xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E6E1] bg-[#F7F6F1]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#123D35] text-white rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#192A27]">Deploy Student Intervention Plan</h2>
              <p className="text-xs text-[#6D7975]">Directly assign structured academic or placement support</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#6D7975] hover:text-[#192A27] rounded-lg hover:bg-[#E2E6E1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
              Target Student
            </label>
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                const s = students.find(st => st.studentId === e.target.value);
                if (s) {
                  setReason(s.primaryRiskReasons[0] || 'Academic support & guidance required');
                }
              }}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
            >
              {students.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentId} — {s.name} ({s.department}, Year {s.year}) [Score: {s.studentSuccessScore}]
                </option>
              ))}
            </select>
          </div>

          {currentSelectedStudent && (
            <div className="p-3 bg-[#F7F6F1] rounded-lg border border-[#E2E6E1] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#6D7975]">Success Score: </span>
                <strong className="text-[#192A27] font-semibold">{currentSelectedStudent.studentSuccessScore}/100</strong>
                <span className="text-[#6D7975] ml-3">Attendance: </span>
                <strong className="text-[#192A27] font-semibold">{currentSelectedStudent.attendancePercentage}%</strong>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-medium ${
                currentSelectedStudent.riskLevel === 'high' 
                  ? 'bg-[#FDF0F0] text-[#C44B4B]' 
                  : 'bg-[#FBF4E8] text-[#C58A2A]'
              }`}>
                {currentSelectedStudent.riskLevel.toUpperCase()} RISK
              </span>
            </div>
          )}

          {/* Intervention Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
                Intervention Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InterventionType)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
              >
                <option value="academic_remedial">Academic Remedial Class</option>
                <option value="attendance_counseling">Attendance & Guardian Counseling</option>
                <option value="placement_training">Placement & Coding Bootcamp</option>
                <option value="mock_interview">Faculty Mock Interview Panel</option>
                <option value="mentor_checkin">1-on-1 Mentor Wellbeing Check-in</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as InterventionPriority)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
              >
                <option value="high">High (Action within 7 days)</option>
                <option value="medium">Medium (Standard 14 days)</option>
                <option value="low">Low (Long-term monitoring)</option>
              </select>
            </div>
          </div>

          {/* Trigger Reason */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
              Trigger Reason (Evidence-Grounded)
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Attendance 54% in Operating Systems with 2 course backlogs"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
            />
          </div>

          {/* Proposed Action */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975]">
                Prescribed Support Action
              </label>
              <span className="text-[11px] text-[#16856B] flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" /> AI Recommended
              </span>
            </div>
            <textarea
              rows={2}
              required
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Detailed remedial instructions, learning modules or meeting agenda..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
            />
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
                Responsible Mentor
              </label>
              <select
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
              >
                {MENTORS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.dept})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
                Target Resolution Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
                />
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6D7975] mb-1.5">
              Confidential Faculty / Advisor Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial observations, prior student correspondence..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E2E6E1] rounded-lg text-[#192A27] focus:outline-none focus:ring-2 focus:ring-[#16856B]/30 focus:border-[#16856B]"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E6E1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#6D7975] hover:text-[#192A27] hover:bg-[#F7F6F1] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#123D35] hover:bg-[#0B2925] rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Deploy Intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
