import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSystemSegments } from '../../data/mockData';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { Student } from '../../types';
import { 
  Layers, 
  ArrowUpRight, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  BookOpen, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const RiskSegmentation: React.FC = () => {
  const { filteredStudents, navigate } = useApp();

  const segments = useMemo(() => {
    return calculateSystemSegments(filteredStudents);
  }, [filteredStudents]);

  const [activeSegmentId, setActiveSegmentId] = useState<string>(segments[0].id);

  // Filter students matching the active segment rule
  const matchedStudents = useMemo(() => {
    switch (activeSegmentId) {
      case 'seg-high-acad-low-placement':
        return filteredStudents.filter(s => (s.cgpa >= 7.5 || s.internalMarks >= 75) && s.placementReadinessScore < 55);
      case 'seg-low-attendance-declining':
        return filteredStudents.filter(s => s.attendancePercentage < 65 && s.internalMarks < 60);
      case 'seg-subject-specific-struggle':
        return filteredStudents.filter(s => s.attendancePercentage >= 75 && (s.backlogs > 0 || s.internalMarks < 55));
      case 'seg-star-performers':
        return filteredStudents.filter(s => s.studentSuccessScore >= 80 && s.placementReadinessScore >= 75);
      case 'seg-lms-disengagement':
        return filteredStudents.filter(s => s.assignmentCompletionPercentage < 50 || s.lmsLoginFrequency <= 2);
      case 'seg-compound-risk':
        return filteredStudents.filter(s => s.riskLevel === 'high' && (s.attendancePercentage < 60 && s.backlogs >= 1));
      default:
        return filteredStudents;
    }
  }, [activeSegmentId, filteredStudents]);

  const activeSegment = segments.find(s => s.id === activeSegmentId) || segments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Actionable Risk & Cohort Segmentation
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA]">
              Deterministic Rules
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Interpretable student clusters grouped by specific behavioral, academic, and placement vectors.
          </p>
        </div>

        <span className="text-xs text-[#6D7975] bg-white px-3 py-1.5 rounded-lg border border-[#E2E6E1]">
          {segments.length} Systematic Cohorts Active
        </span>
      </div>

      {/* ================= 6 SEGMENT CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((seg) => {
          const isActive = activeSegmentId === seg.id;
          const badgeStyles = {
            amber: 'bg-[#FBF4E8] text-[#C58A2A] border-[#F4DEC0]',
            red: 'bg-[#FDF0F0] text-[#C44B4B] border-[#F8D2D2]',
            green: 'bg-[#EBF7F1] text-[#27845B] border-[#CCE8DA]',
            pine: 'bg-[#E8F5F1] text-[#123D35] border-[#CCE8DA]',
          }[seg.colorScheme];

          return (
            <div
              key={seg.id}
              onClick={() => setActiveSegmentId(seg.id)}
              className={`p-5 rounded-xl border bg-white cursor-pointer transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-[#123D35] ring-2 ring-[#123D35]/10 shadow-sm'
                  : 'border-[#E2E6E1] hover:border-[#16856B]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${badgeStyles}`}>
                    {seg.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold font-display text-[#192A27] tabular-nums block">
                      {seg.studentCount}
                    </span>
                    <span className="text-[10px] text-[#6D7975]">{seg.percentage}% of campus</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#192A27] mb-1.5">{seg.name}</h3>
                <p className="text-xs text-[#6D7975] line-clamp-2 mb-3 leading-relaxed">
                  {seg.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E6E1]/70 text-[11px] text-[#123D35]">
                <strong className="text-[#6D7975]">Rule: </strong>
                <span>{seg.primaryCharacteristics}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ACTIVE SEGMENT DRILLDOWN VIEW ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#192A27]">{activeSegment.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F7F6F1] text-[#123D35] border border-[#E2E6E1]">
                {matchedStudents.length} Students Matching Rule
              </span>
            </div>
            <p className="text-xs text-[#6D7975] mt-1">{activeSegment.description}</p>
          </div>

          <div className="p-3 bg-[#F7F6F1] rounded-xl border border-[#E2E6E1] max-w-md">
            <span className="text-[10px] uppercase font-bold text-[#123D35] block mb-1">
              Prescribed Institutional Intervention
            </span>
            <p className="text-xs text-[#192A27] font-medium leading-snug">
              {activeSegment.suggestedStrategy}
            </p>
          </div>
        </div>

        {/* Matched Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E6E1] text-[#6D7975] uppercase text-[10px] font-semibold">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Success Score</th>
                <th className="py-2.5 px-3">Placement Index</th>
                <th className="py-2.5 px-3">Primary Risk Cause</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E1]/60">
              {matchedStudents.slice(0, 10).map((student) => (
                <tr key={student.studentId} className="hover:bg-[#F7F6F1]/60">
                  <td className="py-2.5 px-3">
                    <span 
                      onClick={() => navigate(`/admin/students/${student.studentId}`)}
                      className="font-bold text-[#192A27] hover:text-[#16856B] cursor-pointer block"
                    >
                      {student.name}
                    </span>
                    <span className="text-[10px] text-[#6D7975] font-mono">{student.studentId}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#192A27]">{student.department}</td>
                  <td className="py-2.5 px-3 tabular-nums font-bold text-[#192A27]">{student.cgpa.toFixed(2)}</td>
                  <td className="py-2.5 px-3 tabular-nums font-semibold text-[#192A27]">{student.attendancePercentage}%</td>
                  <td className="py-2.5 px-3 tabular-nums font-bold text-[#123D35]">{student.studentSuccessScore}/100</td>
                  <td className="py-2.5 px-3 tabular-nums font-bold text-[#192A27]">{student.placementReadinessScore}/100</td>
                  <td className="py-2.5 px-3 max-w-xs truncate text-[#6D7975]">{student.primaryRiskReasons[0]}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/students/${student.studentId}`)}
                      className="text-xs font-semibold text-[#16856B] hover:text-[#123D35] inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
